<script setup lang="ts">
import { useRoute } from 'vue-router';
import { OrderStatusNum } from 'src/stores/live';
import AssignedPage from './components/AssignedPage.vue';
import CommittedPage from './components/CommittedPage.vue';
import { useOrderStore } from 'src/stores';
import { computed } from 'vue';
import CreatePage from './components/CreatePage.vue';
const route = useRoute();
const { getStatus } = useOrderStore();
const orderStatus = computed(() => getStatus(route.query.token as string));
</script>
<template>
  <CreatePage v-if="!orderStatus" />

  <AssignedPage
    v-if="[OrderStatusNum.Assigned].includes(orderStatus?.Order_StatusID ?? -5)"
    :order="orderStatus"
  />
  <CommittedPage
    v-else-if="
      [OrderStatusNum.Committed, OrderStatusNum.Appeal].includes(
        orderStatus?.Order_StatusID ?? -5
      )
    "
    :order="orderStatus"
  />
</template>

<style scoped></style>
