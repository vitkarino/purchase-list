<template>
	<div class="wrapper">
		<header class="header app__header">
			<p class="header__title">Shopping List</p>
			<form
				class="header__form"
				@submit.prevent="purchaseListRef?.addItem(inputText.trim())"
			>
				<input
					ref="inputRef"
					v-model="inputText"
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
		<PurchaseList ref="purchaseListRef" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PurchaseList from "~/components/PurchaseList.vue";
import { PurchaseListUI } from "~/ui/PurchaseListUI";

const purchaseListRef = ref<InstanceType<typeof PurchaseList> | null>(null);
const inputText = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
	if (inputRef.value) {
		PurchaseListUI(inputRef);
	}
});

// function handleAdd() {
// 	if (inputText.value.trim() !== "" && purchaseListRef.value) {
// 		purchaseListRef.value.addItem(inputText.value.trim());
// 		inputText.value = "";
// 	}
// }
</script>

<style lang="scss">
@use "~/assets/scss/default.scss";
</style>
