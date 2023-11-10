<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { getLeaseTime } from 'src/utils/TimeMaster';
import { thousandTool } from 'src/utils/NumberTool';
import { OrderStatusNum } from 'src/stores/live';
import StepperMaster from 'src/components/StepperMaster.vue';
import PriceInfo from 'src/components/PriceInfo.vue';
import BuyConfirm from './BuyConfirm.vue';
import { useBuy2, usePay } from '../api';
import { useRoute } from 'vue-router';
import CancelConfirm from 'src/components/CancelConfirm.vue';
import { handleBoforeUpload } from 'src/utils/ImageManager';
import { useThirdStore } from 'src/stores';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import { useStorage } from 'vue3-storage';
import CopyButton from 'src/components/CopyButton.vue';

defineProps<{ order?: OrderStatus }>();
//
const route = useRoute();
const { t } = useI18n();
const { run: pay } = usePay();
const { run: buy } = useBuy2();
const { getWebSocket } = useThirdStore();
// DOM
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
let TimeInterval: NodeJS.Timeout;
const deltaTime = ref(0);
const filePicker = ref();
const file = ref();
const visible = reactive({
  payWarn: false,
  cancelWarn: false,
});

// handlers
const handleUpload = async (info: File) => {
  const base64 = await handleBoforeUpload(info);
  const sendObj = {
    Message: base64,
    Message_Type: 2,
  };
  getWebSocket(route.query.token as string).send(JSON.stringify(sendObj));
  handleConfirm();
};
const handleConfirm = () => {
  if (isAgent.value) {
    pay({
      Token: route?.query.token as string,
    });
  } else {
    buy({
      Token: route?.query.token as string,
    });
  }
};
// cycle
onMounted(() => {
  TimeInterval = setInterval(() => {
    deltaTime.value += 1;
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(TimeInterval);
});
</script>
<template>
  <q-card class="full-width no-border no-shadow">
    <!-- 步驟 -->
    <StepperMaster :order="order" />
    <div class="q-px-lg q-pb-md">
      <!-- 購買資訊 Header -->
      <div class="text-overline">
        {{ t('buy.buy_usdt') }}
      </div>
      <!-- 購買資訊 Body -->
      <PriceInfo :order="order" />
      <div class="flex items-start text-grey-8 q-my-md no-wrap">
        <q-icon
          name="error_outline"
          color="orange-9"
          size="xs"
          class="q-mr-sm"
        />
        <!-- 為確保交易雙方帳戶安全請於交易對話窗上傳 -->
        <div>
          {{ t('warn.hint_cny_6') }}
          <!-- 【24小時內銀行流水帳截圖】 -->
          <span class="text-weight-bold">【{{ t('warn.hint_cny_8') }}】。</span>
          <!-- 提供後，交易方將提供完整轉帳資料 -->
          {{ t('warn.hint_cny_7') }}
        </div>
      </div>

      <!-- 轉帳資訊 Header -->
      <div class="flex justify-between">
        <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
          <!-- 轉帳資料 -->
          {{ t('buy.transfer_info') }}
        </div>
        <div class="flex items-center q-gutter-x-xs">
          <!-- 付款時間 -->
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
      <!-- 轉帳資訊 Body -->
      <div class="mycolor1 q-pa-sm info td">
        <table class="q-pa-xs">
          <tr
            v-for="(information, index) in [
              {
                title: t('buy.bankInformation.amount'),
                content: thousandTool(order?.D2, 'CNY'),
              },
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
            <CopyButton :value="information.content" />
          </tr>
        </table>
      </div>

      <div class="text-h6 text-weight-bold q-mx-sm text-blue-13">
        {{ t('transaction.payer') }}
      </div>
      <div class="mycolor1 q-pa-sm info td">
        <table class="q-pa-xs">
          <tr
            v-for="(information, index) in [
              {
                title: t('sell.payer_account_name'),
                content: order?.P5?.split('|')?.[0],
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

      <div class="q-gutter-y-md">
        <!--已完成付款btn  -->
        <q-btn
          class="full-width"
          rounded
          unelevated
          color="blue-13"
          :label="
            order?.Order_StatusID === OrderStatusNum.Appeal
              ? t('transaction.appeal')
              : t('transaction.payment_completed')
          "
          :disable="order?.Order_StatusID === OrderStatusNum.Appeal"
          @click="() => (visible.payWarn = true)"
        />
        <!-- 取消訂單 -->
        <q-btn
          flat
          class="full-width"
          color="blue-13"
          v-close-popup
          :label="t('transaction.deal_canceled')"
          @click="() => (visible.cancelWarn = true)"
        />
      </div>
    </div>
  </q-card>
  <!-- PayMent Confirm -->
  <q-dialog
    trnasition-show="fade"
    trnasition-hide="fade"
    v-model="visible.payWarn"
  >
    <BuyConfirm
      :order="order"
      @upload="
        () => {
          filePicker?.pickFiles();
        }
      "
      @skip="handleConfirm"
    />
  </q-dialog>
  <!-- Cancel confirm -->
  <q-dialog
    trnasition-show="fade"
    trnasition-hide="fade"
    v-model="visible.cancelWarn"
  >
    <CancelConfirm :token="(route.query.token  as string)" />
  </q-dialog>

  <q-file
    @update:model-value="handleUpload"
    accept="image/*"
    v-show="false"
    :multiple="false"
    :model-value="file"
    ref="filePicker"
  />
</template>

<style scoped></style>
