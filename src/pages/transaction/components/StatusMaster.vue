<script setup lang="ts">
import { MtTypeNum, OrderStatusNum } from 'src/stores/live';
import { numberTool } from 'src/utils/NumberTool';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps<{ order: LiveOrder | undefined }>();

// DOM
const OrderStatus = computed(() => {
  switch (Number(props.order?.MType)) {
    case MtTypeNum.Buy:
      switch (props.order?.Order_StatusID) {
        case OrderStatusNum.Matching:
          return {
            label: t('transaction.pairing'),
            text_color: 'orange-9',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Assigned:
          return {
            label: t('transaction.payment_required'),
            text_color: 'red',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Committed:
          return {
            label: t('transaction.inProgress'),
            text_color: 'orange-9 ',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Appeal:
          return {
            label: t('transaction.appeal'),
            text_color: 'blue-13 ',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Complete:
          return {
            label: t('transaction.complete'),
            text_color: 'orange-9 ',
            bg_color: 'orange-1',
          };
        default:
          return {
            label: t('transaction.pairing'),
            text_color: 'orange-9',
            bg_color: 'orange-1',
          };
      }
    case MtTypeNum.Sell:
      switch (props.order?.Order_StatusID) {
        case OrderStatusNum.Matching:
          return {
            label: t('transaction.pairing'),
            text_color: 'orange-9',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Assigned:
          return {
            label: t('transaction.opponent_preparing'),
            text_color: 'orange-9',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Committed:
          return {
            label: t('transaction.need_confirm_payment'),
            text_color: 'orange-9',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Appeal:
          return {
            label: t('transaction.appeal'),
            text_color: 'orange-9 ',
            bg_color: 'orange-1',
          };
        case OrderStatusNum.Complete:
          return {
            label: t('transaction.complete'),
            text_color: 'orange-9 ',
            bg_color: 'orange-1',
          };
        default:
          return {
            label: t('transaction.pairing'),
            text_color: 'orange-9',
            bg_color: 'orange-1',
          };
      }
    default:
      return {
        label: t('label.undefined'),
        text_color: 'orange-9',
        bg_color: 'orange-1',
      };
  }
});
</script>
<template>
  <q-badge
    transparent
    rounded
    class="flex items-end items-center q-px-xs"
    :color="OrderStatus.bg_color"
  >
    <div v-if="[MtTypeNum.Buy].includes(numberTool(order?.MType))">
      <q-spinner-hourglass
        v-if="
          [OrderStatusNum.Matching].includes(numberTool(order?.Order_StatusID))
        "
        color="orange-9"
        size="1.5em"
      />
      <q-spinner-audio
        v-if="
          [OrderStatusNum.Appeal].includes(numberTool(order?.Order_StatusID))
        "
        color="orange-9"
        size="1.5em"
      />
    </div>
    <!--  -->
    <div v-else-if="[MtTypeNum.Sell].includes(numberTool(order?.MType))">
      <q-spinner-hourglass
        v-if="
          [OrderStatusNum.Matching].includes(numberTool(order?.Order_StatusID))
        "
        color="orange-9"
        size="1.5em"
      />
      <q-spinner-ball
        v-if="
          [OrderStatusNum.Appeal].includes(numberTool(order?.Order_StatusID))
        "
        color="orange-9"
        size="1.5em"
      />
    </div>
    <div
      :class="`text-caption text-weight-bold text-${OrderStatus.text_color}`"
    >
      {{ OrderStatus.label }}
    </div>
  </q-badge>
</template>

<style scoped></style>
