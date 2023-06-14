<script setup lang="ts">
import { OrderStatusNum } from 'src/stores/live';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { AccNum } from 'src/pages/account/api';
const props = defineProps<{ order: OrderStatus | undefined }>();
//
const { t } = useI18n();
// DOM
const orderInfo = computed(() => {
  switch (props.order?.MasterType) {
    case MasterTypeNum.Sell:
      return { label: t('label.buy'), color: 'blue-13' };
    case MasterTypeNum.Buy:
      return { label: t('label.sell'), color: 'red' };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});

const statusInfo = computed(() => {
  switch (Number(props.order?.MasterType)) {
    case MasterTypeNum.Sell:
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
          return t('label.undefined');
      }
    case MasterTypeNum.Buy:
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
          return t('label.undefined');
      }
    default:
      return t('label.undefined');
  }
});
</script>
<template>
  <q-card class="q-pa-md" style="width: 380px">
    <!-- title訂單資訊 -->
    <div class="text-h6 text-center text-weight-bold">
      {{ $t('transaction.detail') }}
    </div>
    <div class="flex justify-center">
      <!-- type -->
      <q-badge rounded-borders :color="orderInfo.color"
        >{{ orderInfo.label }}USDT</q-badge
      >
    </div>
    <div class="q-ma-xs">
      <q-list style="padding: 0">
        <!-- 數量 -->
        <q-item style="min-height: 36px">
          <q-item-section class="text-dark">
            {{ $t('transaction.quantity') }}(USDT)
          </q-item-section>
          <q-item-section
            avatar
            :class="'text-' + orderInfo.color + ' text-body1 text-weight-bold'"
          >
            {{ thousandTool(order?.UsdtAmt, 3) }}
          </q-item-section>
        </q-item>
        <!-- 金額 -->
        <q-item style="min-height: 36px">
          <q-item-section class="text-dark">
            {{ $t('transaction.amount') }}(CNY)
          </q-item-section>
          <q-item-section avatar class="text-body1">
            {{ thousandTool(order?.D2, 1) }}
          </q-item-section>
        </q-item>
        <q-separator />
        <!-- 狀態 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.status') }}
          </q-item-section>
          <q-item-section avatar>
            {{ statusInfo }}
          </q-item-section>
        </q-item>
        <!-- 匯率 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.rate') }}
          </q-item-section>
          <q-item-section avatar>
            {{ thousandTool(order?.D1, 1) }}
          </q-item-section>
        </q-item>
        <!-- 手續費 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.handling_fee') }}
          </q-item-section>
          <q-item-section avatar>
            {{ thousandTool(order?.D5, 3) }}
          </q-item-section>
        </q-item>
        <!-- 收款方 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.payee') }}
          </q-item-section>
          <q-item-section avatar>
            {{
              order?.Order_StatusID === MasterTypeNum.Sell
                ? order?.P2?.split('|')?.[0]
                : order?.P5?.split('|')?.[0]
            }}
          </q-item-section>
        </q-item>
        <!-- 付款方名 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.payer') }}
          </q-item-section>
          <q-item-section avatar>
            {{
              order?.Order_StatusID === MasterTypeNum.Sell
                ? order?.P5?.split('|')?.[0]
                : order?.P2?.split('|')?.[0]
            }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--銀行名稱 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.bank_name') }}
          </q-item-section>
          <q-item-section avatar>
            {{ order?.P3 }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--所在省市 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.city') }}
          </q-item-section>
          <q-item-section avatar>
            {{ order?.P4 }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--帳號 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.account_number') }}
          </q-item-section>
          <q-item-section avatar
            >{{
              order?.Order_StatusID === MasterTypeNum.Sell
                ? order[AccNum.Account]
                : order?.P5?.split('|')?.[0]
            }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--完成時間 -->
          <q-item-section class="text-grey-6 text-caption"
            >{{ $t('transaction.complete_time') }}
          </q-item-section>
          <q-item-section avatar>
            {{ dayjs(order?.Date).format('YYYY-MM-DD HH:mm:ss') }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--訂單號 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.order_number') }}</q-item-section
          >
          <q-item-section avatar class="text-right">
            {{ order?.Tx_HASH?.substring(0, 21) }} <br />
            <div class="row">
              <CopyButton :value="order?.Tx_HASH" />
              {{ order?.Tx_HASH?.substring(21) }}
            </div>
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--合約書編號 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.contract_number') }}
          </q-item-section>
          <q-item-section
            avatar
            :class="'text-' + orderInfo.color + ' cursor-pointer'"
          >
            content(fake)
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--備註 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.remark') }}</q-item-section
          >
          <q-item-section avatar> content(fake) </q-item-section>
        </q-item>
      </q-list>
      <!--關閉btn -->
      <q-btn
        class="full-width q-my-md"
        unelevated
        rounded
        color="blue-13"
        :label="t('label.close')"
        v-close-popup
      />
      <div class="flex justify-center">
        <!--交易對話紀錄btn -->
        <q-btn
          flat
          color="blue-13"
          :label="t('transaction.conversation_record')"
          disable
        />
      </div>
    </div>
  </q-card>
</template>

<style scoped></style>
