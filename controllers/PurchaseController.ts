import { reactive, ref } from "vue";
import { PurchaseItem } from "~/models/PurchaseModel";

const baseUrl = import.meta.server ? "http://localhost:3000" : "";

export class PurchaseController {
	public items = reactive<PurchaseItem[]>([]);
	public filter = ref<"all" | "done" | "undone">("all");
	public lastRemovedItem = ref<{ item: PurchaseItem; index: number } | null>(
		null
	);
	public showUndoNotification = ref<boolean>(false);
	public lastClearedItems = ref<PurchaseItem[]>([]);
	public notificationType = ref<"remove" | "clear">("remove");
	private notificationTimeout: NodeJS.Timeout | null = null;

	constructor() {
		this.fetchItems();
	}

	fetchItems() {
		fetch(`${baseUrl}/api/PurchaseListAPI`)
			.then((response) => response.json())
			.then((data) => {
				this.items.splice(
					0,
					this.items.length,
					...(Object.values(data) as PurchaseItem[])
				);
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	addItem(text: string) {
		fetch(`${baseUrl}/api/PurchaseListAPI`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		})
			.then((response) => response.json())
			.then((newItem) => {
				this.items.push(newItem);
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	toggleItem(id: number) {
		fetch(`${baseUrl}/api/PurchaseListAPI`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})
			.then((response) => response.json())
			.then((updatedItem) => {
				const index = this.items.findIndex(
					(item) => item.id === updatedItem.id
				);
				if (index !== -1) {
					this.items[index] = updatedItem;
				}
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	removeItem(id: number) {
		const index = this.items.findIndex((i) => i.id === id);
		if (index !== -1) {
			this.lastRemovedItem.value = {
				item: { ...this.items[index] },
				index: index,
			};

			fetch(`${baseUrl}/api/PurchaseListAPI`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			})
				.then(() => {
					this.items.splice(index, 1);

					this.notificationType.value = "remove";
					this.showUndoNotification.value = true;

					if (this.notificationTimeout) {
						clearTimeout(this.notificationTimeout);
					}

					this.notificationTimeout = setTimeout(() => {
						this.showUndoNotification.value = false;
						this.lastRemovedItem.value = null;
						this.notificationTimeout = null;
					}, 5000);
				})
				.catch((error) => {
					console.error("Fetch error:", error);
				});
		}
	}

	undoAction() {
		if (this.notificationType.value === "clear") {
			if (!this.lastClearedItems.value.length) return;

			const promises = this.lastClearedItems.value.map((item) =>
				fetch(`${baseUrl}/api/PurchaseListAPI`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						text: item.text,
						completed: item.completed,
					}),
				}).then((response) => response.json())
			);

			Promise.all(promises)
				.then((restoredItems) => {
					this.items.splice(0, this.items.length, ...restoredItems);
					this.showUndoNotification.value = false;
					this.lastClearedItems.value = [];
				})
				.catch((error) => console.error("Undo clear error:", error));
		} else if (this.notificationType.value === "remove") {
			if (!this.lastRemovedItem.value) return;

			const { item, index } = this.lastRemovedItem.value;

			fetch(`${baseUrl}/api/PurchaseListAPI`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: item.text,
					completed: item.completed,
				}),
			})
				.then((response) => response.json())
				.then((restoredItem) => {
					const insertPosition = Math.min(index, this.items.length);
					this.items.splice(insertPosition, 0, restoredItem);
					this.showUndoNotification.value = false;
					this.lastRemovedItem.value = null;
				})
				.catch((error) => console.error("Undo remove error:", error));
		}
	}

	clearList() {
		if (!window.confirm("Do you want to clear the purchase list?")) return;

		this.lastClearedItems.value = [...this.items];

		fetch(`${baseUrl}/api/PurchaseListAPI`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "clear" }),
		})
			.then(() => {
				this.items.splice(0, this.items.length);

				this.notificationType.value = "clear";
				this.showUndoNotification.value = true;

				if (this.notificationTimeout) {
					clearTimeout(this.notificationTimeout);
				}

				this.notificationTimeout = setTimeout(() => {
					this.showUndoNotification.value = false;
					this.lastClearedItems.value = [];
					this.notificationTimeout = null;
				}, 5000);
			})
			.catch((error) => {
				console.error("Fetch error:", error);
			});
	}

	setFilter(filter: "all" | "done" | "undone") {
		this.filter.value = filter;
	}

	getFilteredItems() {
		if (this.filter.value === "done") {
			return this.items.filter((item) => item.completed);
		}
		if (this.filter.value === "undone") {
			return this.items.filter((item) => !item.completed);
		}
		return this.items;
	}
}
