 

export class PurchaseListUI {
	private controller: PurchaseController;
	public readonly filteredItems;
	public undoNotifications: any = null;

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
		this.controller.removeItem(id);
		this.showNotification("remove");
	}

	undoAction() {
		this.controller.undoAction();
	}

	clearList() {
		this.controller.clearList();
		this.showNotification("clear");
	}

	setFilter(filter: "all" | "done" | "undone") {
		this.controller.setFilter(filter);
	}

	showNotification(sType: "remove" | "clear", iTimeout=5000) {
		if (this.undoNotifications.value) {
            this.undoNotifications.value.show(sType, iTimeout);
        }
	}
}
