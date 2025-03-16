<template>
    <div class="wrapper">
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
                    name="material-symbols:add"
                />
            </button>
        </form>
    </header>
    <slot />
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PurchaseStore } from '~/stores/PurchaseStore';

const inputText = ref('');
const store = PurchaseStore.getInstance();
const ui = store.getUI();

function handleAdd() {
    if (inputText.value.trim() !== '') {
        ui.addItem(inputText.value.trim());
        inputText.value = '';
    }
}
</script>

<!-- <script setup lang="ts">
    import { ref } from 'vue';
    import { useNuxtApp } from '#app';

    const inputText = ref('');
    const nuxtApp = useNuxtApp();

    function handleAdd() {
        if (inputText.value.trim() !== '') {
            nuxtApp.callHook('app:addItem' as any, inputText.value.trim());
            inputText.value = '';
        }
    }
</script> -->

<style lang="scss">
    @use "~/assets/scss/default.scss";
</style>
