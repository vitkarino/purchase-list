import { PurchaseItem } from "../models/PurchaseModel";

// The base URL for the API
const baseUrl = import.meta.server ? "http://localhost:3000" : "";

const apiEndpoint =
	(typeof window !== "undefined" &&
		window.__NUXT__?.config?.public?.purchaseList?.apiEndpoint) ||
	"/api/purchase-list";

export class PurchaseController {
	public items = reactive<Record<string, PurchaseItem>>({});
	public filter = ref<"all" | "done" | "undone">("all");

	constructor() {
		this.fetchItems();
	}

	// Custom fetch method to handle API requests without unnecessary code duplication
	private fetch<T = any>(method: string, body?: any): Promise<T> {
		const url = `${baseUrl}${apiEndpoint}`;

		return fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : undefined,
		}).then(async (response) => {
			if (!response.ok) {
				throw new Error(
					`API error: ${response.status} ${response.statusText}`
				);
			}
			const text = await response.text();
			return text ? JSON.parse(text) : {};
		});
	}

	// Fetch the list of items from the server
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

	// Add a new item to the list
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

	// Toggle the completed status of an item
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

	// Hide an item from the list
	hideItem(ids: number[]) {
		for (const id of ids) {
			const key = id.toString();
			if (this.items[key]) {
				this.items[key].hide = true;
			}
		}
	}

	// Show a hidden item
	showItem(ids: number[]) {
		for (const id of ids) {
			const key = id.toString();
			if (this.items[key]) {
				this.items[key].hide = false;
			}
		}
	}

	// Remove an item from the list
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

	// Clear the list
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

	// Set filter to show all, done, or undone items
	setFilter(filter: "all" | "done" | "undone") {
		this.filter.value = filter;
	}

	// Get the list of items
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
