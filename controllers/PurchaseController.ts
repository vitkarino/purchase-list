import { reactive, ref } from "vue";
import { PurchaseItem } from "~/models/PurchaseModel";

const baseUrl = import.meta.server ? "http://localhost:3000" : "";

export class PurchaseController {
	public items = reactive<Record<string, PurchaseItem>>({});
	public filter = ref<"all" | "done" | "undone">("all");

	constructor() {
		this.fetchItems();
	}

	private fetch<T = any>(method: string, body?: any): Promise<T> {
		return fetch(`${baseUrl}/api/PurchaseListAPI`, {
			method,
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : undefined,
		}) .then(async (response) => {
			if (!response.ok) {
			  throw new Error(`Fetch error: ${response.status}`);
			}
			const text = await response.text();
			return text ? JSON.parse(text) : {};
		  });
	}

	fetchItems() {
		this.fetch("GET")
			.then((data) => {
				for (const key in this.items) {
					delete this.items[key];
				}
				for (const key in data) {
					this.items[key] = new PurchaseItem(data[key]);
				}
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	addItem(text: string) {
		this.fetch("POST", { text })
			.then((newItem) => {
				const purchaseItem = new PurchaseItem(newItem);
				this.items[purchaseItem.id.toString()] = purchaseItem;
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	toggleItem(id: number) {
		this.fetch("PUT", { id })
			.then((updatedItem) => {
				const key = id.toString();
				if (this.items[key]) {
					this.items[key] = new PurchaseItem(updatedItem);
				}
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	hideItem(ids: number[]) {
		for (const id of ids) {
			const key = id.toString();
			if (this.items[key]) {
				this.items[key].hide = true;
			}
		}
	}

	showItem(ids: number[]) {
		for (const id of ids) {
			const key = id.toString();
			if (this.items[key]) {
				this.items[key].hide = false;
			}
		}
	}

	removeItem(ids: number[]) {
		this.fetch("DELETE", { action: "remove", ids })
			.then(() => {
				for (const id of ids) {
					const key = id.toString();
					delete this.items[key];
				}
			})
			.catch((error) => {
				console.error("Delete error:", error);
			});
	}

	clearList() {
		this.fetch("DELETE", { action: "clear" })
			.then(() => {
				for (const key in this.items) {
					delete this.items[key];
				}
			})
			.catch((error) => {
				console.error("Clear error:", error);
			});
	}

	setFilter(filter: "all" | "done" | "undone") {
		this.filter.value = filter;
	}

	getFilteredItems(): PurchaseItem[] {
		return Object.values(this.items).filter((item: PurchaseItem) => {
			if (item.hide) {
			 	return false;
			}
			if (this.filter.value === "done") {
				return item.completed;
			}

			if (this.filter.value === "undone") {
				return !item.completed;
			}

			return true;
		});
	}
}
