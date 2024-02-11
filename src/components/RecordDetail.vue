<template>
  <q-dialog
    :model-value="visible"
    @update:model-value="(isVisible) => $emit('update:visible', isVisible)"
  >
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
              {{ $t('transaction.數量') }}(USDT)
            </q-item-section>
            <q-item-section
              avatar
              :class="
                'text-' + recordInfo.color + ' text-body1 text-weight-bold'
              "
            >
              {{ thousandTool(record?.UsdtAmt, 'USDT') }}
            </q-item-section>
          </q-item>
          <!-- 金額 -->
          <q-item style="min-height: 36px" v-if="!!record?.D2">
            <q-item-section class="text-dark">
              {{ $t('transaction.amount') }}(CNY)
            </q-item-section>
            <q-item-section avatar class="text-body1">
              {{ thousandTool(record?.D2, 'CNY') }}
            </q-item-section>
          </q-item>
          <!-- 結餘 -->
          <q-item style="min-height: 32px" v-if="'Balance' in record">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('label.real_balance') }}(USDT)</q-item-section
            >
            <q-item-section avatar>
              {{ thousandTool(record?.Balance, 'USDT') }}
            </q-item-section>
          </q-item>
          <!-- 狀態 -->
          <q-item style="min-height: 32px" v-if="record?.MasterType < 3">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.status') }}
            </q-item-section>
            <q-item-section avatar>
              <div v-if="!!detail">
                {{ statusInfo }}
              </div>
              <q-spinner v-else />
            </q-item-section>
          </q-item>
          <!-- 匯率 -->
          <q-item style="min-height: 32px" v-if="!!record?.D1">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.rate') }}
            </q-item-section>
            <q-item-section avatar>
              {{ thousandTool(record?.D1, 'CNY') }}
            </q-item-section>
          </q-item>
          <!-- 手續費 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.handling_fee') }}
            </q-item-section>
            <q-item-section avatar>
              <div v-if="!!detail">
                {{ thousandTool(detail?.D3, 'USDT') }}
              </div>
              <q-spinner v-else />
            </q-item-section>
          </q-item>
          <q-separator v-if="'P2' in record && !!record?.P2" />
          <!-- 付款方名 -->
          <q-item
            style="min-height: 32px"
            v-if="'P2' in record && !!record?.P2"
          >
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.payer')
              }}{{
                $t('transaction_history.label.history_detail.account_name')
              }}
            </q-item-section>
            <q-item-section avatar>
              {{ payerInfo?.name }}
            </q-item-section>
          </q-item>
          <q-separator v-if="'P2' in record && !!record?.P2" />
          <!-- 收款方 -->
          <q-item
            style="min-height: 32px"
            v-if="'P2' in record && !!record?.P2"
          >
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('buy.bankInformation.amount_name') }}
            </q-item-section>
            <q-item-section avatar>
              {{ record?.P2 }}
            </q-item-section>
          </q-item>
          <!--帳號 -->
          <q-item
            style="min-height: 32px"
            v-if="'P2' in record && !!record?.P2"
          >
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('buy.bankInformation.account_number') }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.[AccNum.Account] }}
            </q-item-section>
          </q-item>
          <!--銀行名稱 -->
          <q-item
            style="min-height: 32px"
            v-if="'P2' in record && !!record?.P2"
          >
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.beneficiary')
              }}{{ $t('buy.bankInformation.bank_name.CNY') }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.P3 }}
            </q-item-section>
          </q-item>
          <!--所在省市 -->
          <q-item
            style="min-height: 32px"
            v-if="'P2' in record && !!record?.P2"
          >
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.beneficiary')
              }}{{ $t('buy.bankInformation.code.CNY') ?? '--' }}
            </q-item-section>
            <q-item-section avatar>
              {{ detail?.P4 ? detail?.P4 : '--' }}
            </q-item-section>
          </q-item>
          <q-separator />
          <!--完成時間 或 時間 -->
          <q-item style="min-height: 32px">
            <q-item-section class="text-grey-6 text-caption"
              >{{
                'Balance' in record
                  ? $t('transaction.complete_time')
                  : $t('transaction_history.label.time')
              }}
            </q-item-section>
            <q-item-section avatar>
              {{ dayjs(record?.Date).format('YYYY-MM-DD HH:mm:ss') }}
            </q-item-section>
          </q-item>
          <!--訂單號 -->
          <q-item style="min-height: 32px" v-if="'Tx_HASH' in record">
            <q-item-section class="text-grey-6 text-caption">
              Tx Hash</q-item-section
            >
            <q-item-section avatar class="text-right">
              {{ record?.Tx_HASH?.substring(0, 21) }} <br />
              <div class="row">
                {{ record?.Tx_HASH?.substring(21) }}
                <CopyButton :value="record?.Tx_HASH" />
              </div>
            </q-item-section>
          </q-item>
          <!--合約書編號 -->
          <q-item
            style="min-height: 32px"
            v-if="'P2' in record && !!record?.P2"
          >
            <q-item-section class="text-grey-6 text-caption">
              {{ $t('transaction.contract_number') }}
            </q-item-section>
            <q-item-section avatar class="text-blue-13 cursor-pointer">
              content(fake)
            </q-item-section>
          </q-item>
          <!--備註 -->
          <!-- <q-item style="min-height: 32px" v-if="'Balance' in record">
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
          :label="t('label.close')"
          v-close-popup
        />
        <!--交易對話紀錄btn -->
        <div
          class="flex justify-center"
          v-if="record?.MasterType < 2 && 'Balance' in record"
        >
          <q-btn
            flat
            color="blue-13"
            :label="t('transaction.conversation_record')"
            disable
          />
        </div>
        <div class="flex justify-center" v-else>
          <q-btn
            v-if="record.MasterType < 2"
            @click="handleBackTrade"
            flat
            color="blue-13"
            :label="t('transaction_history.返回交易')"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { OrderStatusNum } from 'src/stores/live';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed } from 'vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import { AccNum } from 'src/pages/account/api';
