<template>
  <q-item clickable v-ripple @click="() => (detailVisible = true)">
    <q-item-section class="q-pa-xs">
      <div class="flex no-wrap q-gutter-x-sm items-center">
        <div>
          <div
            :class="'text-h6 text-' + recordInfo.color + ' text-weight-bold'"
          >
            {{ recordInfo.label }}
          </div>
          <q-badge
            v-if="
              [MasterTypeNum.Buy, MasterTypeNum.Sell].includes(
                order?.MasterType
              )
            "
            :color="recordInfo.color"
            >USDT/{{ currency }}
          </q-badge>
        </div>
        <q-space />

        <!-- 數量 -->
        <div
          class="items-center text-right"
          v-if="'UsdtAmt' in order && order?.UsdtAmt"
        >
          <div class="text-caption text-grey-6">
            {{ $t('transaction.數量') }}(USDT)
          </div>
          <div :class="'text-body1 text-weight-bold text-' + recordInfo.color">
            {{ thousandTool(order?.UsdtAmt, 'USDT') }}
          </div>
        </div>
        <!-- 結餘 -->
        <div class="items-center text-right" v-if="'Balance' in order">
          <div class="text-caption text-grey-6">
            {{ $t('label.real_balance') }}(USDT)
          </div>
          <div class="text-body1 text-green-9">
            {{ thousandTool(order?.Balance, 'USDT') }}
          </div>
        </div>
      </div>
      <div class="flex no-wrap q-py-sm">
        <div class="q-gutter-xs">
          <!-- 匯率 -->
          <div class="flex" v-show="!!order?.D1">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.rate') }}
            </div>
            <div class="text-caption">
              {{ thousandTool(order?.D1, 'CNY') }}
            </div>
          </div>
          <!-- 金額 -->
          <div class="flex" v-show="order?.D2">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.amount') }}(CNY)
            </div>
            <div class="text-caption">
              {{ thousandTool(order?.D2, 'CNY') }}
            </div>
          </div>
          <!-- 交易方姓名 -->
          <div
            class="flex"
            v-if="
              'P2' in order &&
              [MasterTypeNum.Buy, MasterTypeNum.Sell].includes(
                order?.MasterType
              )
            "
          >
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.name') }}
            </div>
            <div class="text-caption">
              {{
                order?.MasterType === MasterTypeNum.Buy
                  ? order?.P2
                  : order?.P5?.split('|')?.[0]
              }}
            </div>
          </div>
          <!-- 時間 -->
          <div class="flex">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.time') }}
            </div>
            <div class="text-caption">
              {{ date }}
            </div>
          </div>
        </div>
      </div>
    </q-item-section>

    <RecordDetail
      v-model:visible="detailVisible"
      :record="order"
      :is-expired="isExpired"
    />
  </q-item>
</template>

<script setup lang="ts">
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import RecordDetail from './RecordDetail.vue';
import { useStateStore } from 'src/stores';
import { useStorage } from 'vue3-storage';
const props = defineProps<{
  order: OrderRecord | ExpiredOrder;
  isExpired?: boolean;
}>();

//
const { t } = useI18n();
const { currency } = useStateStore();

// DOM
const detailVisible = ref(false);
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
const recordInfo = computed(() => {
  if (isAgent.value && props.isExpired) {
    switch (props.order.MasterType) {
      case MasterTypeNum.Sell:
        return {
          label: t(`transaction_history.transaction_type.${MasterTypeNum.Buy}`),
          color: 'blue-13',
        };
      case MasterTypeNum.Buy:
        return {
          label: t(
            `transaction_history.transaction_type.${MasterTypeNum.Sell}`
          ),
          color: 'red',
        };
      case MasterTypeNum.TransOut:
        return {
          label: t(
            `transaction_history.transaction_type.${MasterTypeNum.TransIn}`
          ),
          color: 'purple',
        };
      case MasterTypeNum.TransIn:
        return {
          label: t(
            `transaction_history.transaction_type.${MasterTypeNum.TransOut}`
          ),
          color: 'purple',
        };
      default: {
        return { label: t('label.undefined'), color: 'purple' };
      }
    }
  }
  switch (props.order.MasterType) {
    case MasterTypeNum.Buy:
      return {
        label: t(`transaction_history.transaction_type.${MasterTypeNum.Buy}`),
        color: 'blue-13',
      };
    case MasterTypeNum.Sell:
      return {
        label: t(`transaction_history.transaction_type.${MasterTypeNum.Sell}`),
        color: 'red',
      };
    case MasterTypeNum.TransIn:
      return {
        label: t(
          `transaction_history.transaction_type.${MasterTypeNum.TransIn}`
        ),
        color: 'purple',
      };
    case MasterTypeNum.TransOut:
      return {
        label: t(
          `transaction_history.transaction_type.${MasterTypeNum.TransOut}`
        ),
        color: 'purple',
      };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});

const date = computed(() =>
  dayjs(props.order.Date).format('YYYY-MM-DD HH:mm:ss')
);
</script>

<style scoped></style>
