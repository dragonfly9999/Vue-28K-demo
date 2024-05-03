<template>
  <q-card class="q-pa-md width600">
    <!-- Title -->
    <div class="row items-center">
      <div class="col-4">
        <q-btn
          flat
          color="primary"
          @click="$router.back()"
          :label="$t('main.返回')"
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
      <!--請輸入購買數量  -->
      <div class="q-my-xs text-subtitle1">
        {{ $t('transaction.請輸入購買數量') }}
      </div>
      <!-- 我要購買input -->
      <q-input
        :loading="ratesRequest.loading"
        :disable="ratesRequest.loading"
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
              numberTool(val) * numberTool(ratesRequest.data?.RMB_BUY),
              'CNY'
            );
          }
        "
        :rules="[(val) => numberTool(val) > 0 || $t('transaction.請輸入金額')]"
        autofocus
        @blur="
          () => {
            if (!/^[0-9,.]+$/.test(form.UsdtAmt)) form.UsdtAmt = '0';
          }
        "
      >
        <template #append>
          <div class="text-grey-5 text-subtitle2">USDT</div>
        </template>

        <template #hint> </template>
      </q-input>

      <div class="row full-width q-pb-sm">
        <div class="col-4"></div>
        <div class="col flex justify-center">
          <img :src="repeat2" width="25" height="25" />
        </div>
        <div class="col-4 text-right text-caption text-grey-7">
          1 USDT
          <span class="text-primary"
            >≈ {{ formatRates.buy }} {{ currency }}
          </span>
        </div>
      </div>

      <!-- 我將支付input -->
      <q-input
        :label="$t('transaction.我將支付')"
        :loading="ratesRequest.loading"
        :disable="ratesRequest.loading"
        outlined
        :model-value="price"
        @update:model-value="
          (val) => {
            price = thousandInput(val);
            form.UsdtAmt = thousandTool(
              numberTool(val) / numberTool(ratesRequest.data?.RMB_BUY),
              'USDT'
            );
          }
        "
        @focus="
          () => {
            if (numberTool(price) < 1) price = '0';
          }
        "
        :rules="[(val) => numberTool(val) > 0 || $t('transaction.請輸入金額')]"
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
      <div class="q-my-sm text-subtitle1">
        {{ $t('transaction.輸入銀行卡持有人姓名') }}
      </div>
      <q-input
        :rules="[(val) => !!val || $t('transaction.輸入銀行卡持有人姓名')]"
        :label="$t('transaction.姓名')"
        outlined
        v-model="form.ClientName"
      />
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
      <div class="text-center text-caption text-grey-6 q-mt-xs">
        {{ $t('transaction.交易匯率依據訂單成立為主') }}
      </div>

      <!-- 我已滿20歲已閱讀並同意... -->
      <div class="flex no-wrap items-center q-pb-xs">
        <q-checkbox v-model="isPassTwenty" dense />
        <div class="text-body q-ml-sm">
          {{ $t('isTwenty.agree') }}
        </div>
        <q-btn flat color="primary" dense :label="$t('isTwenty.disclaimer')" />
        <q-btn flat color="primary" :label="$t('isTwenty.terms')" dense />
        <q-btn flat color="primary" :label="$t('isTwenty.privacy')" dense />
      </div>

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

  <!--  -->
  <CreateWarn
    :loading="loading"
    @confirm="handleConfirm"
    v-model:visible="pairWarn"
  />
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
import api from '../api';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter();

// DOM state
const pairWarn = ref(false);
const form = reactive({
  UsdtAmt: '0',
  ClientName: '',
});
const price = ref('0');
const isPassTwenty = ref(false);
// mutation
const { ratesRequest, formatRates, onRatesSuccess, currency } = useStateStore();
const { pendingInstant } = usePendingStore();
const { setOrderWs } = useOrderStore();
const { setWebSockets } = useThirdStore();
const { run: create, loading } = api.useBuy1({
  isTest: false, // 測試時自定義送出的金額
  onSuccess: (res) => {
    pairWarn.value = false;
    const token = res?.data.order_token;
    pendingInstant.refresh();
    ratesRequest.refresh();
    if (token) {
      setOrderWs(token);
      setWebSockets(token);
      router.push({
        name: 'trade',
        query: { type: 'buy', token, action: 'trading' },
      });
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
  const isTest = true;
  if (import.meta.env.DEV && isTest) {
    onRatesSuccess.buyTest = (rate) => {
      if (price.value === '0' && form.UsdtAmt !== '0' && rate) {
        price.value = thousandInput(
          numberTool(form.UsdtAmt) * numberTool(rate.RMB_BUY)
        );
      }
    };
    // set state
    form.ClientName = 'test Buy' + dayjs().format('MM.DD HH:ss');
    form.UsdtAmt = '100';
    isPassTwenty.value = true;
    const rates = ratesRequest.tempData;
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

// assets
const flag = new URL(
  `/src/assets/${useStateStore().currency}.png`,
  import.meta.url
).href;
</script>

<style scoped></style>
