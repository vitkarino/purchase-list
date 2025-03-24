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
const show = ref(false);
const notificationType = ref<"remove" | "clear">("remove");

const message = computed(() => {
	return notificationType.value === "clear" ? "List cleared" : "Item removed";
});

defineEmits(["undo"]);

defineExpose({
	show(type: "remove" | "clear", timeoutMs: number = 5000) {
		notificationType.value = type;
		show.value = true;

		setTimeout(() => {
			show.value = false;
		}, timeoutMs);
	},
	hide() {
		show.value = false
	},
	unhide() {
		show.value = true;
	}
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/UndoNotification.scss" as *;
</style>
