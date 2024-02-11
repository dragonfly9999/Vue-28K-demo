<template>
  <q-page
    padding
    :style-fn="() => ({ paddingTop: '0px', paddingInline: '1vw' })"
  >
    <!-- 建立訂單 -->
    <div v-if="routeQuery.action === 'create'">
      <div v-if="routeQuery.type === 'buy'">
        <CreateComponents.BuyCreate />
      </div>
      <div v-else-if="routeQuery.type === 'sell'">
        <CreateComponents.SellCreate />
      </div>
    </div>

    <!-- 交易訂單 -->
    <div v-else-if="routeQuery.action === 'trading'">
      <TradingLayout :route-query="routeQuery" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CreateComponents from './CreateComponents';
import TradingLayout from './TradingComponents/TradingLayout.vue';

import { onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore, useThirdStore } from 'src/stores';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const { setWebSockets, removeChat, getWebSocket } = useThirdStore();
const { setOrderWs, getStatus, removeOrder } = useOrderStore();
// DOM
const routeQuery = computed(() => route.query as RouteQueryOptions);
const orderStatus = computed(() => getStatus(routeQuery.value.token));
const chatWS = computed(() => getWebSocket(routeQuery.value.token));
const isWait = reactive({
  orderStatus: false,
  third: false,
});
//
onMounted(() => {
  // 清除多餘
  if (routeQuery.value.token) {
    const tokens = removeOrder(routeQuery.value.token);
    tokens?.forEach((token) => token && removeChat(token));
  }
});
watch(
  routeQuery,
  (newValue) => {
    if (newValue.token === undefined) return;
    if (!chatWS.value || !orderStatus.value) {
      q.loading.show({
        message: t('連線中'),
      });
      if (!chatWS.value) {
        setWebSockets(newValue.token);
        isWait.third = true;
      }
      if (!orderStatus.value) {
        setOrderWs(newValue.token);
        isWait.orderStatus = true;
      }
    }
  },
  { immediate: true }
);

watch(
  chatWS,
  (newValue) => {
    if (!newValue) return;
    isWait.third = false;
    if (!isWait.orderStatus && !isWait.third) {
      q.loading.hide();
    }
  },
  { immediate: true }
);

watch(
  orderStatus,
  (newValue) => {
    if (!newValue) return;
    isWait.orderStatus = false;
    if (!isWait.orderStatus && !isWait.third) {
      q.loading.hide();
    }
  },
  { immediate: true }
);
</script>

<script lang="ts">
export type RouteQueryOptions = {
  action: 'create' | 'trading';
  type: 'buy' | 'sell';
  token?: string;
};
</script>
<style scoped></style>
