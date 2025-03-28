<template>
	<div class="purchase-items">
		<div v-if="items.length === 0" class="empty-list-message">
			No tasks found!
		</div>
			<PurchaseItem
			v-for="item in items"
			:key="item.id"
			:item="item"
			@remove="ui.removeItem(item.id)"
			@toggle="ui.toggleItem(item.id)"
		/>
	</div>
	<UndoNotifications ref="undoNotifications" @undo="ui.undoAction()" />
</template>

<script setup lang="ts">
// import { ref, computed, onMounted } from "vue";
import { PurchaseListUI } from "../controllers/PurchaseListUI";

const props = defineProps<{
	ui: PurchaseListUI;
}>();

const { ui } = props;
const items = computed(() => ui.filteredItems.value);
const undoNotifications = ref(null);

onMounted(() => {
	ui.undoNotifications = undoNotifications;
});
</script>

<style scoped lang="scss">
@use "../assets/scss/PurchaseItems.scss" as *;
</style>
