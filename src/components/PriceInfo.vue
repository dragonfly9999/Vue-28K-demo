<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
defineProps<{ order?: OrderStatus }>();
</script>
<template>
  <div class="flex items-center q-gutter-sm q-mb-md">
    <!-- 匯率 -->
    <div class="flex items-baseline">
      <q-separator vertical spaced />
      <div>
        <div class="text-grey-6 text-caption">
          {{ $t('label.rate') }}
        </div>
        <div class="text-weight-bold text-right">
          {{ thousandTool(order?.D1, 'CNY') }}
        </div>
      </div>
    </div>
    <!-- 數量 -->
    <div class="flex items-baseline">
      <q-separator vertical spaced />
      <div>
        <div class="text-grey-6 text-caption">
          {{ $t('transaction.quantity') }}
        </div>
        <div class="text-weight-bold text-right">
          {{ thousandTool(order?.UsdtAmt, 'USDT') }} USDT
        </div>
      </div>
    </div>
    <!-- 總金額 -->
    <div class="flex items-baseline ">
      <q-separator vertical spaced />
      <div>
        <div class="text-blue-13 text-caption">
          {{ $t('transaction.total_amount') }}
        </div>
        <div class="text-blue-13 text-weight-bold ">
          {{ thousandTool(order?.D2, 'CNY') + ' ' + order?.Currency }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
