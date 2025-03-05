<template>
  <div>
    <header class="header">
      <p class="header__title">Shopping List</p>
      <form class="header__form">
        <input type="text" class="form__input" placeholder="Add new item" />
        <button type="submit" class="button button_submit">
          <Icon
            class="icon button_icon"
            name="material-symbols:add-shopping-cart-rounded"
          />
        </button>
      </form>
    </header>
  </div>
  <slot />
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
@use "~/assets/scss/default.scss"
</style>
