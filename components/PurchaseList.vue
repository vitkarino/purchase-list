<template>
	<div class="purchase-list">
		<div v-if="items.length === 0" class="empty-list-message">
			No items found.
		</div>
		<ListItem
			v-for="item in items"
			:key="item.id"
			:item="item"
			@remove="ui.removeItem(item.id)"
			@toggle="ui.toggleItem(item.id)"
		/>
	</div>
	<ListMenu @setFilter="ui.setFilter($event)" @clear="ui.clearList()" />
	<UndoNotifications ref="undoNotifications" @undo="ui.undoAction()"/>
</template>

<script setup lang="ts">
import { PurchaseListUI } from "~/ui/PurchaseListUI"; 

// const props = defineProps<{ items: PurchaseItem[] }>();
const ui = new PurchaseListUI();
const items = computed(() => ui.filteredItems.value);
const undoNotifications = ref(null);

onMounted(() => {
  ui.undoNotifications = undoNotifications;
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/PurchaseList.scss" as *;
</style>
