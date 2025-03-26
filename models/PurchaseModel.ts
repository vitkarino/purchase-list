export class PurchaseItem {
	id;
	text;
	completed;
	hide;

	constructor(oPurchaseItem: {
		id: number;
		text: string;
		completed?: boolean;
		hide?: boolean;
	}) {
		this.id = oPurchaseItem.id;
		this.text = oPurchaseItem.text;
		this.completed = oPurchaseItem.completed ?? false;
		this.hide = oPurchaseItem.hide ?? false;
	}
}
