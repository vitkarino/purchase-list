import { reactive } from "vue";
import PurchaseModel from "~/models/PurchaseModel";
import PurchaseItem from "~/models/PurchaseItem";

export class PurchaseController {
  model: PurchaseModel;
  apiPath: string;

  constructor() {
    this.model = reactive(new PurchaseModel());
    this.apiPath = "/api/purchases";
  }

  // Получаем список с сервера
  fetchInitialList(): Promise<PurchaseItem[]> {
    return fetch(this.apiPath)
      .then((response) => response.json())
      .then((data: PurchaseItem[]) => {
        this.model.items.splice(0, this.model.items.length, ...data);
        return this.model.items;
      });
  }

  // Добавляем товар
  addItem(text: string): Promise<void> {
    return fetch(`${this.apiPath}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then(() => {});
  }

  // Удаляем товар
  removeItem(id: number): Promise<void> {
    return fetch(`${this.apiPath}/${id}`, { method: "DELETE" }).then(() => {});
  }

  // Переключаем статус "сделано/не сделано"
  toggleCompletion(id: number): Promise<void> {
    return fetch(`${this.apiPath}/${id}`, { method: "PATCH" }).then(() => {});
  }

  // Очищаем весь список
  async clearList(): Promise<void> {
    alert("OK");
    return fetch(`${this.apiPath}/clear`, { method: "POST" }).then(() => {});
  }
}
