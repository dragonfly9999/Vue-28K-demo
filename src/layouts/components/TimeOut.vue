<script setup lang="ts">
import AppealConfirm from 'src/components/AppealConfirm.vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import dayjs from 'dayjs';
import { MasterTypeNum, thousandTool } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
const router = useRouter();
const appealWarn = ref(false);
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
</script>
<template>
  <q-card class="width600 text-center">
    <!-- title -->
    <q-icon name="running_with_errors" class="text-red text-h1" />
    <div class="text-h6 text-weight-bold q-mx-sm">
      {{ $t('transaction.over_time') }}
    </div>

    <!-- order title -->
    <div class="text-left text-subtitle1 text-blue-13 q-mt-lg">
      {{
        (order?.MasterType === MasterTypeNum.Sell && isAgent) ||
        (!isAgent && order?.MasterType === MasterTypeNum.Buy)
          ? t('buy.buy')
          : t('sell.sell')
      }}
      USDT/ {{ order?.Currency }}
    </div>
    <!-- order info -->
    <div class="text-left bg-step q-pa-md">
      <!-- 數量 -->
      <div class="flex items-center">
        <div class="text-grey-6">{{ $t('transaction_history.數量') }}：</div>
        <div>{{ thousandTool(order?.['UsdtAmt'], 'USDT') }} USDT</div>
      </div>
      <!-- 訂單建立時間 -->
      <div class="flex items-center">
        <div class="text-grey-6">
          {{ $t('transaction_history.訂單建立時間') }}：
        </div>
        <div>
          {{ dayjs(order?.['CreateDate']).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
      <!-- 訂單號 -->
      <div class="flex items-center ellipsis">
        <div class="text-grey-6 flex">
          Tx Hash：
          <punctuation-master
            color="black"
            :label="order?.Tx_HASH"
            justify="left"
          />
        </div>
      </div>
    </div>

    <div class="text-center q-mt-md justify-center q-gutter-y-md">
      <!-- 申訴btn -->
      <q-btn
        v-if="
          (isAgent && order?.MasterType === MasterTypeNum.Sell) ||
          (!isAgent && order?.MasterType === MasterTypeNum.Buy)
        "
        rounded
        unelevated
        @click="() => (appealWarn = true)"
        class="full-width"
        color="blue-13"
        :label="$t('main.appeal')"
      />
      <!-- 返回主頁btn -->
      <q-btn
        flat
        @click="() => router.push({ name: 'dashboard' })"
        color="blue-13"
        class="full-width"
        :label="$t('transaction.返回主頁')"
      />
      <!-- <q-btn flat color="blue-13" label="交易明細" />  -->
    </div>
  </q-card>

  <q-dialog v-model="appealWarn" trnasition-show="fade" trnasition-hide="fade">
    <AppealConfirm />
  </q-dialog>
</template>

<style scoped></style>
