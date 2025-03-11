import { computed } from 'vue';
import { PurchaseController } from '~/controllers/PurchaseController';

export class UI {
    private controller: PurchaseController;
    public filteredItems = computed(() => this.controller.getFilteredItems());

    constructor(controller: PurchaseController) {
        this.controller = controller;
    }

    addItem(text: string) {
        this.controller.addItem(text);
    }

    toggleItem(id: number) {
        this.controller.toggleItem(id);
    }

    removeItem(id: number) {
        this.controller.removeItem(id);
    }

    clearList() {
        this.controller.clearList();
    }

    setFilter(filter: 'all' | 'done' | 'undone') {
        this.controller.setFilter(filter);
    }
}
