<template>
  <div class="width480">
    <q-card class="q-pa-sm q-ma-sm q-mb-xl myshadow">
      <TransferTitle />
      <!-- Content -->
      <q-form
        @reset="
          () => {
            address.verify = false;
            agreement = undefined;
            address.value = '';
            transAmt = '';
            isPassTwenty = false;
          }
        "
        ref="form"
        @submit="handleSubmit"
      >
        <div class="q-pa-md">
          <!--  -->
          <div class="q-mt-sm">
            <div class="flex justify-between">
              <!-- 請選擇協議種類 -->
              <div class="q-my-sm text-subtitle1">
                {{ $t('transfer.label.agreement') }}
              </div>
            </div>
            <q-select
              :label="$t('transfer.label.agreement')"
              outlined
              :options="addressOptions"
              hide-bottom-space
              v-model="agreement"
              :rules="[
                () =>
                  !!agreement ||
                  visible.readyLeave ||
                  $t('transfer.label.agreement'),
              ]"
            >
              <template #selected-item>
                <q-chip color="primary" class="glossy" style="color: white">
                  {{
                    addressOptions.find((option) => option.value === agreement)
                      ?.label
                  }}</q-chip
                >
              </template>
              <template #option="props">
                <q-item
                  clickable
                  v-ripple
                  @click="
                    () => {
                      agreement = props.opt.value;
                      address.value = '';
                      address.verify = false;
                    }
                  "
                  v-close-popup
                >
                  <q-item-section>
                    <q-item-label class="q-px-md">
                      {{ props.opt.label }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!--  -->
          <div class="q-mt-lg">
            <div class="flex items-baseline justify-between">
              <!-- 轉出至 -->
              <div class="q-my-sm text-subtitle1">
                {{ $t('transfer.label.to') }}
              </div>
              <div>
                <!-- 地址簿 -->
                <!-- <q-btn :label="$t('transfer.label.nav')" flat color="blue-13" /> -->
                <q-btn
                  rounded
                  dense
                  flat
                  color="blue-13"
                  v-if="address.verify"
                  @click="() => (address.verify = false)"
                  icon="edit"
                />
              </div>
            </div>
            <!-- 錢包地址 -->
            <q-input
              hide-hint
              hide-bottom-space
              outlined
              :label="$t('transfer.label.address')"
              v-model="address.value"
              :rules="[
                (val) =>
                  !!val ||
                  visible.readyLeave ||
                  (address.error
                    ? $t('error.api.30')
                    : $t('error.input.empty')),
              ]"
              @update:model-value="() => (address.error = false)"
            >
              <template v-slot:append>
                <q-btn
                  @click="
                    () => {
                      visible.scanner = true;
                    }
                  "
                  dense
                  flat
                  icon="qr_code_scanner"
                  color="blue-13"
                >
                </q-btn>
              </template>
            </q-input>
          </div>

          <!-- 地址備註 -->
          <div class="q-mt-lg" v-if="useStorage().getStorageSync('isAgent')">
            <div class="q-my-sm text-subtitle1">
              {{ $t('transfer.label.remark') }}
            </div>
            <!-- 備註內容(非必填) -->
            <q-input
              @update:model-value="() => (address.error = true)"
              outlined
              :label="$t('transfer.label.remark_text')"
              v-model="remark"
            />
          </div>

          <!-- 請輸入轉出數量 -->
          <div class="q-mt-lg">
            <div class="flex items-center justify-between q-my-sm">
              <div class="text-subtitle1">
                {{ $t('transfer.label.enter_transferAmt') }}
              </div>
              <!-- 餘額 -->
              <div class="flex items-center">
                <div class="text-grey-6 text-subtitle2">
                  {{ $t('transfer.錢包餘額') }}
                </div>
                <div class="text-green-9 q-ml-xs text-subtitle2">
                  {{ formatBalances.available }}
                </div>
              </div>
            </div>

            <q-btn-group spread class="no-shadow">
              <q-btn
                outline
                size="sm"
                color="blue-13"
                class="col-3"
                :label="percent + '%'"
                v-for="(percent, index) in [25, 50, 75, 100]"
                :key="index"
                @click="
                  () => {
                    const result = methods.handleGetPercentage({
                      originValue: balanceRequest.data?.Avb_Balance ?? null,
                      percentage: percent,
                      digitType: 'USDT',
                    });
                    transAmt = result ?? '0';
                  }
                "
              />
            </q-btn-group>
            <!-- 我要轉出 -->
            <q-input
              outlined
              :label="$t('transfer.label.i_want_to_transfer')"
              :model-value="transAmt"
              @focus="() => transAmt === '0' && (transAmt = '')"
              :rules="[
                (val) => !!val || visible.readyLeave || $t('error.input.empty'),
                (val) =>
                  numberTool(val) <= availableBalance ||
                  balanceRequest.loading ||
                  $t('error.api.32'),
              ]"
              @update:model-value="
                (value) => {
                  transAmt = thousandInput(value);
                }
              "
              @blur="handleTransInputBlur"
            >
              <template v-slot:append>
                <div class="text-grey-5 text-subtitle2">USDT</div>
              </template>
            </q-input>

            <!-- 剩餘 -->
            <div v-if="transAmt">
              <div class="flex justify-end">
                <div class="text-grey-6 text-subtitle2">
                  {{ $t('transfer.label.remaining') }}
                </div>
                <div class="q-ml-xs text-subtitle2">{{ remain }} USDT</div>
              </div>
            </div>
          </div>

          <!-- 聲明 -->
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
                color="blue-13"
                :label="$t('isTwenty.disclaimer')"
                size="sm"
                dense
              />
              <!-- 使用條款 -->
              <q-btn
                flat
                color="blue-13"
                :label="$t('isTwenty.terms')"
                size="sm"
                dense
              />
              <!-- 隱私權條款 -->
              <q-btn
                flat
                color="blue-13"
                :label="$t('isTwenty.privacy')"
                size="sm"
                dense
              />
            </div>
          </div>
          <!-- 下一步btn -->
          <q-btn
            :disable="!isPassTwenty"
            rounded
            unelevated
            class="full-width"
            color="blue-13"
            :label="$t('btn.next_step')"
            type="submit"
            :loading="checkingErc || checkingTrc"
          />
        </div>
      </q-form>
    </q-card>
  </div>

  <q-dialog
    @update:model-value="(val) => (address.verify = val)"
    :model-value="address.verify && duration === 0"
    persistent
  >
    <TransWarn
      @success="handleSuccess"
      :agreement="agreement"
      :address="address.value"
      :remark="remark"
      :transAmt="transAmt"
      :premium="premium"
    />
  </q-dialog>

  <!-- 跳轉前提示 -->
  <q-dialog :model-value="visible.readyLeave" persistent>
    <q-card class="q-pa-lg" align="center" style="width: 360px">
      <q-icon name="check_circle" color="green-8" size="lg" />
      <!-- 提交成功 -->
      <div class="text-h6 text-weight-bold">{{ $t('account.success') }}</div>
      <div class="flex justify-center q-gutter-x-sm q-mt-lg text-grey-5">
        <!-- 等待跳轉 -->
        <div>{{ $t('main.jump') }}</div>
        <q-spinner-dots size="1.5em" />
        <div>{{ 5 - duration }}</div>
      </div>
    </q-card>
  </q-dialog>

  <QrReader v-model="visible.scanner" @on-scan="handleSetAddress" />
