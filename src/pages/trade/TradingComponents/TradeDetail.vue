<template>
  <q-dialog
    :model-value="visible"
    @update:model-value="
      (isVisible) => {
        $emit('update:visible', isVisible);
        if (isVisible) run({});
      }
    "
  >
    <q-card class="q-pa-md" style="width: 380px">
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>

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
              {{ $t('transaction.數量') }}(USDT)
            </q-item-section>
            <q-item-section
              avatar
              :class="
                'text-' + orderInfo.color + ' text-body1 text-weight-bold'
              "
            >
              {{ usdtFormat }}
            </q-item-section>
          </q-item>
          <!-- 金額 -->
          <q-item style="min-height: 36px">
            <q-item-section class="text-dark">
              {{ $t('transaction.amount') }}(CNY)
            </q-item-section>
            <q-item-section avatar class="text-body1">
              {{ thousandTool(detail?.D2, 'CNY') }}
            </q-item-section>
          </q-item>
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
              {{ thousandTool(detail?.D1, 'CNY') }}
            </q-item-section>
          </q-item>
          <!-- 手續費 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.handling_fee') }}
            </q-item-section>
            <q-item-section avatar>
              {{ thousandTool(detail?.D3, 'CNY') }}
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 付款方名 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{
                `${$t('transaction.payer')}
                ${$t('transaction_history.戶名')}`
              }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.P5?.split('|')?.[0] }}
            </q-item-section>
          </q-item>
          <q-separator />
          <!-- 收款方 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6">
              {{ $t('buy.bankInformation.amount_name') }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.P2?.split('|')?.[0] }}
            </q-item-section>
          </q-item>
          <!--帳號 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('buy.bankInformation.account_number') }}
            </q-item-section>
            <q-item-section avatar
              >{{ detail?.[AccNum.Account] }}
            </q-item-section>
          </q-item>
          <!--銀行名稱 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.beneficiary')
              }}{{ $t('buy.bankInformation.bank_name.CNY') }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.P3 }}
            </q-item-section>
          </q-item>
          <!--所在省市 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.beneficiary')
              }}{{ $t('buy.bankInformation.code.CNY') ?? '--' }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.P4 ? detail?.P4 : '--' }}
            </q-item-section>
          </q-item>
          <q-separator />
          <!--完成時間 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption"
              >{{ $t('transaction.complete_time') }}
            </q-item-section>
            <q-item-section avatar>
              {{
                dayjs(
                  dayjs(detail?.Date).toDate().getTime() +
                    (detail?.DeltaTime ?? 0) * 1000
                ).format('YYYY-MM-DD HH:mm:ss')
              }}
            </q-item-section>
          </q-item>
          <!--訂單號 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              Tx Hash
            </q-item-section>
            <q-item-section avatar class="text-right flex">
              <div class="flex">
                {{
                  detail?.Tx_HASH
                    ? `${detail?.Tx_HASH?.slice(
                        0,
                        3
                      )}...${detail?.Tx_HASH?.slice(-5)}`
                    : '--'
                }}
                <CopyButton :value="detail?.Tx_HASH" />
              </div>
            </q-item-section>
          </q-item>
          <!--合約書編號 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.contract_number') }}
            </q-item-section>
            <q-item-section avatar class="text-blue-13 cursor-pointer">
              content(fake)
            </q-item-section>
          </q-item>
          <!--備註 -->
          <!-- <q-item style="min-height: 32px">
          <q-item-section class="text-grey-6 text-caption">
            {{ $t('transaction.remark') }}</q-item-section
          >
          <q-item-section avatar> content(fake) </q-item-section>
        </q-item> -->
        </q-list>
        <!--關閉btn -->
        <q-btn
          class="full-width q-my-md"
          unelevated
          rounded
          color="blue-13"
          :label="t('main.close')"
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
  </q-dialog>
</template>

<script setup lang="ts">
import { OrderStatusNum } from 'src/stores/live';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { AccNum } from 'src/pages/account/api';
import api from '../api';
import CopyButton from 'src/components/CopyButton.vue';
import { useRoute } from 'vue-router';
import { storageHelper } from 'src/utils/foragePkg';

// Definition
const { t } = useI18n();
const route = useRoute();
const props = defineProps<{ visible: boolean }>();
defineEmits(['update:visible']);
enum ClientNum {
  Buy = MasterTypeNum.Sell,
  Sell = MasterTypeNum.Buy,
}
// DOM
const isAgent = ref(storageHelper<boolean>('isAgent').getItem());

// query
const {
  data: detail,
  loading,
  run,
} = api.useDetail({
  Token: route.query.token,
  ready: computed(() => {
    const result = typeof route.query.token === 'string' && props.visible;
    return result;
  }),
});

// compute
const useNum = computed(() => (isAgent.value ? ClientNum : MasterTypeNum));

const usdtFormat = computed(() => {
  if (!detail.value) return '0';
  if (detail.value.MasterType === useNum.value.Buy) {
    return thousandTool(Math.abs(detail.value.UsdtAmt), 'USDT');
  }
  return '-' + thousandTool(Math.abs(detail.value.UsdtAmt ?? 0), 'USDT');
});
const orderInfo = computed(() => {
  switch (detail.value?.MasterType) {
    case useNum.value.Buy:
      return { label: t('buy.buy'), color: 'blue-13' };
    case useNum.value.Sell:
      return { label: t('sell.sell'), color: 'red' };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});

const statusInfo = computed(() => {
  switch (Number(detail.value?.MasterType)) {
    case useNum.value.Buy:
      switch (detail.value?.Order_StatusID) {
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
    case useNum.value.Sell:
      switch (detail.value?.Order_StatusID) {
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

<style scoped></style>
