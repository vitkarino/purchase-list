<template>
	<transition name="fade">
		<div v-if="show" class="undo-notification">
			<span>{{ message }}</span>
			<button class="button undo_button" @click="$emit('undo')">
				UNDO
			</button>
		</div>
	</transition>
</template>

<script setup lang="ts">
const props = defineProps<{
	show: boolean;
	type: "remove" | "clear";
}>();

defineEmits(["undo"]);

const message = computed(() => {
	return props.type === "clear" ? "List cleared" : "Item removed";
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/UndoNotification.scss" as *;
</style>
