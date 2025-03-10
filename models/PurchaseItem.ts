export default class PurchaseItem {
    static idCounter = 0;
    id;
    text;
    completed;
  
    constructor(text: string) {
      this.id = ++PurchaseItem.idCounter;
      this.text = text;
      this.completed = false;
    }
}