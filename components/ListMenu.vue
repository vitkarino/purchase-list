<template>
	<div class="list-menu">
		<div class="sort-controls">
			<label class="button button_radio">
				<input
					type="radio"
					name="sort"
					value="all"
					v-model="currentFilter"
				/>
				All
			</label>
			<label class="button button_radio">
				<input
					type="radio"
					name="sort"
					value="done"
					v-model="currentFilter"
				/>
				Done
			</label>
			<label class="button button_radio">
				<input
					type="radio"
					name="sort"
					value="undone"
					v-model="currentFilter"
				/>
				Undone
			</label>
		</div>
		<button class="button button_clear" @click="emit('clear')">
			Clear list
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits(["clear", "setFilter"]);
const currentFilter = ref("all");

watch(currentFilter, (newFilter) => {
	emit("setFilter", newFilter);
});
</script>

<style lang="scss">
@use "~/assets/scss/ListMenu.scss";
</style>
