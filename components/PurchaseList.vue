<template>
	<div class="purchase-list">
		<div v-if="items.length === 0" class="empty-list-message">
			No items found.
		</div>
		<ListItem
			v-for="item in props.items"
			:key="item.id"
			:item="item"
			@remove="ui.removeItem(item.id)"
			@toggle="ui.toggleItem(item.id)"
		/>
	</div>
	<ListMenu @setFilter="ui.setFilter($event)" @clear="ui.clearList()" />
	<UndoNotification
		:show="controller.showUndoNotification.value"
		:type="controller.notificationType.value"
		@undo="ui.undoAction()"
	/>
</template>

<script setup lang="ts">
import { PurchaseItem } from "~/models/PurchaseModel";
import { PurchaseStore } from "~/stores/PurchaseStore";

const props = defineProps<{ items: PurchaseItem[] }>();

const store = PurchaseStore.getInstance();
const ui = store.getUI();
const controller = store.getController();
</script>

<style scoped lang="scss">
@use "~/assets/scss/PurchaseList.scss" as *;
</style>
