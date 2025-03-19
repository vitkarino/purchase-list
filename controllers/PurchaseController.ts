import { reactive, ref } from "vue";
import { PurchaseItem } from "~/models/PurchaseModel";

const baseUrl = import.meta.server ? "http://localhost:3000" : "";

export class PurchaseController {
	public items = reactive<PurchaseItem[]>([]);
	public filter = ref<"all" | "done" | "undone">("all");

	constructor() {
		this.fetchItems();
	}

	private customFetch<T = any>(method: string, body?: any): Promise<T> {
		return fetch(`${baseUrl}/api/PurchaseListAPI`, {
			method,
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : undefined,
		}).then((response) => response.json());
	}

	fetchItems() {
		this.customFetch("GET")
			.then((data) => {
				this.items.splice(0, this.items.length);
				if (!Array.isArray(data)) {
					for (const key in data) {
						this.items.push(new PurchaseItem(data[key]));
					}
				} else {
					this.items.push(
						...data.map((item) => new PurchaseItem(item))
					);
				}
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	addItem(text: string) {
		this.customFetch("POST", { text })
			.then((newItem) => {
				this.items.push(new PurchaseItem(newItem));
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	toggleItem(id: number) {
		this.customFetch("PUT", { id })
			.then((updatedItem) => {
				const index = this.items.findIndex(
					(i) => i.id === updatedItem.id
				);
				if (index !== -1) {
					this.items[index] = new PurchaseItem(updatedItem);
				}
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	hideItems(ids: number[]) {
		for (const id of ids) {
			const index = this.items.findIndex((i) => i.id === id);
			if (index !== -1) {
				this.items.splice(index, 1);
			}
		}
	}

	hideAllItems() {
		this.items.splice(0, this.items.length);
	}

	customDeleteItem(id: number) {
		this.customFetch("DELETE", { action: "remove", id }).catch((error) => {
			console.error("Delete error:", error);
			this.fetchItems();
		});
	}

	customClearList() {
		this.customFetch("DELETE", { action: "clear" }).catch((error) => {
			console.error("Clear error:", error);
			this.fetchItems();
		});
	}

	setFilter(filter: "all" | "done" | "undone") {
		this.filter.value = filter;
	}

	getFilteredItems() {
		return this.items.filter((item) => {
			if (this.filter.value === "done") return item.completed;
			if (this.filter.value === "undone") return !item.completed;
			return true;
		});
	}
}