</template>

<script setup lang="ts">
import { addressOptions } from './data';
import { useStateStore } from 'src/stores';
import { numberTool, thousandInput, thousandTool } from 'src/utils/NumberTool';
import { computed, onMounted, reactive, ref } from 'vue';
import { useStorage } from 'vue3-storage';
import TransferTitle from './components/TransferTitle.vue';
import QrReader from 'src/components/QrReader.vue';
import api from './api';
import TransWarn from './components/TransWarn.vue';
import { useRouter } from 'vue-router';
import methods from 'src/utils/methods';

const router = useRouter();
// DOM
const form = ref();
const agreement = ref();
const address = reactive({
  value: '',
  verify: false,
  error: false,
});
const remark = ref('');
const transAmt = ref('');
const isPassTwenty = ref(false);
const timeInterval = ref<NodeJS.Timeout>();
const duration = ref(0);
const visible = reactive({
  scanner: false,
  readyLeave: false,
});

// query
const { ratesRequest, balanceRequest, formatBalances } = useStateStore();
const availableBalance = computed(() => {
  if (balanceRequest.data === undefined) return 0;
  return numberTool(balanceRequest.data.Avb_Balance);
});
const remain = computed(() => {
  const remainValue = availableBalance.value - numberTool(transAmt.value);
  return thousandTool(remainValue, 'USDT');
});
const premium = computed(() => {
  const rates = ratesRequest.data;
  switch (agreement.value) {
    case 'trc':
      return thousandTool(rates?.TransferHandle2, 'USDT');
    case 'erc':
      return thousandTool(rates?.TransferHandle, 'USDT');
    default:
      return undefined;
  }
});

// request
const { run: checkErc, loading: checkingErc } = api.useCheckErc({
  onSuccess: () => {
    address.verify = true;
  },
  onError: () => {
    address.verify = false;
    address.error = true;
    address.value = '';
  },
});
const { run: checkTrc, loading: checkingTrc } = api.useCheckTrc({
  noCheck: true,
  onSuccess: () => {
    address.verify = true;
  },
  onError: () => {
    address.verify = false;
    address.error = true;
    address.value = '';
  },
});

// handlers
const handleSetAddress = (newAddress?: string) => {
  visible.scanner = false;
  if (newAddress) {
    address.value = newAddress;
  }
};
const handleSubmit = () => {
  switch (agreement.value) {
    case 'trc': {
      checkTrc({
        ToAddress: address.value,
      });
      break;
    }
    case 'erc': {
      checkErc({
        ToAddress: address.value,
      });
      break;
    }
    default:
      return undefined;
  }
};
const handleSuccess = () => {
  timeInterval.value = setInterval(() => {
    duration.value += 1;
    if (duration.value > 4 && timeInterval.value) {
      clearInterval(timeInterval.value as NodeJS.Timeout);
      router.push({ name: 'dashboard' });
    }
  }, 1000);

  visible.readyLeave = true;
  agreement.value = undefined;
  address.value = '';
  address.error = false;
  address.verify = false;
  transAmt.value = '';
  isPassTwenty.value = false;
};

const handleTransInputBlur = () => {
  if (!/^[0-9,.]+$/.test(transAmt.value)) transAmt.value = '0';
  if (numberTool(transAmt.value) > availableBalance.value)
    setTimeout(() => {
      transAmt.value = thousandInput(availableBalance.value);
    }, 200);
};

// life cycle
onMounted(() => {
  const isTest = true;
  if (import.meta.env.DEV && isTest) {
    agreement.value = 'trc';
    address.value = useStorage().getStorageSync('isAgent')
      ? 'TEZPF9NrUh9xQXqkNSyo7ngqoyfu8AmjQi'
      : 'TYQY8Pw3D2U85CntfNp32Sgk91d4RHRb2f';
    transAmt.value = '100';
    isPassTwenty.value = true;
  }
});
</script>

<style scoped></style>
