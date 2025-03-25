import { PurchaseController } from "~/controllers/PurchaseController";
import { computed, ref } from "vue";

export class PurchaseListUI {
	private controller: PurchaseController;
	public readonly filteredItems;
	public undoNotifications: any = null;
	// private pendingItems = ref<{ ids: number[]; type: "remove" | "clear" }>({
	// 	ids: [],
	// 	type: "remove"
	// });
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
        this.toggleItemsVisibility(id)
            .then(() => this.showNotification("remove"))
            .then((confirmed) => {
                if (confirmed) {
					console.log("REMOVE done")
                    this.controller.removeItems(id);
                } else {
                    this.toggleItemsVisibility(id); // Restore visibility
                }
            });
    }

	// removeItem(id: number) {
	// 	// this.pendingItems.value = { ids: [id], type: "remove" };
	// 	this.toggleItemsVisibility([id])
    //         .then(() => this.showNotification("remove"))
    //         .then((confirmed) => {
    //             if (confirmed) {
    //                 this.controller.removeItems([id]);
    //             } else {
    //                 this.toggleItemsVisibility([id]);
    //             }
	// 			// this.pendingItems.value = { ids: [], type: "remove" };
    //     });
	// }

	undoAction() {
			if (this.notificationTimeout) {
				clearTimeout(this.notificationTimeout); // Cancel timeout
				// this.notificationTimeout = null;
				this.toggleItemsVisibility(); // Toggle visibility back for pending items
				// this.pendingItems.value = { ids: [], type: "remove" }; // Reset pending state
	
				if (this.undoNotifications.value) {
					console.log("Undo pressed");
					this.undoNotifications.value.hide(); // Hide notification
				}
			}
        
    }

	clearList() {
        const itemIds = this.controller.getFilteredItems().map((item) => item.id);
        if (itemIds.length === 0) return;

        if (window.confirm("Are you sure you want to clear the list?")) {
            // this.pendingItems.value = { ids: itemIds, type: "clear" };
            this.toggleItemsVisibility(itemIds)
                .then(() => this.showNotification("clear"))
                .then((confirmed) => {
                    if (confirmed) {
                        this.controller.clearList();
                    } else {
                        // Toggle visibility back if not confirmed
                        this.toggleItemsVisibility(itemIds);
                    }
					// this.pendingItems.value = { ids: [], type: "remove" };
                });
        }
    }

	setFilter(filter: "all" | "done" | "undone") {
		this.controller.setFilter(filter);
	}

	toggleItemsVisibility(ids?: number[]): Promise<void> {
        return new Promise((resolve) => {
            const targetIds = ids && ids.length > 0 
                ? ids 
                : this.controller.getFilteredItems().map((item) => item.id);
            this.controller.toggleItemsVisibility(targetIds);
            resolve();
        });
    }

	showNotification(
		sType: "remove" | "clear",
		timeoutMs = 5000
	): Promise<boolean> {
		return new Promise((resolve) => {
			if (this.undoNotifications.value) {
				this.undoNotifications.value.show(sType);
			}
			this.notificationTimeout = setTimeout(() => {
				this.notificationTimeout = null;
				if (this.undoNotifications.value) {
					this.undoNotifications.value.hide();
				}
				// Causing items to reappear
				resolve(true);
			}, timeoutMs);
		});
	}
}
