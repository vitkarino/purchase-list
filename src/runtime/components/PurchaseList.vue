<template>
	<div class="purchase-list">
		<PurchaseListHeader :inputValue="inputValue" :ui="ui" />
		<PurchaseItems ref="purchaseItemsRef" :ui="ui" />
		<PurchaseItemsMenu
			@setFilter="ui.setFilter($event)"
			@clear="ui.clearList()"
		/>
	</div>
</template>

<script setup lang="ts">
import PurchaseItems from "~/components/PurchaseItems.vue";
import PurchaseListHeader from "./PurchaseListHeader.vue";
import { PurchaseListUI } from "~/src/runtime/controllers/PurchaseListUI";

const inputValue = ref("");
const purchaseItemsRef = ref<InstanceType<typeof PurchaseItems> | null>(null);
const ui = new PurchaseListUI();
</script>

<style lang="scss">
@use "~/assets/scss/default.scss";
</style>
