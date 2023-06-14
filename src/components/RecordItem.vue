<script setup lang="ts">
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import RecordDetail from './RecordDetail.vue';
const props = defineProps<{ order: OrderRecord }>();

//
const { t } = useI18n();
// DOM
const detailVisible = ref(false);
const recordInfo = computed(() => {
  switch (props.order.MasterType) {
    case MasterTypeNum.Buy:
      return {
        label: t(
          `transaction_history.label.transaction_type.${MasterTypeNum.Buy}`
        ),
        color: 'blue-13'
      };
    case MasterTypeNum.Sell:
      return {
        label: t(
          `transaction_history.label.transaction_type.${MasterTypeNum.Sell}`
        ),
        color: 'red'
      };
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
</script>
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
          <q-badge :color="recordInfo.color">USDT/CNY</q-badge>
        </div>
        <q-space />

        <!-- 數量 -->
        <div class="items-center text-right" v-show="order?.UsdtAmt">
          <div class="text-caption text-grey-6">
            {{ $t('transaction.quantity') }}(USDT)
          </div>
          <div :class="'text-body1 text-weight-bold text-' + recordInfo.color">
            {{ thousandTool(order?.UsdtAmt, 3) }}
          </div>
        </div>
        <!-- 結餘 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-6">
            {{ $t('label.real_balance') }}(USDT)
          </div>
          <div class="text-body1 text-green-9">
            {{ thousandTool(order?.Balance, 3) }}
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
              {{ thousandTool(order?.D1, 2) }}
            </div>
          </div>
          <!-- 金額 -->
          <div class="flex" v-show="order?.D2">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.amount') }}(CNY)
            </div>
            <div class="text-caption">
              {{ thousandTool(order?.D2, 1) }}
            </div>
          </div>
          <!-- 交易方姓名 -->
          <div
            class="flex"
            v-show="
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
              {{ dayjs(order.Date).format('YYYY-MM-DD') }}
            </div>
          </div>
        </div>
      </div>
    </q-item-section>
    <q-dialog v-model="detailVisible">
      <RecordDetail :record="order" />
    </q-dialog>
  </q-item>
</template>

<style scoped></style>
