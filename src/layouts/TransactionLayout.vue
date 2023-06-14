<script setup lang="ts">
import { ComputedRef, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { OrderStatusNum } from 'src/stores/live';
import ChatBox from './components/ChatBox.vue';
import TradeComplete from './components/TradeComplete.vue';
import CancelSuccess from './components/CancelSuccess.vue';
import { useOrderStore, useThirdStore } from 'src/stores';
import { computed } from 'vue';
import TimeOut from './components/TimeOut.vue';
const route = useRoute();
const token = computed(() => route.query?.token) as ComputedRef<string>;
const router = useRouter();
const { setWebSockets, removeChat } = useThirdStore();
const { setOrderWs, getStatus, removeOrder } = useOrderStore();
const orderStatus = computed(() => getStatus(token.value));
//
onMounted(() => {
  if (!token.value) {
    router.push({ name: 'dashboard' });
  }
  if (typeof token.value === 'string') {
    setWebSockets(token.value);
    setOrderWs(token.value);
    const tokens = removeOrder();
    tokens?.forEach((token) => token && removeChat(token));
  }
});
watch(
  () => token.value,
  (newValue) => {
    if (newValue) {
      setWebSockets(token.value);
      setOrderWs(token.value);
    }
  }
);
</script>
<template>
  <div class="flex items-start justify-center" style="min-height: 60vh">
    <q-card class="row q-pa-md" v-if="!!orderStatus">
      <div class="col-xs-12 col-lg-8 column items-center">
        <RouterView />
      </div>

      <div class="col-xs-12 col-lg-4 justify-center flex">
        <ChatBox
          v-if="
            [
              OrderStatusNum.Assigned,
              OrderStatusNum.Appeal,
              OrderStatusNum.Committed
            ].includes(orderStatus?.Order_StatusID ?? 0)
          "
        />
      </div>

      <!-- Transaction Status -->
      <div class="col-12 column justify-between">
        <TradeComplete
          :order="orderStatus"
          v-if="orderStatus?.Order_StatusID === OrderStatusNum.Complete"
        />
        <CancelSuccess
          v-else-if="
            [OrderStatusNum.Cancel].includes(orderStatus?.Order_StatusID)
          "
          :order="orderStatus"
        />
        <TimeOut
          v-else-if="
            [OrderStatusNum.TimeOut].includes(orderStatus?.Order_StatusID)
          "
          :order="orderStatus"
        />
      </div>
    </q-card>
  </div>
</template>

<style scoped></style>
