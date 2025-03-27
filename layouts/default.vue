<template>
	<div class="purchase-list">
		<header class="header purchase-list__header">
			<p class="header__title">Shopping List</p>
			<form
				class="header__form"
				@submit.prevent="
					ui.addItem(inputValue);
					inputValue = '';
				"
			>
				<input
					v-model="inputValue"
					type="text"
					class="form__input"
					placeholder="Add new item"
				/>
				<button type="submit" class="button button_submit">
					<Icon
						class="icon button_icon"
						name="material-symbols:add"
					/>
				</button>
			</form>
		</header>
		<!-- PurchaseList renames to PurchaseItems -->
		<PurchaseItems ref="purchaseItemsRef" :ui="ui" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PurchaseItems from "~/components/PurchaseItems.vue";
import { PurchaseListUI } from "~/ui/PurchaseListUI";

const inputValue = ref("");
const purchaseItemsRef = ref<InstanceType<typeof PurchaseItems> | null>(null);

const ui = new PurchaseListUI();

// const model = reactive({
// 	newItem: "",
// });

// let ui = purchaseListRef;
// debugger;

// const ui = new PurchaseListUI();

// onMounted(() => {
// 	ui = purchaseListRef.value!.ui;
// });
</script>

<style lang="scss">
@use "~/assets/scss/default.scss";
</style>
