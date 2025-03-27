<template>
	<div class="wrapper">
		<header class="header app__header">
			<p class="header__title">Shopping List</p>
			<form
				class="header__form"
				@submit.prevent="ui?.addItem(inputValue)"
			>
				<input
					ref="inputValue"
					v-model="model.newItem"
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

const inputValue = ref("");
const purchaseListRef = ref<InstanceType<typeof PurchaseList> | null>(null);

const model = reactive({
	newItem: "",
});

let ui = purchaseListRef;
debugger;

onMounted(() => {
	ui = purchaseListRef.value!.ui;
});
</script>

<style lang="scss">
@use "~/assets/scss/default.scss";
</style>
