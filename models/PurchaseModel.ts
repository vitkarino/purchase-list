import PurchaseItem from "./PurchaseItem";

export default class PurchaseModel {
  items: PurchaseItem[];
  text: string = "";

  constructor() {
    this.items = [];
  }

  addItem(): void {
    if (!this.text.trim()) return;
    this.items.push(new PurchaseItem(this.text.trim()));
    this.text = "";
  }

  checkItemCompletion(id: number): void {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.completed = !item.completed;
    }
  }

  removeItem(id: number): void { 
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  clearItems(): void {
    this.items = [];
  }
}