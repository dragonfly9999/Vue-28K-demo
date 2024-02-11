<template>
  <div v-if="order === undefined || statusID === undefined">
    <q-card class="width600 q-pa-md">
      <div class="text-center">
        <q-spinner-radio color="orange" size="100" class="q-mb-md" />

        <div class="text-h6 text-weight-bold">
          {{ $t('transaction.交易資訊連線中') }}
        </div>
      </div>
    </q-card>
  </div>
  <div
    v-else-if="
      [
        OrderStatusNum.Assigned,
        OrderStatusNum.Committed,
        OrderStatusNum.Appeal,
      ].includes(statusID)
    "
    class="q-pb-xl q-mb-sm"
  >
    <q-card class="row">
      <div class="q-pa-md col-sm-8 col-12">
        <div v-if="routeQuery.type === 'buy'">
          <div
            v-if="
              [OrderStatusNum.Assigned, OrderStatusNum.Appeal].includes(
                statusID
              )
            "
          >
            <BuyAssigned :order="order" />
          </div>
          <div v-else-if="statusID === OrderStatusNum.Committed">
            <BuyCommitted :order="order" />
          </div>
        </div>

        <div v-else-if="routeQuery.type === 'sell'">
          <div v-if="[OrderStatusNum.Assigned].includes(statusID)">
            <SellAssigned :order="order" />
          </div>
          <div
            v-else-if="
              [OrderStatusNum.Appeal, OrderStatusNum.Committed].includes(
                statusID
              )
            "
          >
            <SellCommitted :order="order" />
          </div>
        </div>
      </div>

      <div class="col-sm-4 col-12">
        <ChatBox :token="routeQuery.token" />
      </div>
    </q-card>
  </div>

  <div v-else>
    <div v-if="statusID === OrderStatusNum.Matching">
      <InPairing :order="order" />
    </div>
    <div v-if="statusID === OrderStatusNum.Complete">
      <TradeComplete :order="order" />
    </div>
    <div v-if="statusID === OrderStatusNum.Cancel">
      <CancelSuccess :order="order" />
    </div>
    <div v-if="statusID === OrderStatusNum.TimeOut">
      <TimeOut :order="order" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { OrderStatusNum } from 'src/stores/live';
import BuyAssigned from './BuyAssigned.vue';
import BuyCommitted from './BuyCommitted.vue';
import InPairing from './InPairing.vue';
import { useOrderStore } from 'src/stores';
import TradeComplete from './TradeComplete.vue';
import CancelSuccess from './CancelSuccess.vue';
import TimeOut from './TimeOut.vue';
import { RouteQueryOptions } from '../TradePage.vue';
import ChatBox from 'src/layouts/components/ChatBox.vue';
import SellAssigned from './SellAssigned.vue';
import SellCommitted from './SellCommitted.vue';

const props = defineProps<{ routeQuery: RouteQueryOptions }>();
// DOM
const order = computed(() => useOrderStore().getStatus(props.routeQuery.token));
const statusID = computed(() => {
  if (order.value === undefined) return undefined;
  return order.value.Order_StatusID;
});
</script>

<style scoped></style>
