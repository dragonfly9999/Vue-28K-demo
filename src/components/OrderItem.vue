<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
import dayjs from 'dayjs';
import { MtTypeNum, OrderStatusNum } from 'src/stores/live';
import { useBuyMatch, useSellMatch } from './api';
import { useOrderStore, useThirdStore } from 'src/stores';
const props = defineProps<{ order: LiveOrder; isInstant: boolean }>();

//
const { t } = useI18n();
const router = useRouter();
const storage = useStorage();
const { setOrderWs } = useOrderStore();
const { setWebSockets } = useThirdStore();
const { run: matchBuy } = useBuyMatch({
  onTriger: () => {
    setWebSockets(props.order.token);
    setOrderWs(props.order.token);
  }
});
const { run: matchSell } = useSellMatch({
  onSuccess: () => {
    setWebSockets(props.order.token);
    setOrderWs(props.order.token);
  }
});
// DOM
const orderInfo = computed(() => {
  switch (props.order.MType) {
    case MtTypeNum.Buy:
      return { label: t('label.buy'), color: 'blue-13' };
    case MtTypeNum.Sell:
      return { label: t('label.sell'), color: 'red' };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});

// handler
const handleMatch = () => {
  if (props.order.MType === MtTypeNum.Sell) {
    matchBuy({
      Token: props.order.token
    });
  } else {
    matchSell({
      Token: props.order.token
    });
  }
};

const OrderStatus = computed(() => {
  switch (Number(props.order.MType)) {
    case MtTypeNum.Buy:
      switch (props.order?.Order_StatusID) {
        case OrderStatusNum.Matching:
          return t('transaction.pairing');
        case OrderStatusNum.Assigned:
          return t('transaction.payment_required');
        case OrderStatusNum.Committed:
          return t('transaction.inProgress');
        case OrderStatusNum.Appeal:
          return t('transaction.appeal');
        case OrderStatusNum.Complete:
          return t('transaction.complete');
        default:
          return t('transaction.pairing');
      }
    case MtTypeNum.Sell:
      switch (props.order?.Order_StatusID) {
        case OrderStatusNum.Matching:
          return t('transaction.pairing');
        case OrderStatusNum.Assigned:
          return t('transaction.opponent_preparing');
        case OrderStatusNum.Committed:
          return t('transaction.need_confirm_payment');
        case OrderStatusNum.Appeal:
          return t('transaction.appeal');
        case OrderStatusNum.Complete:
          return t('transaction.complete');
        default:
          return t('transaction.pairing');
      }
    default:
      return t('label.undefined');
  }
});
</script>
<template>
  <q-item
    :clickable="!isInstant"
    v-ripple
    @click="
      () => {
        router.push({
          name: order?.MType === MtTypeNum.Buy ? 'buy' : 'sell',
          query: { token: order.token }
        });
      }
    "
  >
    <q-item-section class="q-pa-xs">
      <!-- title -->
      <div class="flex no-wrap q-gutter-x-sm items-center">
        <div>
          <!-- type ##### class 注意空格 -->
          <div :class="'text-h6 text-' + orderInfo.color + ' text-weight-bold'">
            {{ orderInfo.label }}
          </div>
          <!-- currency -->
          <q-badge :color="orderInfo.color">USDT/CNY</q-badge>
        </div>
        <q-space />

        <!-- 數量 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.quantity') }}<span>(USDT)</span>
          </div>
          <div :class="'text-body1 text-weight-bold text-' + orderInfo.color">
            {{ thousandTool(order.UsdtAmt, 3) }}
          </div>
        </div>
        <!-- 金額 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.amount') }}<span>(CNY)</span>
          </div>
          <div class="text-body1">{{ thousandTool(order.D2, 3) }}</div>
        </div>
      </div>
      <div class="flex no-wrap q-py-sm items-end">
        <div class="q-gutter-xs">
          <!-- 代理顯示 交易方姓名 -->
          <div class="flex" v-if="storage.getStorageSync('isAgent')">
            <div class="text-caption text-grey-6">交易方姓名：</div>
            <div class="text-caption">{{ order?.P5?.split('|')?.[0] }}</div>
          </div>
          <div class="flex">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.rate') }}
            </div>
            <!-- rate -->
            <div class="text-caption">{{ order.D1 }}</div>
          </div>
          <div class="flex">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.time') }}
            </div>
            <!-- 日期 -->
            <div class="text-caption">
              {{ dayjs(order.CreateDate).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <q-space />
        <!-- 狀態  Order_StatusID: 32=> 等待配對中, 33 => 等待付款, 34 => 等待確認中, 35 => 申訴,-->
        <div class="q-gutter-sm">
          <div class="flex justify-end">
            <q-badge
              transparent
              rounded
              class="flex items-end items-center q-px-xs"
              color="orange-1"
            >
              <q-spinner-hourglass color="orange-9" size="1.5em" />
              <div class="text-caption text-weight-bold text-orange-9">
                {{ OrderStatus }}
              </div>
            </q-badge>
          </div>
          <div v-if="isInstant">
            <q-btn
              @click="handleMatch"
              rounded
              unelevated
              icon="shopping_bag"
              color="blue-13"
              >開始交易</q-btn
            >
          </div>
        </div>
      </div>
    </q-item-section>
    <!-- 詳細內容 -->
  </q-item>
</template>

<style scoped></style>
