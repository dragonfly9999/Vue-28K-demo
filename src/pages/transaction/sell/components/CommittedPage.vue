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
import { thousandTool } from 'src/utils/NumberTool';

defineProps<{ order: OrderStatus | undefined }>();
const { t } = useI18n();
// DOM
const deltaTime = ref(0);
const timeInterval = ref<NodeJS.Timeout>();
const visible = reactive({
  confirm: false,
  appeal: false,
});
onMounted(() => {
  timeInterval.value = setInterval(() => (deltaTime.value += 1), 1000);
});
onBeforeUnmount(() => clearInterval(timeInterval.value));
</script>
<template>
  <q-card class="full-width no-border no-shadow">
    <!-- 步驟 -->
    <StepperMaster :order="order" />
    <div class="q-px-lg q-pb-md">
      <div class="text-overline">{{ t('label.sell') }} USDT</div>
      <PriceInfo :order="order" />
      <!-- hint -->
      <div class="flex items-center text-grey-8 q-my-md no-wrap">
        <q-icon
          name="error_outline"
          color="orange-9"
          size="xs"
          class="q-mr-sm"
        />
        <!-- 為確保交易雙方帳戶安全請於交易對話窗上傳 -->
        <div class="text-blue-grey-10">
          <div class="q-mt-xs">{{ t('sell.hint2') }}</div>
        </div>
      </div>

      <!-- 付款方資料 -->
      <div class="flex justify-between">
        <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
          {{ t('transaction.payer') }}
        </div>
        <div class="flex items-center q-gutter-x-xs">
          <q-icon name="schedule" />
          <div class="text-caption">
            {{ t('transaction.payment_time') }}:
            <span class="text-orange-9">
              {{
                order?.Order_StatusID !== OrderStatusNum.Appeal
                  ? getLeaseTime(
                      order?.CreateDate,
                      (order?.DeltaTime ?? 0) + deltaTime
                    )
                  : '--'
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
                title: t('sell.payer_account_name'),
                content: order?.P5?.split('|')?.[0],
              },
              {
                title: t('buy.bankInformation.amount'),
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
        {{ t('transaction.beneficiary') }}
      </div>
      <div class="mycolor1 q-pa-sm info td">
        <table class="q-pa-xs">
          <tr
            v-for="(information, index) in [
              {
                title: t('transaction.payee'),
                content: order?.P2,
              },
              {
                title: t('transaction.account_number'),
                content: order?.P1,
              },
              {
                title: t(`transaction.bank_name`),
                content: order?.P3,
              },
              {
                title: t(`transaction.code.${order?.Currency}`),
                content: order?.P4 ? order?.P4 : '--',
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
      <PunctuationMaster :label="order?.Tx_HASH" />

      <!-- 交易中 -->
      <div
        v-if="order?.Order_StatusID === OrderStatusNum.Committed"
        class="q-gutter-y-md"
      >
        <q-btn
          class="full-width"
          rounded
          unelevated
          color="blue-13"
          :label="t('sell.step_hint_sell_title_3')"
          @click="() => (visible.confirm = true)"
        />
        <q-btn
          class="full-width"
          dense
          flat
          color="blue-13"
          @click="() => (visible.appeal = true)"
          :label="t('label.appeal')"
        />
      </div>

      <!-- 申訴中 -->
      <div v-else class="text-center q-gutter-y-md">
        <q-btn
          class="full-width"
          rounded
          unelevated
          color="blue-13"
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
  </q-card>

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
