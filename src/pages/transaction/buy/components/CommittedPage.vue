<script setup lang="ts">
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import StepperMaster from 'src/components/StepperMaster.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
defineProps<{ order: OrderStatus | undefined }>();
//
const { t } = useI18n();
const router = useRouter();
// Dom
</script>
<template>
  <div class="col-auto full-width">
    <StepperMaster :order="order" />
  </div>

  <div class="col-auto full-width column justify-center">
    <div class="flex justify-center">
      <q-spinner-hourglass color="orange-14" size="5.5em" />
    </div>

    <div class="text-h6 text-weight-bold text-center q-mx-sm text-blue-13">
      <!-- 已提交，等待確認中 -->
      {{ $t('buy.waiting_for_confirmation') }}
    </div>

    <div class="q-ma-sm text-body-1 text-center text-grey-8">
      {{ $t('label.order_number') }}
      <PunctuationMaster justify="center" :label="order?.Tx_HASH" />
    </div>
  </div>
  <div class="full-width col-auto">
    <!-- 返回主頁btn -->
    <q-btn
      rounded
      unelevated
      class="full-width"
      color="blue-13"
      :label="t('label.back_front_page')"
      @click="() => router.push({ name: 'dashboard' })"
    />
  </div>
</template>

<style scoped></style>
