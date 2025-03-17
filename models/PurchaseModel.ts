export class PurchaseItem {
	id;
	text;
	completed;

	constructor(oPurchaseItem: {
		id: number;
		text: string;
		completed?: boolean;
	}) {
		this.id = oPurchaseItem.id;
		this.text = oPurchaseItem.text;
		this.completed = oPurchaseItem.completed ?? false;
	}
}
