<template>
  <q-card class="q-pa-md">
    <!-- Title -->
    <div class="row items-center">
      <div class="col-4">
        <q-btn
          flat
          color="primary"
          @click="$router.back()"
          :label="$t('返回')"
        />
      </div>
      <div class="col flex justify-center text-h6 text-weight-bold">
        {{ $t('transaction.購買USDT') }}
      </div>
      <div class="col-4"></div>
    </div>

    <!-- 步驟 -->
    <StepperMaster />
    <q-form @submit="() => (pairWarn = true)">
      <div>
        <!--請輸入購買數量  -->
        <div class="q-my-sm text-subtitle1">
          {{ $t('transaction.請輸入購買數量') }}
        </div>
        <!-- 我要購買input -->
        <q-input
          :loading="getRatesLoad()"
          :disable="getRatesLoad()"
          :label="$t('transaction.我要購買')"
          outlined
          :model-value="form.UsdtAmt"
          @focus="
            () => {
              if (numberTool(form.UsdtAmt) < 1) form.UsdtAmt = '0';
            }
          "
          @update:model-value="
            (val) => {
              form.UsdtAmt = thousandInput(val);
              price = thousandTool(
                numberTool(val) * numberTool(getRates()?.RMB_BUY),
                'CNY'
              );
            }
          "
          :rules="[(val) => numberTool(val) >= 100 || $t('error.usdt')]"
          autofocus
          @blur="
            () => {
              if (!/^[0-9,.]+$/.test(form.UsdtAmt)) form.UsdtAmt = '0';
            }
          "
        >
          <template v-slot:append>
            <div class="text-grey-5 text-subtitle2">USDT</div>
          </template>
        </q-input>
        <div class="text-right text-caption q-pr-sm text-grey-7">
          1 USDT
          <span class="text-primary"
            >≈ {{ getRates()?.RMB_BUY }} {{ currency }}
          </span>
        </div>
      </div>

      <div class="flex justify-center">
        <img :src="repeat2" />
      </div>

      <!-- 我將支付input -->
      <div class="q-mt-md">
        <q-input
          :label="$t('transaction.我將支付')"
          :loading="getRatesLoad()"
          :disable="getRatesLoad()"
          outlined
          :model-value="price"
          @update:model-value="
            (val) => {
              price = thousandInput(val);
              form.UsdtAmt = thousandTool(
                numberTool(val) / numberTool(getRates()?.RMB_BUY),
                'USDT'
              );
            }
          "
          @focus="
            () => {
              if (numberTool(price) < 1) price = '0';
            }
          "
          :rules="[
            (val) => numberTool(val) > 0 || $t('transaction.請輸入金額'),
          ]"
          @blur="
            () => {
              if (!/^[0-9,.]+$/.test(price)) price = '0';
            }
          "
        >
          <template v-slot:append>
            <q-img width="20px" :src="flag" />
            <div class="text-grey-5 text-subtitle2">{{ currency }}</div>
          </template>
        </q-input>
      </div>

      <div class="q-mt-lg">
        <div class="q-my-sm text-subtitle1">
          {{ $t('transaction.輸入銀行卡持有人姓名') }}
        </div>
        <q-input
          :rules="[(val) => !!val || $t('transaction.輸入銀行卡持有人姓名')]"
          :label="$t('transaction.姓名')"
          outlined
          v-model="form.ClientName"
        />
      </div>
      <!-- 訂單資訊 -->
      <div class="q-mt-lg">
        <div class="flex justify-between">
          <div class="text-subtitle1">
            {{ $t('transaction.訂單資訊') }}
          </div>
          <div class="flex items-center">
            <div class="text-caption text-grey-7">
              {{ $t('transaction.付款時間') }}
            </div>
          </div>
        </div>
        <!-- 數量 -->
        <div class="mycolor1 q-pa-md">
          <div>
            <div class="flex justify-between">
              <div class="text-weight-bold">
                {{ $t('transaction.交易數量') }}
              </div>
              <div class="text-weight-bold text-body1">
                {{ form.UsdtAmt }} USDT
              </div>
            </div>
            <div class="flex justify-between">
              <!-- 總金額 -->
              <div class="text-right text-primary text-weight-bold">
                {{ $t('transaction.總金額') }}
              </div>
              <div class="text-primary text-weight-bold text-right text-body1">
                {{ thousandTool(price, 'CNY') + ' ' + currency }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 交易匯率依據訂單成立為主 -->
      <div class="text-center text-caption text-grey-6 q-mt-xs q-mb-lg">
        {{ $t('transaction.交易匯率依據訂單成立為主') }}
      </div>

      <!--  -->
      <div class="flex no-wrap items-start q-my-md">
        <q-checkbox v-model="isPassTwenty" dense />
        <!-- 我已滿20歲已閱讀並同意 -->
        <div class="flex">
          <div class="text-body2 q-ml-sm">
            {{ $t('isTwenty.agree') }}
          </div>
          <!-- 免責聲明 -->
          <q-btn
            flat
            color="primary"
            :label="$t('isTwenty.disclaimer')"
            size="sm"
            dense
          />
          <!-- 使用條款 -->
          <q-btn
            flat
            color="primary"
            :label="$t('isTwenty.terms')"
            size="sm"
            dense
          />
          <!-- 隱私權條款 -->
          <q-btn
            flat
            color="primary"
            :label="$t('isTwenty.privacy')"
            size="sm"
            dense
          />
        </div>
      </div>
      <!-- 開始配對btn -->
      <q-btn
        :disable="!isPassTwenty"
        unelevated
        rounded
        class="full-width"
        color="blue-13"
        :label="$t('transaction.開始配對')"
        type="submit"
      />
    </q-form>
  </q-card>
  <q-dialog
    persistent
    trnasition-show="fade"
    trnasition-hide="fade"
    v-model="pairWarn"
  >
    <CreateWarn :loading="loading" @confirm="handleConfirm" />
  </q-dialog>
</template>

<script setup lang="ts">
import StepperMaster from 'src/components/StepperMaster.vue';
import {
  useOrderStore,
  usePendingStore,
  useStateStore,
  useThirdStore,
} from 'src/stores';
import { numberTool, thousandInput, thousandTool } from 'src/utils/NumberTool';
import { onMounted, reactive, ref } from 'vue';
import repeat2 from 'src/assets/icon _repeat2_.png';
import CreateWarn from './CreateWarn.vue';
import { useBuy1 } from '../api/useBuy1';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter();
const pairWarn = ref(false);
const { pendingInstant } = usePendingStore();
const { setOrderWs } = useOrderStore();
const { setWebSockets } = useThirdStore();

const { getRates, getRatesLoad, currency, onRatesSuccess } = useStateStore();
const flag = new URL(`../../../../assets/${currency}.png`, import.meta.url)
  .href;
// DOM state
const form = reactive({
  UsdtAmt: '0',
  ClientName: '',
});
const price = ref('0');
const isPassTwenty = ref(false);
// mutation
const { run: create, loading } = useBuy1({
  isTest: false, // 測試時自定義送出的金額
  onSuccess: (res) => {
    pairWarn.value = false;
    const token = res?.data.order_token;
    pendingInstant.refresh();
    useStateStore().refreshBalance();
    if (token) {
      setOrderWs(token);
      setWebSockets(token);
      router.push({ name: 'buy', query: { token } });
    }
  },
});
// handler
const handleConfirm = () => {
  const UsdtAmt = numberTool(form.UsdtAmt);
  create({
    ClientName: form.ClientName,
    UsdtAmt,
  });
};

// life cycle
onMounted(() => {
  if (import.meta.env.DEV) {
    // call back
    onRatesSuccess.buyTest = (rate) => {
      if (price.value === '0' && form.UsdtAmt !== '0' && rate) {
        price.value = thousandInput(
          numberTool(form.UsdtAmt) * numberTool(rate.RMB_BUY)
        );
      }
    };
    // set
    form.ClientName = 'test Buy' + dayjs().format('MM.DD HH:ss');
    form.UsdtAmt = '100';
    isPassTwenty.value = true;
    const rates = getRates();
    if (rates) {
      price.value = thousandInput(
        numberTool(form.UsdtAmt) * numberTool(rates.RMB_BUY)
      );
    }
    // scroll
    setTimeout(() => {
      const domElement = document.documentElement;
      const scrollPath = domElement.scrollHeight - domElement.clientHeight;
      domElement.scrollTo({ top: scrollPath, behavior: 'smooth' });
    }, 100);
  }
});
</script>

<style scoped></style>
