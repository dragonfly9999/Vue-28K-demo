<template>
 <div id="background">
    <div class="row">
      <div class="col-12 q-px-md test_dotted" v-if="!orderStatus">
        <div class="column items-center test_dotted">
          <RouterView />

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
      <div class="col-12 col-sm-4 no-shadow q-px-md test_dotted">
        <q-card
          class=""
          v-if="
            !!orderStatus &&
            [
              OrderStatusNum.Assigned,
              OrderStatusNum.Appeal,
              OrderStatusNum.Committed,
            ].includes(orderStatus?.Order_StatusID)
          "
        >
      <ChatBox />
      </q-card>
      </div>
    </div>
    <!-- Transaction Status -->
    <div class="col-12 q-pa-md" v-if="!!orderStatus">
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
      <WaitCard
        v-else-if="
          [OrderStatusNum.Matching].includes(orderStatus?.Order_StatusID)
        "
        :orderStatus="orderStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import WaitCard from 'src/pages/transaction/components/WaitCard.vue';
import { onMounted, reactive, watch } from 'vue';
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

const q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const { setWebSockets, removeChat, getWebSocket } = useThirdStore();
const { setOrderWs, getStatus, removeOrder } = useOrderStore();
// DOM
const token = computed(() => route.query?.token as string);
const orderStatus = computed(() => getStatus(token.value));
const chatWS = computed(() => getWebSocket(token.value));
const isWait = reactive({
  orderStatus: false,
  third: false,
});
//
onMounted(() => {
  // 清除多餘
  if (token.value) {
    const tokens = removeOrder(token.value);
    tokens?.forEach((token) => token && removeChat(token));
  }
});
watch(
  token,
  (newValue) => {
    if (newValue) {
      if (!chatWS.value || !orderStatus.value) {
        q.loading.show({
          message: t('dashboard.連線中'),
        });
        if (!chatWS.value) {
          setWebSockets(newValue);
          isWait.third = true;
        }
        if (!orderStatus.value) {
          setOrderWs(newValue);
          isWait.orderStatus = true;
        }
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

<style scoped>
#background {
  margin: auto;
  max-width: 1200px;
  padding-bottom: 20px;
}

@media screen and (max-width: 1439px) {
  /* #background {
    min-height: 130vh;
  } */
}
@media screen and (max-width: 1439px) {
  #background2 {
    width: 100%;
  }
}
</style>
