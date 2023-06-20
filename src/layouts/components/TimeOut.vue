<script setup lang="ts">
import AppealConfirm from 'src/components/AppealConfirm.vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import dayjs from 'dayjs';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
const router = useRouter();
const appealWarn = ref(false);
</script>
<template>
  <div class="q-mt-xl text-center">
    <!-- title -->
    <q-icon class="material-icons text-red text-h1">cancel</q-icon>
    <div class="text-h6 text-weight-bold q-mx-sm">
      {{ $t('transaction.over_time') }}
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
        <div class="text-grey-6">
          {{ $t('transaction_history.label.quantity') }}：
        </div>
        <div>{{ thousandTool(order?.['UsdtAmt'], 'USDT') }} USDT</div>
      </div>
      <!-- 訂單建立時間 -->
      <div class="flex items-center">
        <div class="text-grey-6">
          {{ $t('transaction_history.label.order_time') }}：
        </div>
        <div>{{ dayjs(order?.['CreateDate'], 'YYYY-MM-DD HH:mm:ss') }}</div>
      </div>
      <!-- 訂單號 -->
      <div class="flex items-center ellipsis">
        <div class="text-grey-6 flex">
          {{ $t('transaction.order_number') }}：
          <punctuation-master
            color="black"
            :label="order?.Tx_HASH"
            justify="left"
          />
        </div>
      </div>

      <div class="text-center q-mt-md justify-center q-gutter-y-sm">
        <!-- 申訴btn -->
        <q-btn
          :disable="order?.MasterType === MasterTypeNum.Sell"
          rounded
          unelevated
          @click="() => (appealWarn = true)"
          class="full-width"
          color="blue-13"
          :label="$t('label.appeal')"
        />
        <!-- 返回主頁btn -->
        <q-btn
          flat
          @click="() => router.push({ name: 'dashboard' })"
          color="blue-13"
          class="full-width"
          :label="$t('label.back_front_page')"
        />
        <!-- <q-btn flat color="blue-13" label="交易明細" />  -->
      </div>
    </div>
  </div>

  <q-dialog v-model="appealWarn" trnasition-show="fade" trnasition-hide="fade">
    <AppealConfirm />
  </q-dialog>
</template>

<style scoped></style>
