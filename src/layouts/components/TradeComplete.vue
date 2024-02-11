<template>
  <q-card class="width600">
    <StepperMaster :order="order" />

    <div class="text-center column items-center justify-center">
      <q-icon class="text-blue-13 text-h1" name="check_circle_outline" />
      <!-- 交易完成 -->
      <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
        {{ t('transaction.transaction_complete') }}
      </div>
      <!-- 訂單號 -->
      <div class="q-ma-sm text-body-1 text-grey-8 items-center">
        Tx Hash：
        <PunctuationMaster color="black" :label="order?.Tx_HASH" />
      </div>
    </div>

    <div class="text-center justify-center q-pa-md q-gutter-y-sm">
      <!--返回主頁 -->
      <q-btn
        rounded
        unelevated
        class="full-width q-mb-sm"
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
  </q-card>

  <q-dialog v-model="isVisibleDetail">
    <TransactionDetail />
  </q-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StepperMaster from 'src/components/StepperMaster.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import TransactionDetail from './TransactionDetail.vue';
import { usePendingStore } from 'src/stores';
defineProps<{ order: OrderStatus | undefined }>();
//
const { t } = useI18n();
const router = useRouter();
// DOM
const isVisibleDetail = ref(false);
const { pendingInstant } = usePendingStore();

// Live cycle
onMounted(() => {
  setTimeout(() => pendingInstant.refresh(), 1000);

  // scroll
  setTimeout(() => {
    const domElement = document.documentElement;
    domElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
});
</script>

<style scoped></style>
