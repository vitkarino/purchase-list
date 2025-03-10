<template>
  <div class="list-item" :class="{ item_completed: item.completed }">
    <button class="button button_checkbox" @click="emit('toggle', item.id)">
      <Icon class="icon button_icon" name="material-symbols:done-rounded" />
    </button>
    <span class="list-item__text">{{ item.text }}</span>
    <button class="button button_remove" @click="emit('remove', item.id)">
      <Icon class="icon button_icon" name="material-symbols:delete-outline-rounded" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PurchaseItem } from '~/models/PurchaseModel';

defineProps<{ item: PurchaseItem }>();
const emit = defineEmits(["toggle", "remove"]);
</script>

<style scoped lang="scss">
@use "~/assets/scss/ListItem.scss";
</style>
