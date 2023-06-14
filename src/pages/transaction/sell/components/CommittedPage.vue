<script setup lang="ts">
import { getLeaseTime } from 'src/utils/TimeMaster';
import StepperMaster from 'src/components/StepperMaster.vue';
import { useI18n } from 'vue-i18n';
import { OrderStatusNum } from 'src/stores/live';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import SellConfirm from './SellConfirm.vue';
import AppealConfirm from 'src/components/AppealConfirm.vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import PriceInfo from 'src/components/PriceInfo.vue';
defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
const timeInterval = ref<NodeJS.Timeout>();
const deltaTime = ref(0);
// DOM
const visible = reactive({
  confirm: false,
  appeal: false
});
onMounted(() => {
  timeInterval.value = setInterval(() => (deltaTime.value += 1), 1000);
});
onBeforeUnmount(() => clearInterval(timeInterval.value));
</script>
<template>
  <div class="full-width col-auto">
    <!-- 步驟 -->
    <StepperMaster :order="order" />
  </div>

  <div class="full-width col-auto q-pa-md justify-center">
    <div class="flex no-wrap items-end justify-between q-mb-lg">
      <div style="min-width: fit-content" class="q-mr-xl">
        {{ t('label.sell') }} USDT
      </div>
      <PunctuationMaster :label="order?.Tx_HASH" />
    </div>

    <PriceInfo :order="order" />
    <!-- hint -->
    <div class="flex items-start text-grey-8 q-mb-lg no-wrap">
      <q-icon name="error_outline" color="orange-9" size="xs" class="q-mr-sm" />
      <!-- 為確保交易雙方帳戶安全請於交易對話窗上傳 -->
      <div class="text-blue-grey-10">
        {{ t('warn.hint_cny_6') }}
        <!-- 【24小時內銀行流水帳截圖】 -->
        <span class="text-weight-bold">【{{ t('warn.hint_cny_8') }}】</span>

        <div class="q-mt-xs">{{ t('sell.hint2') }}</div>
      </div>
    </div>

    <div class="flex justify-between q-mb-lg">
      <!-- 付款方資料 -->
      <div class="text-h6 text-weight-bold q-mx-sm text-primary">
        {{ t('transaction.payer') }}
      </div>
      <div class="flex items-center">
        <q-icon name="schedule" color="primary" />
        <!-- 付款時間 -->
        <div class="text-caption q-ml-xs">
          {{ t('transaction.payment_time') }}:
          {{
            getLeaseTime(order?.CreateDate, (order?.DeltaTime ?? 0) + deltaTime)
          }}
        </div>
      </div>
    </div>

    <div class="mycolor1 q-pa-sm info td">
      <table class="q-pa-xs">
        <tr
          v-for="(information, index) in [
            {
              title: t('sell.payer_account_name'),
              content: order?.P5?.split('|')?.[0]
            }
          ]"
          :key="index"
        >
          <td class="text-body1 text-grey-8">{{ information.title }}:</td>
          <td class="text-body1 text-weight-bold text-dark">
            {{ information.content }}
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div class="full-width col-auto q-pa-sm">
    <!-- 交易中 -->
    <div v-if="order?.Order_StatusID === OrderStatusNum.Committed">
      <q-btn
        class="full-width"
        glossy
        color="primary"
        :label="t('sell.step_hint_sell_title_3')"
        @click="() => (visible.confirm = true)"
      />
      <q-btn
        class="full-width"
        dense
        flat
        color="primary"
        @click="() => (visible.appeal = true)"
        :label="t('label.appeal')"
      />
    </div>

    <!-- 申訴中 -->
    <div v-else class="text-center">
      <q-btn
        class="full-width"
        glossy
        color="primary"
        :label="t('sell.step_hint_sell_title_3')"
        @click="() => (visible.confirm = true)"
      />

      <div class="flex justify-center">
        <q-btn
          flat
          :label="t('transaction.appeal')"
          class="flex items-center text-orange-9"
          icon="error"
        >
          <q-popup-proxy>
            <q-banner>
              <template v-slot:avatar>
                <q-icon name="error" color="orange-9" />
              </template>
              {{ t('sell.appeal_hint') }}
            </q-banner>
          </q-popup-proxy>
        </q-btn>
      </div>
    </div>
  </div>

  <q-dialog
    v-model="visible.confirm"
    trnasition-show="fade"
    trnasition-hide="fade"
  >
    <SellConfirm :order="order" />
  </q-dialog>

  <q-dialog
    v-model="visible.appeal"
    trnasition-show="fade"
    trnasition-hide="fade"
  >
    <AppealConfirm />
  </q-dialog>
</template>

<style scoped></style>
