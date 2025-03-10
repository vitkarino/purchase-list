<template>
  <div class="app">
    <PurchaseList
      :items="ui.filteredItems.value"
      @remove="(id) => ui.removeItem(id)"
      @toggle="(id) => ui.toggleItem(id)"
      @clear="() => ui.clearList()"
      @setFilter="(filter) => ui.setFilter(filter)"
    />
  </div>
</template>

<script setup lang="ts">
import { UI } from "~/ui/UI";
import { PurchaseController } from "~/controllers/PurchaseController";

const controller = new PurchaseController();
const ui = new UI(controller);
</script>
