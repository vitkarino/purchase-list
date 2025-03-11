export class PurchaseItem {
    id;
    text;
    completed;

    constructor(id: number, text: string, completed: boolean = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
}
