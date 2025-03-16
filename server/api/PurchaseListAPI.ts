import { promises as fs } from 'fs';
import path from 'path';

class PurchaseListAPI {
  private purchaseList = [
    { id: 1, text: 'Milk', completed: false },
    { id: 2, text: 'Bread', completed: true },
    { id: 3, text: 'Butter', completed: false }
  ];
  private lastId = 3;
  private initialized = false;
  private dataFilePath = path.join(process.cwd(), 'data', 'purchase-list.json');

  initializeList() {
    return fs.readFile(this.dataFilePath, 'utf8')
      .then(data => {
        this.purchaseList = JSON.parse(data);
        this.lastId = this.purchaseList.reduce(
          (max, item) => Math.max(max, item.id),
          0
        );
        this.initialized = true;
      })
      .catch(() => {
        return fs.mkdir(path.dirname(this.dataFilePath), { recursive: true })
          .then(() => fs.writeFile(
            this.dataFilePath, 
            JSON.stringify(this.purchaseList, null, 2)
          ))
          .then(() => {
            this.initialized = true;
          });
      });
  }

  savePurchaseList() {
    return fs.writeFile(
      this.dataFilePath,
      JSON.stringify(this.purchaseList, null, 2)
    );
  }

  getList() {
    if (!this.initialized) {
      return this.initializeList().then(() => this.purchaseList);
    }
    return Promise.resolve(this.purchaseList);
  }

  addItem(text: any) {
    return (!this.initialized ? this.initializeList() : Promise.resolve())
      .then(() => {
        const newItem = { id: ++this.lastId, text, completed: false };
        this.purchaseList.push(newItem);
        return this.savePurchaseList().then(() => newItem);
      });
  }

  toggleItem(id: number) {
    return (!this.initialized ? this.initializeList() : Promise.resolve())
      .then(() => {
        const item = this.purchaseList.find(i => i.id === id);
        if (item) {
          item.completed = !item.completed;
          return this.savePurchaseList().then(() => item);
        }
        return item;
      });
  }

  deleteItem(id: number) {
    return (!this.initialized ? this.initializeList() : Promise.resolve())
      .then(() => {
        this.purchaseList = this.purchaseList.filter(i => i.id !== id);
        return this.savePurchaseList().then(() => ({ success: true }));
      });
  }

  clearList() {
    return (!this.initialized ? this.initializeList() : Promise.resolve())
      .then(() => {
        this.purchaseList = [];
        return this.savePurchaseList().then(() => ({ success: true }));
      });
  }
}

const purchaseListService = new PurchaseListAPI();

export default defineEventHandler((event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    return purchaseListService.getList();
  }

  if (method === 'POST') {
    return readBody(event).then(body => 
      purchaseListService.addItem(body.text)
    );
  }

  if (method === 'PUT') {
    return readBody(event).then(body => 
      purchaseListService.toggleItem(body.id)
    );
  }

  if (method === 'DELETE') {
    return readBody(event).then(body => {
      if (body && body.action === 'clear') {
        return purchaseListService.clearList();
      }
      if (body && body.id) {
        return purchaseListService.deleteItem(body.id);
      }
    });
  }
});