<template>
  <div class="list-item">
    <button class="button button_checkbox">
      <Icon class="icon button_icon" name="material-symbols:done-rounded" />
    </button>
    <span class="list-item__text">Milk</span>
    <button class="button button_remove">
      <Icon
        class="icon button_icon"
        name="material-symbols:delete-outline-rounded"
      />
    </button>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
@use "~/assets/scss/ListItem.scss";
</style>
