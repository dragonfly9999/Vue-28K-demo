<template>
  <div class="col-12 column items-center" v-if="!orderStatus">
    <CreatePage />
  </div>
  <div class="col-xs-12 col-lg-8 column items-center" v-else>
    <AssignedPage
      v-if="
        [OrderStatusNum.Appeal, OrderStatusNum.Assigned].includes(
          orderStatus.Order_StatusID
        )
      "
      :order="orderStatus"
    />
    <CommittedPage
      v-else-if="orderStatus.Order_StatusID === OrderStatusNum.Committed"
      :order="orderStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { OrderStatusNum } from 'src/stores/live';
import AssignedPage from './components/AssignedPage.vue';
import CommittedPage from './components/CommittedPage.vue';
import { useOrderStore } from 'src/stores';
import CreatePage from './components/CreatePage.vue';
const route = useRoute();
// DOM
const orderStatus = computed(() =>
  useOrderStore().getStatus(route.query?.token as string)
);
</script>

<style scoped></style>
