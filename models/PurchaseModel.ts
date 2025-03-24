export class PurchaseItem {
	id;
	text;
	completed;
	isVisible;

	constructor(oPurchaseItem: {
		id: number;
		text: string;
		completed?: boolean;
		isVisible?: boolean;
	}) {
		this.id = oPurchaseItem.id;
		this.text = oPurchaseItem.text;
		this.completed = oPurchaseItem.completed ?? false;
		this.isVisible = oPurchaseItem.isVisible ?? true;
	}
}
