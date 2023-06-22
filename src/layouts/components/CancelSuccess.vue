<script setup lang="ts">
import dayjs from 'dayjs';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import { thousandTool } from 'src/utils/NumberTool';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
</script>
<template>
  <div class="q-mt-xl text-center container">
    <!-- title -->
    <q-icon class="material-icons text-red text-h1">cancel</q-icon>
    <div class="text-h6 text-weight-bold q-mx-sm">
      {{ t('transaction.deal_canceled') }}
    </div>

    <!-- order title -->
    <div class="text-left text-subtitle1 text-blue-13 q-mt-lg">
      {{ t(`label.${route.name as string}`) }}
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
        <div>{{ dayjs(order?.CreateDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
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

<style scoped>
.container {
  min-width: 400px;
}

@media screen and (max-width: 1024px) {
  .container {
    min-width: 20px;
  }
}
</style>
