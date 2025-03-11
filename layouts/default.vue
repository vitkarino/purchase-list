<template>
    <header class="header app__header">
        <p class="header__title">Shopping List</p>
        <form class="header__form" @submit.prevent="handleAdd">
            <input
                v-model="inputText"
                type="text"
                class="form__input"
                placeholder="Add new item"
            />
            <button type="submit" class="button button_submit">
                <Icon
                    class="icon button_icon"
                    name="material-symbols:add-shopping-cart-rounded"
                />
            </button>
        </form>
    </header>
    <slot />
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useNuxtApp } from '#app';

    const inputText = ref('');
    const nuxtApp = useNuxtApp();

    function handleAdd() {
        if (inputText.value.trim() !== '') {
            nuxtApp.callHook('app:addItem', inputText.value.trim());
            inputText.value = '';
        }
    }
</script>

<style lang="scss">
    @use "~/assets/scss/default.scss";
</style>
