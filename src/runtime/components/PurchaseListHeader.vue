<template>
	<header class="header purchase-list__header">
		<p class="header__title">
			<Icon
				class="icon button_icon"
				name="material-symbols:list-alt-check-rounded"
			/>Shopping List
		</p>
		<form
			class="header__form"
			@submit.prevent="
				ui.addItem(updatedValue);
				updatedValue = '';
			"
		>
			<input
				v-model="updatedValue"
				type="text"
				class="form__input"
				placeholder="New item"
			/>
			<button type="submit" class="button button_submit">
				<Icon class="icon button_icon" name="material-symbols:add" />
				Add to the list
			</button>
		</form>
	</header>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { PurchaseListUI } from "~/src/runtime/view/PurchaseListUI";

const props = defineProps<{
	inputValue: string;
	ui: PurchaseListUI;
}>();

const updatedValue = ref(props.inputValue);
watch(
	() => props.inputValue,
	(val) => (updatedValue.value = val)
);
</script>

<style lang="scss">
@use "~/assets/scss/default.scss";
</style>
