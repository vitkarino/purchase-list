<template>
	<div class="app">
		<PurchaseList :items="ui.filteredItems.value" />
	</div>
</template>

<script setup lang="ts">
import { PurchaseStore } from "~/stores/PurchaseStore";

const store = PurchaseStore.getInstance();
const ui = store.getUI();
</script>
