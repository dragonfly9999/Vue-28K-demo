<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StepperMaster from 'src/components/StepperMaster.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import TransactionDetail from 'src/components/TransactionDetail.vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
defineProps<{ order: OrderStatus | undefined }>();
//
const { t } = useI18n();
const router = useRouter();
// DOM
const isVisibleDetail = ref(false);
</script>
<template>
  <div class="col-auto">
    <StepperMaster :order="order" />
  </div>

  <div class="text-center col-auto column items-center justify-center">
    <q-icon class="material-icons text-primary text-h1"
      >check_circle_outline</q-icon
    >
    <!-- 交易完成 -->
    <div class="text-h6 text-weight-bold q-mx-sm text-primary">
      {{ t('transaction.transaction_complete') }}
    </div>
    <!-- 訂單號 -->
    <div class="q-ma-sm text-body-1 text-grey-8 flex">
      {{ t('transaction.order_number') }}: &nbsp;
      <PunctuationMaster color="black" :label="order?.Tx_HASH" />
    </div>
  </div>

  <div class="text-center justify-center q-pa-md col-auto q-gutter-sm">
    <!--返回主頁 -->
    <q-btn
      glossy
      class="full-width"
      color="primary"
      :label="t('label.back_front_page')"
      @click="() => router.push({ name: 'dashboard' })"
    />
    <!-- 交易明細-->
    <q-btn
      flat
      color="primary"
      class="full-width"
      :label="t('transaction.transaction_details')"
      @click="() => (isVisibleDetail = true)"
    />
  </div>

  <q-dialog v-model="isVisibleDetail">
    <TransactionDetail :order="order" />
  </q-dialog>
</template>

<style scoped></style>
