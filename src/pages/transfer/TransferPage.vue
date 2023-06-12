<script setup lang="ts">
import { addressOptions } from './data';
import { useBalanceStore, useRateStore } from 'src/stores';
import { numberTool, thousandTool } from 'src/utils/NumberTool';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TransferTitle from './components/TransferTitle.vue';
import QrReader from 'src/components/QrReader.vue';
import { useCheckErc, useCheckTrc } from './api';
import TransWarn from './components/TransWarn.vue';

const { t } = useI18n();
const { getBalance } = useBalanceStore();
const { getRate } = useRateStore();
const { run: checkErc } = useCheckErc({
  onSuccess: () => {
    address.verify = true;
  },
  onError: () => {
    address.verify = false;
  }
});
const { run: checkTrc } = useCheckTrc({
  onSuccess: () => {
    address.verify = true;
  },
  onError: () => {
    address.verify = false;
  }
});
// DOM
const agreement = ref();
const address = reactive<{ value: string; verify: boolean }>({
  value: '',
  verify: false
});
const remark = ref();
const transAmt = ref();
const isPassTwenty = ref(false);
const visible = reactive({
  warn: false,
  verify: false,
  scanner: false
});
//
const isPass = computed(() => isPassTwenty.value && address.verify);
const remain = computed(() => {
  const result = (getBalance()?.Avb_Balance ?? 0) - transAmt.value;
  return thousandTool(result, 3);
});
const premium = computed(() => {
  switch (agreement.value) {
    case 'trc':
      return thousandTool(getRate()?.TransferHandle2, 3);
    case 'erc':
      return thousandTool(getRate()?.TransferHandle, 3);
    default:
      return undefined;
  }
});

const handleSetAddress = (newAddress?: string) => {
  visible.scanner = false;
  if (newAddress) {
    address.value = newAddress;
    switch (agreement.value) {
      case 'trc': {
        checkTrc({
          ToAddress: address.value
        });
        break;
      }
      case 'erc': {
        checkErc({
          ToAddress: address.value
        });
        break;
      }
      default:
        return undefined;
    }
  }
};
</script>
<template>
  <div style="max-width: 600px; margin: auto; padding: 0 0.1rem">
    <TransferTitle />
    <!-- Content -->
    <q-card class="q-pa-sm q-ma-sm q-mb-xl myshadow">
      <q-form @submit="() => (visible.warn = true)">
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
              :rules="[() => !!agreement || $t('transfer.label.agreement')]"
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
              hide-bottom-space
              outlined
              :disable="address.verify"
              :label="t('transfer.label.address')"
              v-model="address.value"
              :rules="[() => !!agreement || $t('transfer.label.agreement')]"
            >
              <template v-slot:append>
                <q-btn
                  @click="
                    () => {
                      visible.scanner = true;
                    }
                  "
                  :disable="!agreement"
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
          <div class="q-mt-lg">
            <div class="q-my-sm text-subtitle1">
              {{ $t('transfer.label.remark') }}
            </div>
            <!-- 備註內容(非必填) -->
            <q-input
              outlined
              :label="t('transfer.label.remark_text')"
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
                  {{ $t('transfer.label.balance') }}
                </div>
                <div class="text-green-9 q-ml-xs text-subtitle2">
                  {{ thousandTool(getBalance()?.Avb_Balance, 3) }}
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
                :disable="!address.verify"
                v-for="(percent, index) in [25, 50, 75, 100]"
                :key="index"
                @click="
                  () => (
                    (transAmt = thousandTool(
                      ((getBalance()?.Avb_Balance ?? 0) * percent) / 100
                    )),
                    3
                  )
                "
              />
            </q-btn-group>
            <!-- 我要轉出 -->
            <q-input
              outlined
              :label="t('transfer.label.i_want_to_transfer')"
              v-model="transAmt"
              :disable="!address.verify"
              :error-message="t('error.32')"
              @focus="() => transAmt === 0 && (transAmt = undefined)"
              :rules="[(val) => numberTool(val) > 1]"
            >
              <template v-slot:append>
                <div class="text-grey-5 text-subtitle2">USDT</div>
              </template>
            </q-input>

            <div v-if="transAmt > 1">
              <div class="flex justify-end">
                <!-- 剩餘 -->
                <div class="text-grey-6 text-subtitle2">
                  {{ $t('transfer.label.remaining') }}
                </div>
                <div class="q-ml-xs text-subtitle2">{{ remain }} USDT</div>
              </div>
            </div>
          </div>

          <!-- 訂單資訊 -->
          <div class="q-mt-lg">
            <div class="text-subtitle1">
              {{ $t('transfer.label.order_info') }}
            </div>
            <div class="mycolor1 q-pa-md">
              <!-- 轉出數量 -->
              <div
                class="flex items-baseline justify-between text-grey-7 text-caption"
              >
                <div>{{ $t('transfer.label.transfer_quantity') }}</div>
                <div>{{ transAmt }} USDT</div>
              </div>
              <!-- 手續費 -->
              <div
                class="flex items-baseline justify-between text-grey-7 text-caption"
              >
                <div>{{ $t('transfer.label.premium') }}</div>
                <div>{{ premium }} USDT</div>
              </div>

              <!-- 會員互轉免手續費 -->

              <!-- <div class="flex items-baseline justify-between text-grey-7 text-caption">
              <div>{{$t('transfer.label.premium')}}</div>
              <div>{{$t('transfer.label.popularize')}}!</div>
            </div> -->

              <q-separator class="q-my-sm" />
              <div class="flex justify-between">
                <!-- 預計到帳 -->
                <div class="text-right text-blue-13 text-weight-bold">
                  {{ $t('transfer.label.expect') }}
                </div>
                <div class="text-blue-13 text-weight-bold text-body1">
                  {{
                    thousandTool(numberTool(transAmt) - numberTool(premium), 3)
                  }}
                  USDT
                </div>
              </div>
            </div>
          </div>
          <!--  -->
          <div class="flex no-wrap items-start q-my-md">
            <q-checkbox
              :disable="!address.verify"
              v-model="isPassTwenty"
              dense
            />
            <!-- 我已滿20歲已閱讀並同意 -->
            <div class="flex">
              <div class="text-body2 q-ml-sm">
                {{ $t('isTwenty.agree') }}
              </div>
              <!-- 免責聲明 -->
              <q-btn
                flat
                color="blue-13"
                :label="t('isTwenty.disclaimer')"
                size="sm"
                dense
              />
              <!-- 使用條款 -->
              <q-btn
                flat
                color="blue-13"
                :label="t('isTwenty.terms')"
                size="sm"
                dense
              />
              <!-- 隱私權條款 -->
              <q-btn
                flat
                color="blue-13"
                :label="t('isTwenty.privacy')"
                size="sm"
                dense
              />
            </div>
          </div>
          <!-- 下一步btn -->
          <q-btn
            rounded
            unelevated
            class="full-width"
            color="blue-13"
            :label="t('btn.next_step')"
            type="submit"
            :disable="!isPass"
          />
        </div>
      </q-form>
    </q-card>
  </div>
  <q-dialog v-model="visible.warn" persistent>
    <TransWarn
      :agreement="agreement"
      :address="address.value"
      :remark="remark"
      :transAmt="transAmt"
      :premium="premium"
    />
  </q-dialog>
  <QrReader v-model="visible.scanner" @on-scan="handleSetAddress" />
</template>

<style scoped></style>
