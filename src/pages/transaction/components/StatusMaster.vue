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
            text_color: 'blue-13',
            bg_color: 'grey-1',
          };
        case OrderStatusNum.Assigned:
          return {
            label: t('transaction.payment_required'),
            text_color: 'blue-14',
            bg_color: 'blue-1',
          };
        case OrderStatusNum.Committed:
          return {
            label: t('transaction.inProgress'),
            text_color: 'blue-grey-4',
            bg_color: 'grey-1',
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
            text_color: 'green-10 ',
            bg_color: 'green-1',
          };
        default:
          return {
            label: t('transaction.pairing'),
            text_color: 'blue-13',
            bg_color: 'grey-1',
          };
      }
    case MtTypeNum.Sell:
      switch (props.order?.Order_StatusID) {
        case OrderStatusNum.Matching:
          return {
            label: t('transaction.pairing'),
            text_color: 'blue-13',
            bg_color: 'grey-1',
          };
        case OrderStatusNum.Assigned:
          return {
            label: t('transaction.opponent_preparing'),
            text_color: 'blue-grey-4',
            bg_color: 'grey-1',
          };
        case OrderStatusNum.Committed:
          return {
            label: t('transaction.need_confirm_payment'),
            text_color: 'red-14',
            bg_color: 'red-1',
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
            text_color: 'green-10 ',
            bg_color: 'green-1',
          };
        default:
          return {
            label: t('transaction.pairing'),
            text_color: 'blue-13',
            bg_color: 'grey-1',
          };
      }
    case MtTypeNum.CantTake:
      return {
        label: t('transaction.cantTake'),
        text_color: 'dark',
        bg_color: 'grey-1',
      };
    default:
      return {
        label: t('label.undefined'),
        text_color: 'dark',
        bg_color: 'grey-1',
      };
  }
});
</script>
<template>
  <q-badge
    rounded
    class="flex items-end items-center q-px-xs"
    :color="OrderStatus.bg_color"
  >
    <div v-if="[MtTypeNum.Buy].includes(numberTool(order?.MType))">
      <q-spinner-ball
        v-if="
          [OrderStatusNum.Matching].includes(numberTool(order?.Order_StatusID))
        "
        color="blue-13"
      />
      <q-spinner-puff
        v-else-if="
          [OrderStatusNum.Assigned].includes(numberTool(order?.Order_StatusID))
        "
        color="blue-14"
        size="2em"
      />
      <q-spinner-hourglass
        v-else-if="
          [OrderStatusNum.Committed].includes(numberTool(order?.Order_StatusID))
        "
        color="blue-grey-4"
      />
      <q-spinner-comment
        v-else-if="
          [OrderStatusNum.Appeal].includes(numberTool(order?.Order_StatusID))
        "
        color="orange-9"
        size="2em"
      />
      <q-spinner-ball v-else color="blue-13" />
    </div>
    <!--  -->
    <div v-else-if="[MtTypeNum.Sell].includes(numberTool(order?.MType))">
      <q-spinner-ball
        v-if="
          [OrderStatusNum.Matching].includes(numberTool(order?.Order_StatusID))
        "
        color="blue-13"
      />
      <q-spinner-hourglass
        v-else-if="
          [OrderStatusNum.Assigned].includes(numberTool(order?.Order_StatusID))
        "
        color="blue-grey-4"
      />
      <q-spinner-puff
        v-else-if="
          [OrderStatusNum.Committed].includes(numberTool(order?.Order_StatusID))
        "
        color="red-14"
        size="2em"
      />
      <q-spinner-comment
        v-else-if="
          [OrderStatusNum.Appeal].includes(numberTool(order?.Order_StatusID))
        "
        color="orange-9"
        size="2em"
      />
      <q-spinner-ball v-else color="blue-13" />
    </div>
    <div
      :class="`text-caption text-weight-bold text-${OrderStatus.text_color}`"
    >
      {{ OrderStatus.label }}
    </div>
  </q-badge>
</template>

<style scoped></style>
