import { PurchaseController } from "./PurchaseController";
import { computed } from "vue";

export class PurchaseListUI {
	private controller: PurchaseController;
	public readonly filteredItems;
	public undoNotifications: any = null;
	private hiddenItems: number[] = [];
	private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		this.controller = new PurchaseController();
		this.filteredItems = computed(() => this.controller.getFilteredItems());
	}

	// Add a new item to the list
	addItem(text: string) {
		if (!text) return;
		this.controller.addItem(text);
	}

	// Toggle the completed status of an item
	toggleItem(id: number) {
		this.controller.toggleItem(id);
	}

	// Remove an item from the list and show an undo notification
	removeItem(id: number) {
		this.hiddenItems.push(id);
		this.controller.hideItem(this.hiddenItems);

		this.showNotification("remove").then((confirmed) => {
			if (confirmed) {
				this.controller.removeItem(this.hiddenItems);
			} else {
				this.controller.showItem(this.hiddenItems);
			}
		});
	}

	// Undo the last action and hide an undo notification
	undoAction() {
		if (this.notificationTimeout) {
			clearTimeout(this.notificationTimeout);
			this.notificationTimeout = null;

			if (this.undoNotifications.value) {
				this.undoNotifications.value.hide();
				this.showItem(this.hiddenItems);
				this.hiddenItems = [];
			}
		}
	}

	// Clear the list and show an undo notification
	clearList() {
		const itemIds = this.controller
			.getFilteredItems()
			.map((item) => item.id);

		if (itemIds.length === 0) return;
		this.hiddenItems = itemIds;

		if (window.confirm("Are you sure you want to clear the list?")) {
			this.hideItem(this.hiddenItems)
				.then(() => this.showNotification("clear"))
				.then((confirmed) => {
					if (confirmed) {
						this.controller.clearList();
					}
				});
		}
	}

	// Set filter to show all, done, or undone items
	setFilter(filter: "all" | "done" | "undone") {
		this.controller.setFilter(filter);
	}

	// Hide items by id, it is used to hide items before removing them in case user wants to undo deletions
	hideItem(ids?: number[]): Promise<void> {
		return new Promise((resolve) => {
			const targetIds =
				ids && ids.length > 0
					? ids
					: this.controller.getFilteredItems().map((item) => item.id);
			this.controller.hideItem(targetIds);
			resolve();
		});
	}

	// Show items by id, it is used to show items after undoing deletions
	showItem(ids?: number[]): Promise<void> {
		return new Promise((resolve) => {
			const targetIds =
				ids && ids.length > 0
					? ids
					: this.controller.getFilteredItems().map((item) => item.id);
			this.controller.showItem(targetIds);
			resolve();
		});
	}

	// Show a notification to undo the last action (remove or clear)
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
				resolve(true);
			}, timeoutMs);
		});
	}
}
