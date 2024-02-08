<template>
  <q-card class="full-width no-border no-shadow">
    <!-- 步驟 -->
    <StepperMaster :order="order" />
    <div class="q-px-lg q-pb-md">
      <div class="text-overline">{{ $t('label.sell') }} USDT</div>
      <PriceInfo :order="order" />
      <!-- hint -->
      <div class="flex items-start text-grey-8 q-my-md no-wrap">
        <q-icon
          name="error_outline"
          color="orange-9"
          size="xs"
          class="q-mr-sm"
        />
        <!-- 為確保交易雙方帳戶安全請於交易對話窗上傳 -->
        <div class="text-blue-grey-10">
          {{ $t('warn.hint_cny_6') }}
          <!-- 【24小時內銀行流水帳截圖】 -->
          <span class="text-weight-bold">【{{ $t('warn.hint_cny_8') }}】</span>

          <div class="q-mt-xs">{{ $t('sell.hint1') }}</div>
        </div>
      </div>

      <!-- 付款方資料 -->
      <div class="flex justify-between">
        <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
          {{ $t('transaction.payer') }}
        </div>
        <div class="flex items-center q-gutter-x-xs">
          <q-icon name="schedule" />
          <div class="text-caption">
            {{ $t('transaction.payment_time') }}:
            <span class="text-orange-9">
              {{
                getLeaseTime(
                  order?.CreateDate,
                  (order?.DeltaTime ?? 0) + deltaTime
                )
              }}
            </span>
          </div>
        </div>
      </div>

      <div class="mycolor1 q-pa-sm info td">
        <table class="q-pa-xs">
          <tr
            v-for="(information, index) in [
              {
                title: $t('sell.payer_account_name'),
                content: order?.P5?.split('|')?.[0],
              },
              {
                title: $t('buy.bankInformation.amount'),
                content: thousandTool(order?.D2, 'CNY'),
              },
            ]"
            :key="index"
          >
            <td class="text-body1 text-grey-7">{{ information.title }}:</td>
            <td class="text-body1 text-weight-bold text-dark">
              {{ information.content }}
            </td>
          </tr>
        </table>
      </div>

      <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
        {{ $t('transaction.beneficiary') }}
      </div>
      <div class="mycolor1 q-pa-sm info td">
        <table class="q-pa-xs">
          <tr
            v-for="(information, index) in [
              {
                title: $t('transaction.payee'),
                content: order?.P2,
              },
              {
                title: $t('transaction.account_number'),
                content: order?.P1,
              },
              {
                title: $t(`transaction.bank_name`),
                content: order?.P3,
              },
              {
                title: $t(`transaction.code.${order?.Currency}`),
                content: order?.P4 ? order?.P4 : '--',
              },
            ]"
            :key="index"
          >
            <td class="text-body1 text-grey-7">{{ information.title }}:</td>
            <td class="text-body1 text-weight-bold text-dark">
              {{ information.content }}
            </td>
            <!-- <CopyButton :value="information.content" /> -->
          </tr>
        </table>
      </div>
      <PunctuationMaster :label="order?.Tx_HASH" />

      <div class="q-gutter-y-md">
        <q-btn
          unelevated
          rounded
          class="full-width"
          color="blue-13"
          :disabled="true"
        >
          <q-spinner-puff color="white" size="1em"> </q-spinner-puff>
          {{ $t('transaction.opponent_preparing') }}
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
// import CopyButton from 'src/components/CopyButton.vue';
import { getLeaseTime } from 'src/utils/TimeMaster';
import StepperMaster from 'src/components/StepperMaster.vue';
import PriceInfo from 'src/components/PriceInfo.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import { thousandTool } from 'src/utils/NumberTool';

defineProps<{ order?: OrderStatus }>();
// DOM
const timeInterval = ref<NodeJS.Timeout>();
const deltaTime = ref(0);

// life cycle
onMounted(() => {
  timeInterval.value = setInterval(() => (deltaTime.value += 1), 1000);
});
onBeforeUnmount(() => clearInterval(timeInterval.value));
</script>

<style scoped></style>
