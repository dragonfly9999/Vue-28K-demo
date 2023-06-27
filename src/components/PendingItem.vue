<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MasterTypeNum } from 'src/utils/NumberTool';
import { useI18n } from 'vue-i18n';
import { OrderStatusNum } from 'src/stores/live';
import { thousandTool } from 'src/utils/NumberTool';
import dayjs from 'dayjs';
import { useThirdStore } from 'src/stores';

defineProps<{ order: PendingOrder }>();
const router = useRouter();
const { t } = useI18n();
const { getCount } = useThirdStore();
// DOM
const orderInfo = (order: PendingOrder) => {
  switch (order.MasterType) {
    case MasterTypeNum.Buy:
      return { label: t('label.buy'), color: 'blue-13' };
    case MasterTypeNum.Sell:
      return { label: t('label.sell'), color: 'red' };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
};
const OrderStatus = (order: PendingOrder) => {
  switch (Number(order?.MasterType)) {
    case MasterTypeNum.Buy:
      switch (order?.Order_StatusID) {
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
    case MasterTypeNum.Sell:
      switch (order?.Order_StatusID) {
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
};
</script>
<template>
  <q-item
    v-ripple
    @click="
      () =>
        router.push({
          name: order?.MasterType === MasterTypeNum.Buy ? 'buy' : 'sell',
          query: { token: order.token },
        })
    "
    clickable
  >
    <q-item-section class="q-pa-xs">
      <!-- title -->
      <div class="flex no-wrap q-gutter-x-sm items-center">
        <div>
          <!-- type ##### class 注意空格 -->
          <div
            :class="
              'text-h6 text-' + orderInfo(order).color + ' text-weight-bold'
            "
          >
            {{ orderInfo(order).label }}
          </div>
          <!-- currency -->
          <q-badge :color="orderInfo(order).color">USDT/CNY</q-badge>
        </div>
        <q-space />

        <!-- 數量 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.quantity') }}<span>(USDT)</span>
          </div>
          <div
            :class="
              'text-body1 text-weight-bold text-' + orderInfo(order).color
            "
          >
            {{ thousandTool(order.UsdtAmt, 'USDT') }}
          </div>
        </div>
        <!-- 金額 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.amount') }}<span>(CNY)</span>
          </div>
          <div class="text-body1">{{ thousandTool(order.D2, 'CNY') }}</div>
        </div>
      </div>
      <div class="flex no-wrap q-py-sm items-end">
        <div class="q-gutter-xs">
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
              {{ dayjs(order.Date).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <q-space />
        <!-- 狀態  Order_StatusID: 32=> 等待配對中, 33 => 等待付款, 34 => 等待確認中, 35 => 申訴,-->
        <div class="q-gutter-sm">
          <div class="q-gutter-sm column items-end justify-end">
            <q-badge :label="$t('訊息') + ': ' + getCount(order?.token)" />
            <q-badge
              transparent
              rounded
              class="flex items-end items-center q-px-xs"
              color="orange-1"
            >
              <q-spinner-hourglass color="orange-9" size="1.5em" />
              <div class="text-caption text-weight-bold text-orange-9">
                {{ OrderStatus(order) }}
              </div>
            </q-badge>
          </div>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<style scoped></style>
