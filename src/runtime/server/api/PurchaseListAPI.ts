import { promises as fs } from "fs";
import * as path from "path";
import { defineEventHandler, readBody } from "h3";

class PurchaseListAPI {
	// Initial list data
	private purchaseList: Record<
		number,
		{ id: number; text: string; completed: boolean; hide: boolean }
	> = {
		1: { id: 1, text: "Milk", completed: false, hide: false },
		2: { id: 2, text: "Bread", completed: true, hide: false },
		3: { id: 3, text: "Butter", completed: false, hide: false },
	};
	// Last used ID
	private lastId = 3;
	// Initialization flag
	private initialized = false;
	// Path to the file with the list data
	private dataFilePath = path.join(
        process.cwd(),
        "src", 
        "runtime",
        "data",
        "purchase-list.json"
    );

	// Initialize the list from the file or create a new one with initial data
	initializeList() {
		return fs
			.readFile(this.dataFilePath, "utf8")
			.then((data) => {
				this.purchaseList = JSON.parse(data);
				const maxId = Object.keys(this.purchaseList).reduce(
					(max, key) => Math.max(max, Number(key)),
					0
				);
				this.lastId = maxId;
				this.initialized = true;
			})
			.catch(() => {
				return fs
					.mkdir(path.dirname(this.dataFilePath), { recursive: true })
					.then(() =>
						fs.writeFile(
							this.dataFilePath,
							JSON.stringify(this.purchaseList, null, 2)
						)
					)
					.then(() => {
						this.initialized = true;
					});
			});
	}

	// Save the list data to the file
	savePurchaseList() {
		return fs.writeFile(
			this.dataFilePath,
			JSON.stringify(this.purchaseList, null, 2)
		);
	}

	// Get the list of items
	getList() {
		if (!this.initialized) {
			return this.initializeList().then(() => this.purchaseList);
		}
		return Promise.resolve(this.purchaseList);
	}

	// Add a new item to the list
	addItem(text: any, completed: boolean = false, hide: boolean = false) {
		return (
			!this.initialized ? this.initializeList() : Promise.resolve()
		).then(() => {
			const newItem = { id: ++this.lastId, text, completed, hide };
			this.purchaseList[newItem.id] = newItem;
			return this.savePurchaseList().then(() => newItem);
		});
	}

	// Toggle the completed status of an item
	toggleItem(id: number) {
		return (
			!this.initialized ? this.initializeList() : Promise.resolve()
		).then(() => {
			const item = this.purchaseList[id];
			if (item) {
				item.completed = !item.completed;
				return this.savePurchaseList().then(() => item);
			}
			return item;
		});
	}

	// Remove items from the list
	deleteItems(ids: number[]) {
		return (
			!this.initialized ? this.initializeList() : Promise.resolve()
		).then(() => {
			for (const id of ids) {
				delete this.purchaseList[id];
			}
			return this.savePurchaseList().then(() => ({ success: true }));
		});
	}

	// Clear the list
	clearList() {
		return (
			!this.initialized ? this.initializeList() : Promise.resolve()
		).then(() => {
			this.purchaseList = {};
			return this.savePurchaseList().then(() => ({ success: true }));
		});
	}
}

// Create an instance of the PurchaseListAPI class
const purchaseListService = new PurchaseListAPI();

// Define the event handler to process requests to the purchase list API
export default defineEventHandler((event) => {
	const method = event.node.req.method;

	if (method === "GET") {
		return purchaseListService.getList();
	}

	if (method === "POST") {
		return readBody(event).then((body) =>
			purchaseListService.addItem(body.text, body.completed)
		);
	}

	if (method === "PUT") {
		return readBody(event).then((body) =>
			purchaseListService.toggleItem(body.id)
		);
	}

	if (method === "DELETE") {
		return readBody(event).then((body) => {
			if (body && body.action === "clear") {
				return purchaseListService.clearList();
			}
			if (body && body.action === "remove" && Array.isArray(body.ids)) {
				return purchaseListService.deleteItems(body.ids);
			}
		});
	}
});
