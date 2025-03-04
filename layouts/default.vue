<template>
  <div>
    <header>
      <p>Shopping List</p>
      <form class="header__form">
        <input type="text" class="form__input" placeholder="Add a task" />
        <button type="submit" class="button button_submit">
          <Icon
            class="icon button_icon"
            name="material-symbols:delete-outline-rounded"
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

<style src="@/assets/css/appHeader.scss" lang="scss"></style>
