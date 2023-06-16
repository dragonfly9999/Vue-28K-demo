<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getLeaseTime } from 'src/utils/TimeMaster';
import StepperMaster from 'src/components/StepperMaster.vue';
import PriceInfo from 'src/components/PriceInfo.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
defineProps<{ order?: OrderStatus }>();
const timeInterval = ref<NodeJS.Timeout>();
const deltaTime = ref(0);
//
const { t } = useI18n();

onMounted(() => {
  timeInterval.value = setInterval(() => (deltaTime.value += 1), 1000);
});
onBeforeUnmount(() => clearInterval(timeInterval.value));
</script>
<template>
  <div class="col-auto full-width">
    <!-- 步驟 -->
    <StepperMaster :order="order" />
  </div>

  <div class="col-auto justify-center full-width column q-pa-sm">
    <div class="flex no-wrap items-start justify-between q-my-md">
      <div style="min-width: fit-content" class="q-mr-xl">
        {{ t('label.sell') }} USDT
      </div>
      <PunctuationMaster :label="order?.Tx_HASH" />
    </div>
    <PriceInfo :order="order" />

    <!-- hint -->
    <div class="flex items-start text-grey-8 q-mb-lg no-wrap">
      <q-icon name="error_outline" color="orange-9" size="xs" class="q-mr-sm " />
      <!-- 為確保交易雙方帳戶安全請於交易對話窗上傳 -->
      <div class="text-blue-grey-10">
        {{ t('warn.hint_cny_6') }}
        <!-- 【24小時內銀行流水帳截圖】 -->
        <span class="text-weight-bold">【{{ t('warn.hint_cny_8') }}】</span>

        <div class="q-mt-xs">{{ t('sell.hint1') }}</div>
      </div>
    </div>

    <!-- 付款方資料 -->
    <div class="flex justify-between">
      <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
        {{ t('transaction.payer') }}
      </div>
      <div class="flex items-center">
        <q-icon name="schedule" color="blue-13" />
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

  <div class="col-auto full-width q-pa-sm justify-center items-center column">
    <q-btn
      unelevated
      rounded
      class="full-width"
      color="blue-13"
      :disabled="true"
    >
      <q-spinner-puff color="white" size="1em"> </q-spinner-puff>
      {{ t('transaction.opponent_preparing') }}
    </q-btn>
  </div>
</template>

<style scoped></style>
