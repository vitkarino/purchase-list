import { computed } from 'vue';
import { PurchaseController } from '~/controllers/PurchaseController';

export class PurchaseListUI {
    private controller: PurchaseController;
    public filteredItems;

    constructor(controller: PurchaseController) {
        this.controller = controller || new PurchaseController();
        this.filteredItems = computed(() => this.controller.getFilteredItems());
    }

    addItem(text: string) {
        console.log('addItem', text);
        this.controller.addItem(text);
    }

    toggleItem(id: number) {
        this.controller.toggleItem(id);
    }

    removeItem(id: number) {
        console.log('removeItem', id);
        this.controller.removeItem(id);
    }

    clearList() {
        this.controller.clearList();
    }

    setFilter(filter: 'all' | 'done' | 'undone') {
        this.controller.setFilter(filter);
    }
}