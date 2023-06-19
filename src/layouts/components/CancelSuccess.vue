<script setup lang="ts">
import dayjs from 'dayjs';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
const router = useRouter();
</script>
<template>
  <div class="q-mt-xl text-center">
    <!-- title -->
    <q-icon class="material-icons text-red text-h1">cancel</q-icon>
    <div class="text-h6 text-weight-bold q-mx-sm">
      {{ t('transaction.deal_canceled') }}
    </div>

    <!-- order title -->
    <div class="text-left text-subtitle1 text-blue-13 q-mt-lg">
      {{
        order?.MasterType === MasterTypeNum.Buy
          ? t('label.buy')
          : t('label.sell')
      }}
      USDT/ {{ order?.Currency }}
    </div>
    <!-- order info -->
    <div class="text-left bg-step q-pa-md">
      <!-- 數量 -->
      <div class="flex items-center">
        <div class="text-grey-6">{{ t('transaction.quantity') }}：</div>
        <div>
          {{ thousandTool(order?.UsdtAmt, 'USDT') }}
          USDT
        </div>
      </div>
      <!-- 訂單建立時間 -->
      <div class="flex items-center">
        <div class="text-grey-6">{{ t('transaction.order_time') }}：</div>
        <div>{{ dayjs(order?.CreateDate).format('YYYY-MM-DD HH:mm') }}</div>
      </div>
      <!-- 訂單號 -->
      <div class="flex items-center ellipsis">
        <div class="text-grey-6">{{ t('transaction.order_number') }}：</div>
        <punctuation-master
          color="black"
          :label="order?.Tx_HASH"
          justify="left"
        />
      </div>
    </div>

    <div class="text-center q-mt-md justify-center q-gutter-y-sm">
      <q-btn
        unelevated
        rounded
        class="full-width"
        @click="() => router.push({ name: 'dashboard' })"
        color="blue-13"
        :label="t('label.back_front_page')"
      />
    </div>
  </div>
</template>

<style scoped></style>
