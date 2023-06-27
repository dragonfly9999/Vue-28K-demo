<script setup lang="ts">
import WaitCard from 'src/pages/transaction/components/WaitCard.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { OrderStatusNum } from 'src/stores/live';
import ChatBox from './components/ChatBox.vue';
import TradeComplete from './components/TradeComplete.vue';
import CancelSuccess from './components/CancelSuccess.vue';
import { useOrderStore, useThirdStore } from 'src/stores';
import { computed } from 'vue';
import TimeOut from './components/TimeOut.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const q = useQuasar();
const route = useRoute();
const { setWebSockets, removeChat } = useThirdStore();
const { setOrderWs, getStatus, removeOrder } = useOrderStore();
const token = computed(() => route.query?.token as string);
const orderStatus = computed(() => getStatus(token.value));
const watchTest = ref();

//
onMounted(() => {
  // 清除多餘
  if (token.value) {
    const tokens = removeOrder();
    tokens?.forEach((token) => token && removeChat(token));
  }
});
watch(
  token,
  (newValue) => {
    if (newValue) {
      setWebSockets(newValue);
      setOrderWs(newValue);
      // 等待連接
      q.loading.show({
        message: t('連線中'),
      });
      setTimeout(() => {
        q.loading.hide();
      }, 600);
    }
  },
  { immediate: true }
);
watch(watchTest, (newValue) => {
  if (newValue) {
  }
});
</script>
<template>
  <div class="flex items-start justify-center" id="background">
    <q-card class="row q-pa-md" id="background2">
      <RouterView />

      <div
        class="col-xs-12 col-lg-4 justify-center flex"
        v-if="
          [
            OrderStatusNum.Assigned,
            OrderStatusNum.Appeal,
            OrderStatusNum.Committed,
          ].includes(orderStatus?.Order_StatusID ?? 0)
        "
      >
        <ChatBox />
      </div>

      <!-- Transaction Status -->
      <div class="col-12 column justify-between">
        <TradeComplete
          :order="orderStatus"
          v-if="orderStatus?.Order_StatusID === OrderStatusNum.Complete"
        />
        <CancelSuccess
          v-else-if="
            [OrderStatusNum.Cancel].includes(orderStatus?.Order_StatusID ?? -5)
          "
          :order="orderStatus"
        />
        <TimeOut
          v-else-if="
            [OrderStatusNum.TimeOut].includes(orderStatus?.Order_StatusID ?? -5)
          "
          :order="orderStatus"
        />
        <WaitCard
          v-else-if="
            [OrderStatusNum.Matching].includes(
              orderStatus?.Order_StatusID ?? -5
            )
          "
          :orderStatus="orderStatus"
        />
      </div>
    </q-card>
  </div>
</template>

<style scoped>
#background {
  min-height: 100%;
}

@media screen and (max-width: 1439px) {
  #background {
    min-height: 110vh;
  }
}

#background2 {
  /* min-width: calc(10vw * 10 - 950px); */
}
@media screen and (max-width: 1439px) {
  #background2 {
    min-width: 100%;
  }
}
</style>
