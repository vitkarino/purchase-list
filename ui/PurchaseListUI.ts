import { PurchaseController } from "~/controllers/PurchaseController";
import { computed, ref } from "vue";

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

	addItem(text: string) {
		this.controller.addItem(text);
	}

	toggleItem(id: number) {
		this.controller.toggleItem(id);
	}

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

	setFilter(filter: "all" | "done" | "undone") {
		this.controller.setFilter(filter);
	}

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


	showNotification(
		sType: "remove" | "clear",
		timeoutMs = 2000
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
