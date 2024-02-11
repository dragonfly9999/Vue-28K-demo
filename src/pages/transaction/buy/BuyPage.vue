<template>
  <div class="col-12 q-px-md test_dotted" v-if="!orderStatus">
    <div class="column items-center test_dotted">
      <CreatePage />
    </div>
  </div>

  <div class="col-xs-8 col-12 q-px-md" v-else>
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
