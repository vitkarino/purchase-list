<template>
  <div>
    <header class="header app__header">
      <p class="header__title">Shopping List</p>
      <form class="header__form" @submit.prevent="emit('add')">
        <input
          type="text"
          class="form__input"
          placeholder="Add new item"
          :value="modelValue"
          @input="
            emit('update:modelValue', ($event.target as HTMLInputElement).value)
          "
        />
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

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue", "add"]);
</script>

<style scoped lang="scss">
@use "~/assets/scss/default.scss";
</style>
