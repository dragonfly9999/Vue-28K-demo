<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { OrderStatusNum } from 'src/stores/live';
import AssignedPage from './components/AssignedPage.vue';
import CommittedPage from './components/CommittedPage.vue';
import { useOrderStore } from 'src/stores';
const route = useRoute();
const { getStatus } = useOrderStore();
const orderStatus = computed(() => getStatus(route.query.token as string));
</script>
<template>
  <AssignedPage
    v-if="
      orderStatus?.Order_StatusID === OrderStatusNum.Assigned ||
      orderStatus?.Order_StatusID === OrderStatusNum.Appeal
    "
    :order="orderStatus"
  />
  <CommittedPage
    v-else-if="orderStatus?.Order_StatusID === OrderStatusNum.Committed"
    :order="orderStatus"
  />
</template>

<style scoped></style>
