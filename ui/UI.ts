import { reactive, ref, computed, onMounted } from "vue";
import { PurchaseController } from "~/controllers/PurchaseController";
import PurchaseItem from "~/models/PurchaseItem";

export class UI {
  private controller: PurchaseController;
  public newItemText = ref(""); 
  public currentFilter = ref("all"); 
  public purchaseItems = reactive<PurchaseItem[]>([]); 

  constructor(controller: PurchaseController) {
    this.controller = controller;
    onMounted(() => this.fetchItems()); 
  }

  private fetchItems() {
    this.controller.fetchInitialList().then((items) => {
      this.purchaseItems.splice(0, this.purchaseItems.length, ...items);
    });
  }

  public addItem() {
    if (!this.newItemText.value.trim()) return;
    this.controller.addItem(this.newItemText.value.trim()).then(() => {
      this.fetchItems(); 
      this.newItemText.value = ""; 
    });
  }

  public removeItem(id: number) {
    this.controller.removeItem(id).then(() => this.fetchItems());
  }

  public toggleItem(id: number) {
    this.controller.toggleCompletion(id).then(() => this.fetchItems());
  }

  public clearList() {
    if (confirm("Are you sure you want to clear the list?")) {
      this.controller.clearList().then(() => this.fetchItems());
    }
  }

  public get filteredItems() {
    return computed(() => {
      if (this.currentFilter.value === "all") return this.purchaseItems;
      if (this.currentFilter.value === "done")
        return this.purchaseItems.filter((item) => item.completed);
      if (this.currentFilter.value === "undone")
        return this.purchaseItems.filter((item) => !item.completed);
      return [];
    });
  }

  public setFilter(filter: string) {
    this.currentFilter.value = filter;
  }
}
