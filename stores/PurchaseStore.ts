import { PurchaseController } from '~/controllers/PurchaseController';
import { PurchaseListUI } from '~/ui/PurchaseListUI';

export class PurchaseStore {
  private controller: PurchaseController;
  private ui: PurchaseListUI;
  private static instance: PurchaseStore;

  private constructor() {
    this.controller = new PurchaseController();
    this.ui = new PurchaseListUI(this.controller);
  }

  public static getInstance(): PurchaseStore {
    if (!PurchaseStore.instance) {
      PurchaseStore.instance = new PurchaseStore();
    }

    return PurchaseStore.instance;
  }

  getController() {
    return this.controller;
  }

  getUI() {
    return this.ui;
  }
}