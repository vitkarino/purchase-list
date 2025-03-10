<template>
  <div class="list-menu">
    <div class="sort-controls">
      <button class="button button_sort" @click="emit('setFilter', 'all')">
        <Icon
          class="icon button_icon"
          name="material-symbols:sort-rounded"
        />All
      </button>
      <button class="button button_sort" @click="emit('setFilter', 'done')">
        <Icon
          class="icon button_icon"
          name="material-symbols:sort-rounded"
        />Done
      </button>
      <button class="button button_sort" @click="emit('setFilter', 'undone')">
        <Icon
          class="icon button_icon"
          name="material-symbols:sort-rounded"
        />Undone
      </button>
    </div>
    <button class="button button_clear" @click="emit('clear')">
      <Icon class="icon button_icon" name="ic:round-clear" />Clear list
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["clear", "setFilter"]);
</script>

<style lang="scss">
@use "~/assets/scss/ListMenu.scss";
</style>
