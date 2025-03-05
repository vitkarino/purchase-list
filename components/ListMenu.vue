<template>
  <div class="list-menu">
    <div class="sort-controls">
      <button class="button button_sort"><Icon
        class="icon button_icon"
        name="material-symbols:sort-rounded"
      />All</button>
      <button class="button button_sort"><Icon
        class="icon button_icon"
        name="material-symbols:sort-rounded"
      />Done</button>
      <button class="button button_sort"><Icon
        class="icon button_icon"
        name="material-symbols:sort-rounded"
      />Undone</button>
    </div>
    <button class="button button_clear"><Icon
        class="icon button_icon"
        name="ic:round-clear"
      />Clear list</button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@use "~/assets/scss/ListMenu.scss";
</style>
