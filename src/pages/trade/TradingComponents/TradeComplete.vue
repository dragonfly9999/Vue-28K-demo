<template>
  <q-card class="width600 q-pa-md">
    <StepperMaster :order="order" />

    <div class="text-center">
      <q-icon
        class="text-blue-13 text-h1 q-mb-sm"
        name="check_circle_outline"
      />
      <div class="text-h6 text-weight-bold q-mb-sm text-blue-13">
        {{ t('transaction.transaction_complete') }}
      </div>
      <div
        class="flex full-width text-body-1 text-grey-8 q-mb-sm justify-center items-center"
      >
        Tx Hash：
        <PunctuationMaster style="color: black" :label="order?.Tx_HASH" />
      </div>
    </div>

    <div class="q-gutter-y-sm">
      <!--返回主頁 -->
      <q-btn
        rounded
        unelevated
        class="full-width"
        color="blue-13"
        :label="$t('transaction.返回主頁')"
        @click="() => router.push({ name: 'dashboard' })"
      />
      <!-- 交易明細-->
      <q-btn
        flat
        rounded
        color="blue-13"
        class="full-width"
        :label="t('transaction.transaction_details')"
        @click="() => (isVisibleDetail = true)"
      />
    </div>

    <TradeDetail v-model:visible="isVisibleDetail" />
  </q-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StepperMaster from 'src/components/StepperMaster.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import TradeDetail from './TradeDetail.vue';
import { usePendingStore, useStateStore } from 'src/stores';
defineProps<{ order: OrderStatus | undefined }>();
//
const { t } = useI18n();
const router = useRouter();
// DOM
const isVisibleDetail = ref(false);

// Live cycle
onMounted(() => {
  usePendingStore().pendingInstant.refresh();
  useStateStore().balanceRequest.refresh();
  // scroll
  setTimeout(() => {
    const domElement = document.documentElement;
    domElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
});
</script>

<style scoped></style>