import CopyButton from './CopyButton.vue';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
import tradeApi from 'src/pages/trade/api';
const props = defineProps<{
  visible: boolean;
  record: OrderRecord | ExpiredOrder;
  isExpired?: boolean;
}>();
defineEmits(['update:visible']);
//
const { t } = useI18n();
const router = useRouter();
const { data: detail } = tradeApi.useDetail({
  Token: props.record.token,
  ready: computed(() => !!props.record.token && props.visible),
});
// DOM
const recordInfo = computed(() => {
  if (props.isExpired && useStorage().getStorageSync('isAgent')) {
    switch (props.record?.MasterType) {
      case MasterTypeNum.Sell:
        return { label: t('label.buy'), color: 'blue-13' };
      case MasterTypeNum.Buy:
        return { label: t('label.sell'), color: 'red' };
      case MasterTypeNum.TransIn:
        return {
          label: t(
            `transaction_history.label.transaction_type.${MasterTypeNum.TransIn}`
          ),
          color: 'purple',
        };
      case MasterTypeNum.TransIn:
        return {
          label: t(
            `transaction_history.label.transaction_type.${MasterTypeNum.TransOut}`
          ),
          color: 'purple',
        };
      default: {
        return { label: t('label.undefined'), color: 'purple' };
      }
    }
  }
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
        color: 'purple',
      };
    case MasterTypeNum.TransOut:
      return {
        label: t(
          `transaction_history.label.transaction_type.${MasterTypeNum.TransOut}`
        ),
        color: 'purple',
      };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});
const payerInfo = computed(() => {
  if ('P5' in props.record) {
    if (props.isExpired && useStorage().getStorageSync('isAgent')) {
      switch (props.record?.MasterType) {
        case MasterTypeNum.Sell: {
          const name = props?.record?.P5;
          const bank = props?.record?.P3;
          const code = props?.record?.P4;
          const account = props?.record?.P1;
          return {
            name,
            bank,
            code,
            account,
          };
        }
        case MasterTypeNum.Buy: {
          const [name, bank, code, account] = props.record?.P5?.split('|');
          return {
            name,
            bank,
            code,
            account,
          };
        }
        default: {
          return { label: t('label.undefined'), color: 'purple' };
        }
      }
    }
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
          account,
        };
      }
      case MasterTypeNum.Sell: {
        const [name, bank, code, account] = props.record?.P5?.split('|');
        return {
          name,
          bank,
          code,
          account,
        };
      }
      default: {
        return { label: t('label.undefined'), color: 'purple' };
      }
    }
  }
  return { label: t('label.undefined'), color: 'purple' };
});

const statusInfo = computed(() => {
  if (props.isExpired && useStorage().getStorageSync('isAgent')) {
    switch (Number(detail?.value?.MasterType)) {
      case MasterTypeNum.Sell:
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
          case OrderStatusNum.Cancel:
            return t('transaction.交易取消');
          case OrderStatusNum.TimeOut:
            return t('transaction.交易取消');
          default:
            return t('label.undefined');
        }
      case MasterTypeNum.Buy:
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
          case OrderStatusNum.Cancel:
            return t('transaction.交易取消');
          case OrderStatusNum.TimeOut:
            return t('transaction.交易取消');
          default:
            return t('label.undefined');
        }
      default:
        return t('transaction.complete');
    }
  }
  switch (Number(detail?.value?.MasterType)) {
    case MasterTypeNum.Buy:
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
        case OrderStatusNum.Cancel:
          return t('transaction.交易取消');
        case OrderStatusNum.TimeOut:
          return t('transaction.交易取消');
        default:
          return t('label.undefined');
      }
    case MasterTypeNum.Sell:
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
        case OrderStatusNum.Cancel:
          return t('transaction.交易取消');
        case OrderStatusNum.TimeOut:
          return t('transaction.交易取消');
        default:
          return t('label.undefined');
      }
    default:
      return t('transaction.complete');
  }
});
// 亡羊補牢
const handleBackTrade = () => {
  if (props.isExpired && useStorage().getStorageSync('isAgent')) {
    router.push({
      name: 'trade',
      query: {
        token: props.record.token,
        type: props.record?.MasterType === MasterTypeNum.Sell ? 'buy' : 'sell',
        action: 'trading',
      },
    });
  } else {
    router.push({
      name: 'trade',
      query: {
        token: props.record.token,
        type: props.record?.MasterType === MasterTypeNum.Buy ? 'buy' : 'sell',
        action: 'trading',
      },
    });
  }
};
</script>

<style scoped></style>
