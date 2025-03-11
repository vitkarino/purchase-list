<template>
    <div class="purchase-list">
        <div v-if="items.length === 0" class="empty-list-message">
            No items found.
        </div>
        <ListItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            @remove="emit('remove', item.id)"
            @toggle="emit('toggle', item.id)"
        />
        <ListMenu
            @setFilter="emit('setFilter', $event)"
            @clear="emit('clear')"
        />
    </div>
</template>

<script setup lang="ts">
    import { PurchaseItem } from '~/models/PurchaseModel';

    defineProps<{ items: PurchaseItem[] }>();
    const emit = defineEmits(['toggle', 'remove', 'setFilter', 'clear']);
</script>

<style scoped lang="scss">
    @use "~/assets/scss/PurchaseList.scss" as *;
</style>