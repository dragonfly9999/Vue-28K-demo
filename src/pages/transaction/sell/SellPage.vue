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
  <div class="col-12 column items-center" v-if="!orderStatus">
    <CreatePage />
  </div>

  <div class="col-xs-12 col-lg-8 column items-center">
    <AssignedPage
      v-if="
        [OrderStatusNum.Assigned].includes(orderStatus?.Order_StatusID ?? -5)
      "
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
  </div>
</template>

<style scoped></style>
