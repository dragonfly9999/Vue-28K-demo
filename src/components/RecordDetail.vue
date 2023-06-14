<script setup lang="ts">
import { OrderStatusNum } from 'src/stores/live';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import WebSocketClient from 'src/utils/WebsocketClient';
const props = defineProps<{ record: OrderRecord }>();
//
const { t } = useI18n();
// DOM
const recordInfo = computed(() => {
  switch (props.record?.MasterType) {
    case MasterTypeNum.Buy:
      return { label: t('label.buy'), color: 'blue-13' };
    case MasterTypeNum.Sell:
      return { label: t('label.sell'), color: 'red' };
    case MasterTypeNum.TransIn:
      return {
        label: t(
          `transaction_history.label.transaction_type.${MasterTypeNum.TransIn}`
        ),
        color: 'purple'
      };
    case MasterTypeNum.TransOut:
      return {
        label: t(
          `transaction_history.label.transaction_type.${MasterTypeNum.TransOut}`
        ),
        color: 'purple'
      };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});
const payerInfo = computed(() => {
  switch (props.record?.MasterType) {
    case MasterTypeNum.Buy: {
      const name = props?.record?.P5;
      const bank = props?.record?.P3;
      const code = props?.record?.P4;
      const account = props?.record?.P1;
      return {
        name,
        bank,
        code,
        account
      };
    }
    case MasterTypeNum.Sell: {
      const [name, bank, code, account] = props.record?.P5?.split('|');
      return {
        name,
        bank,
        code,
        account
      };
    }
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});

// WS
const orderStatus = ref<OrderStatus>();
const statusURL = '/ws_orderstatus.ashx';
const statusWs = new WebSocketClient(statusURL, {
  reconnectEnabled: true,
  reconnectInterval: 2000,
  isChat: false,
  order_token: props.record?.token
});
statusWs.connect();
statusWs.onMessage = (msg) => {
  if (msg?.data && typeof msg?.data === 'string') {
    const orderFromServer: VirgilRes<OrderStatus> = JSON.parse(msg.data);
    orderStatus.value = orderFromServer.data;
  }
};
const statusInfo = computed(() => {
  switch (Number(orderStatus?.value?.MasterType)) {
    case MasterTypeNum.Buy:
      switch (orderStatus.value?.Order_StatusID) {
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
    case MasterTypeNum.Sell:
      switch (orderStatus.value?.Order_StatusID) {
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
      <q-badge rounded-borders :color="recordInfo.color"
        >{{ recordInfo.label }}USDT</q-badge
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
            :class="'text-' + recordInfo.color + ' text-body1 text-weight-bold'"
          >
            {{ thousandTool(record?.UsdtAmt, 3) }}
          </q-item-section>
        </q-item>
        <!-- 金額 -->
        <q-item style="min-height: 36px" v-if="!!record?.D2">
          <q-item-section class="text-dark">
            {{ $t('transaction.amount') }}(CNY)
          </q-item-section>
          <q-item-section avatar class="text-body1">
            {{ thousandTool(record?.D2, 1) }}
          </q-item-section>
        </q-item>
        <q-separator />
        <!-- 結餘 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('label.real_balance') }}(USDT)</q-item-section
          >
          <q-item-section avatar>
            {{ thousandTool(record?.Balance, 3) }}
          </q-item-section>
        </q-item>
        <!-- 狀態 -->
        <q-item style="min-height: 32px" v-if="record?.MasterType < 3">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.status') }}
          </q-item-section>
          <q-item-section avatar>
            {{ statusInfo }}
          </q-item-section>
        </q-item>
        <!-- 匯率 -->
        <q-item style="min-height: 32px" v-if="!!record?.D1">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.rate') }}
          </q-item-section>
          <q-item-section avatar>
            {{ thousandTool(record?.D1, 2) }}
          </q-item-section>
        </q-item>
        <!-- 手續費 -->
        <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.handling_fee') }}
          </q-item-section>
          <q-item-section avatar>
            {{ thousandTool(orderStatus?.D3, 3) }}
          </q-item-section>
        </q-item>
        <!-- 收款方 -->
        <q-item style="min-height: 32px" v-if="!!record?.P2">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.payee') }}
          </q-item-section>
          <q-item-section avatar>
            {{
              record?.MasterType === MasterTypeNum.Sell
                ? record?.P2
                : record?.P5?.split('|')?.[0]
            }}
          </q-item-section>
        </q-item>
        <!-- 付款方名 -->
        <q-item style="min-height: 32px" v-if="!!record?.P2">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.payer') }}
          </q-item-section>
          <q-item-section avatar>
            {{ payerInfo?.name }}
          </q-item-section>
        </q-item>
        <!--銀行名稱 -->
        <q-item style="min-height: 32px" v-if="payerInfo?.bank">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.bank_name') }}
          </q-item-section>
          <q-item-section avatar>
            {{ payerInfo?.bank }}
          </q-item-section>
        </q-item>
        <!--所在省市 -->
        <q-item style="min-height: 32px" v-if="payerInfo?.code">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.city') }}
          </q-item-section>
          <q-item-section avatar>
            {{ payerInfo?.code }}
          </q-item-section>
        </q-item>
        <!--帳號 -->
        <q-item style="min-height: 32px" v-if="payerInfo.account">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.account_number') }}
          </q-item-section>
          <q-item-section avatar>
            {{ payerInfo?.account }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--完成時間 -->
          <q-item-section class="text-grey-6 text-caption"
            >{{ $t('transaction.complete_time') }}
          </q-item-section>
          <q-item-section avatar>
            {{ dayjs(record?.Date).format('YYYY-MM-DD HH:mm:ss') }}
          </q-item-section>
        </q-item>
        <q-item style="min-height: 32px">
          <!--訂單號 -->
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.order_number') }}</q-item-section
          >
          <q-item-section avatar class="text-right">
            {{ record?.Tx_HASH?.substring(0, 21) }} <br />
            <div class="row">
              <CopyButton :value="record?.Tx_HASH" />
              {{ record?.Tx_HASH?.substring(21) }}
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
            :class="'text-' + recordInfo.color + ' cursor-pointer'"
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
      <!--交易對話紀錄btn -->
      <div class="flex justify-center" v-if="record?.MasterType < 3">
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
