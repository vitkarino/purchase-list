import { PurchaseController } from "~/controllers/PurchaseController";
import { computed, ref } from "vue";

export class PurchaseListUI {
	private controller: PurchaseController;
	public readonly filteredItems;
	public undoNotifications: any = null;
	private pendingItems = ref<{ ids: number[]; type: "remove" | "clear" }>({
		ids: [],
		type: "remove",
	});
	private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		this.controller = new PurchaseController();
		this.filteredItems = computed(() => this.controller.getFilteredItems());
	}

	addItem(text: string) {
		this.controller.addItem(text);
	}

	toggleItem(id: number) {
		this.controller.toggleItem(id);
	}

	removeItem(id: number) {
		this.hideItems([id], "remove")
			.then(() => this.showNotification("remove"))
			.then((confirmed) => {
				if (!confirmed) {
					this.controller.fetchItems();
				} else {
					this.controller.customDeleteItem(id);
				}
			});
	}

	undoAction() {
		if (this.notificationTimeout) {
			clearTimeout(this.notificationTimeout);
			this.notificationTimeout = null;

			this.controller.fetchItems();

			if (this.undoNotifications.value) {
				this.undoNotifications.value.hide();
			}
		}
	}

	clearList() {
		const itemIds = this.controller
			.getFilteredItems()
			.map((item) => item.id);

		if (itemIds.length === 0) return;

		if (window.confirm("Are you sure you want to clear the list?")) {
			this.hideItems(itemIds, "clear")
				.then(() => this.showNotification("clear"))
				.then((confirmed) => {
					if (!confirmed) {
						this.controller.fetchItems();
					} else {
						this.controller.customClearList();
					}
				});
		}
	}

	setFilter(filter: "all" | "done" | "undone") {
		this.controller.setFilter(filter);
	}

	private hideItems(ids: number[], type: "remove" | "clear"): Promise<void> {
		return new Promise((resolve) => {
			this.pendingItems.value = { ids, type };

			if (type === "remove") {
				this.controller.hideItems(ids);
			} else if (type === "clear") {
				this.controller.hideAllItems();
			}

			resolve();
		});
	}

	private showNotification(
		sType: "remove" | "clear",
		iTimeout = 5000
	): Promise<boolean> {
		return new Promise((resolve) => {
			if (this.undoNotifications.value) {
				this.undoNotifications.value.show(sType, iTimeout);
			}

			this.notificationTimeout = setTimeout(() => {
				this.notificationTimeout = null;
				resolve(true);
			}, iTimeout);
		});
	}
}
