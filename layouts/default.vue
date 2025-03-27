<template>
	<PurchaseList />
	<!-- <div class="purchase-list">
		<header class="header purchase-list__header">
			<p class="header__title"><Icon class="icon button_icon" name="material-symbols:list-alt-check-rounded" />Shopping List</p>
			<form
				class="header__form"
				@submit.prevent="
					ui.addItem(inputValue);
					inputValue = '';
				"
			>
			<button type="submit" class="button button_submit">
					<Icon
						class="icon button_icon"
						name="material-symbols:add"
					/>
				</button>
				<input
					v-model="inputValue"
					type="text"
					class="form__input"
					placeholder="Add new item"
				/>
				<PurchaseItemsMenu />
			</form>
		</header>
		<PurchaseItems ref="purchaseItemsRef" :ui="ui" />
	</div> -->
</template>

<script setup lang="ts">
import PurchaseList from "~/components/PurchaseList.vue";
// import PurchaseItems from "~/components/PurchaseItems.vue";
// import { PurchaseListUI } from "~/ui/PurchaseListUI";

// const inputValue = ref("");
// const purchaseItemsRef = ref<InstanceType<typeof PurchaseItems> | null>(null);

// const ui = new PurchaseListUI();
</script>

<style lang="scss">
@use "~/assets/scss/default.scss";
</style>
