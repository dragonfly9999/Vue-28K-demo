<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
defineProps<{ order?: OrderStatus }>();
</script>
<template>
  <div class="flex items-center q-gutter-md q-pl-sm">
    <!-- 匯率 -->
    <div>
      <div class="text-grey-6 text-caption">
        {{ $t('label.rate') }}
      </div>
      <div class="text-weight-bold text-right">
        {{ thousandTool(order?.D1, 2) }}
      </div>
    </div>
    <q-separator vertical spaced="10px" inset />
    <!-- 數量 -->
    <div>
      <div class="text-grey-6 text-caption">
        {{ $t('transaction.quantity') }}
      </div>
      <div class="text-weight-bold text-right">
        {{ thousandTool(order?.UsdtAmt, 3) }} USDT
      </div>
    </div>
    <q-separator vertical spaced="10px" inset />
    <!-- 總金額 -->
    <div class="flex items-baseline q-mb-sm">
      <div class="text-blue-13 text-weight-bold q-mr-xs">
        {{ $t('transaction.total_amount') }}
      </div>
      <div class="text-blue-13 text-weight-bold text-h6">
        {{ thousandTool(order?.D2, 1) + ' ' + order?.Currency }}
      </div>
    </div>
  </div>
  <q-separator spaced="15px" inset />
</template>

<style scoped></style>
