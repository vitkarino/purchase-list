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
		this.pendingItems.value = { ids: [id], type: "remove" };
		this.toggleItemsVisibility([id])
            .then(() => this.showNotification("remove"))
            .then((confirmed) => {
                if (confirmed) {
                    this.controller.customDeleteItem(id);
                } else {
                    // Toggle visibility back if not confirmed
                    this.toggleItemsVisibility([id]);
                }
        });
		// this.hideItems([id])
		// 	.then(() => this.showNotification("remove"))
		// 	.then((confirmed) => {
		// 		if (confirmed) {
		// 			this.controller.customDeleteItem(id);
		// 		} else {
		// 			this.controller
		// 		}
		// 		// if (!confirmed) {
		// 		// 	this.controller.fetchItems();
		// 		// } else {
					
		// 		// }
		// 	});
	}

	undoAction() {
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = null;

            // Toggle visibility back for pending items
            this.toggleItemsVisibility(this.pendingItems.value.ids);
            this.pendingItems.value = { ids: [], type: "remove" };

            if (this.undoNotifications.value) {
                this.undoNotifications.value.hide();
            }
        }
    }

	// undoAction() {
	// 	if (this.notificationTimeout) {
	// 		clearTimeout(this.notificationTimeout);
	// 		this.notificationTimeout = null;

	// 		// Unecessary fetch method
	// 		// this.controller.fetchItems();
	// 		// this.controller.unhideItems(this.pendingItems.value.ids);
	// 		// this.pendingItems.value = { ids: [], type: "remove" };

	// 		if (this.undoNotifications.value) {
	// 			this.undoNotifications.value.hide();
	// 		}
	// 	}
	// }

	// clearList() {
	// 	// const itemIds = this.controller
	// 	// 	.getFilteredItems()
	// 	// 	.map((item) => item.id);

	// 	if (itemIds.length === 0) return;

	// 	if (window.confirm("Are you sure you want to clear the list?")) {
	// 		this.hideItems()
	// 			.then(() => this.showNotification("clear"))
	// 			.then((confirmed) => {
	// 				// Unecessary fetch method removed
	// 				// if (confirmed) {
	// 				// 	this.controller.fetchItems();
	// 				// } else {
	// 				// 	this.controller.customClearList();
	// 				// }

	// 				this.controller.customClearList();
	// 			});
	// 	}
	// }

	// clearList() {
	// 	const itemIds = this.controller.getFilteredItems().map((item) => item.id);
	// 	if (itemIds.length === 0) return;

	// 	if (window.confirm("Are you sure you want to clear the list?")) {
	// 		// this.pendingItems.value = { ids: itemIds, type: "clear" };
	// 		this.hideItems()
	// 			.then(() => this.showNotification("clear"))
	// 			.then((confirmed) => {
	// 				if (confirmed) {
	// 					this.controller.customClearList();
	// 				}
	// 			});
	// 	}
	// }

	clearList() {
        const itemIds = this.controller.getFilteredItems().map((item) => item.id);
        if (itemIds.length === 0) return;

        if (window.confirm("Are you sure you want to clear the list?")) {
            this.pendingItems.value = { ids: itemIds, type: "clear" };
            this.toggleItemsVisibility()
                .then(() => this.showNotification("clear"))
                .then((confirmed) => {
                    if (confirmed) {
                        this.controller.customClearList();
                    } else {
                        // Toggle visibility back if not confirmed
                        this.toggleItemsVisibility();
                    }
                });
        }
    }

	setFilter(filter: "all" | "done" | "undone") {
		this.controller.setFilter(filter);
	}

	toggleItemsVisibility(ids?: number[]): Promise<void> {
		return new Promise((resolve) => {
			if (ids && ids.length > 0) {
				this.controller.toggleItemsVisibility(ids);
			} else {
				const allItemIds = this.controller.getFilteredItems().map((item) => item.id);
				this.controller.toggleItemsVisibility(allItemIds);
			}
			resolve();
		});
	}

	// private hideItems(ids?: number[]): Promise<void> {
	// 	return new Promise((resolve) => {
	// 		if (ids && ids.length > 0) {
	// 			this.controller.hideItems(ids);
	// 		} else {
	// 			const allItemIds = this.controller.getFilteredItems().map((item) => item.id);
	// 			this.controller.hideItems(allItemIds);
	// 		}
	// 		resolve();
	// 	});
	// }

	showNotification(
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
