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
  <q-card class="full-width no-border no-shadow" style="min-height: 600px">
    <StepperMaster :order="order" />
    <div class="q-pa-lg text-center">
      <div class="q-my-xl">
        <q-spinner-hourglass color="orange-14" size="5.5em" />
        <div class="text-h6 text-weight-bold text-blue-13">
          <!-- 已提交，等待確認中 -->
          {{ $t('buy.waiting_for_confirmation') }}
        </div>

        <div class="text-body-1 text-grey-8">
          {{ $t('label.order_number') }}
        </div>
        <PunctuationMaster :label="order?.Tx_HASH" />
      </div>
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
  </q-card>
</template>

<style scoped></style>
