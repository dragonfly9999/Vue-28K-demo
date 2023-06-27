<script setup lang="ts">
import StepperMaster from 'src/components/StepperMaster.vue';
import { usePendingStore, useStateStore } from 'src/stores';
import { numberTool, thousandInput, thousandTool } from 'src/utils/NumberTool';
import { reactive, ref } from 'vue';
import 'vue-i18n';
import CreateWarn from '../../buy/components/CreateWarn.vue';
import { useSell1 } from '../api';
import { useRouter } from 'vue-router';

const { getBalance, getRates, currency, getBalanceLoad, getRatesLoad } =
  useStateStore();
const isTest = import.meta.env.DEV;
const router = useRouter();
const { pendingInstant } = usePendingStore();
const { run: create, loading } = useSell1({
  onSuccess: (res) => {
    createWarn.value = false;
    const token = res?.data.order_token;
    pendingInstant.refresh();
    useStateStore().refreshBalance();
    if (token) {
      router.push({ name: 'sell', query: { token } });
    }
  },
});
// DOM
const form = reactive({
  AccountName: isTest ? '曹美麗' : '',
  AccountNumber: isTest ? '123456789' : '',
  BankBranch: isTest ? '' : '',
  BankName: isTest ? '822' : '',
  UsdtAmt: isTest ? '100' : '0',
});
const price = ref();
const isPassTwenty = ref(false);
const createWarn = ref(false);
const flag = new URL(`../../../../assets/${currency}.png`, import.meta.url)
  .href;
</script>
<template>
  <div style="max-width: 600px; margin: auto; padding: 0 0.1rem">
    <div>
      <div class="row q-px-sm q-mt-md items-baseline">
        <div class="col-4">
          <!-- 返回btn -->
          <q-btn
            flat
            color="primary"
            :label="$t('label.back')"
            @click="$router.back()"
          />
        </div>
        <!-- title出售USDT -->
        <div class="col flex justify-center text-h6 text-weight-bold">
          {{ $t('label.sell') }} USDT
        </div>
        <div class="col-4">
          <!-- <div
            class="text-caption text-right text-blue-grey-4"
            style="margin-top: 1rem"
          >
            更新時間:2022/12/09 00:00:00
          </div> -->
        </div>
      </div>

      <q-form @submit="() => (createWarn = true)">
        <!-- 步驟 -->
        <StepperMaster />

        <div class="q-pa-md">
          <div>
            <!-- 請輸入出售數量 -->
            <div class="flex items-center q-my-sm justify-between">
              <div class="text-subtitle1">
                {{ $t('請輸入出售數量') }}
              </div>

              <!-- 餘額 -->
              <div class="flex items-center">
                <div class="text-grey-6 text-subtitle2">
                  {{ $t('餘額') }}
                </div>
                <div class="text-green-9 text-subtitle2">
                  {{ thousandTool(getBalance()?.Avb_Balance, 'CNY') }}
                </div>
              </div>
            </div>

            <q-btn-group spread class="no-shadow">
              <q-btn
                :disable="getBalanceLoad()"
                outline
                size="sm"
                color="primary"
                class="col-3"
                :label="percent + '%'"
                v-for="(percent, index) in [25, 50, 75, 100]"
                :key="index"
                @click="
                  () => {
                    const usdt = thousandTool(
                      numberTool(getBalance()?.Avb_Balance) * (percent / 100),
                      'USDT'
                    );
                    form.UsdtAmt = usdt;
                    price = thousandTool(
                      numberTool(usdt) * numberTool(getRates()?.RMB_SELL),
                      'CNY'
                    );
                  }
                "
              />
            </q-btn-group>

            <q-input
              outlined
              :label="$t('我要出售')"
              :model-value="form.UsdtAmt"
              @focus="
                () => {
                  if (numberTool(form.UsdtAmt) < 1) form.UsdtAmt = '0';
                }
              "
              @blur="
                () => {
                  if (!/^[0-9,.]+$/.test(form.UsdtAmt)) form.UsdtAmt = '0';
                }
              "
              @update:model-value="
                (val) => {
                  form.UsdtAmt = thousandInput(val);
                  price = thousandTool(
                    numberTool(val) * numberTool(getRates()?.RMB_SELL),
                    'CNY'
                  );
                }
              "
              :rules="[(val) => numberTool(val) >= 100 || $t('error.usdt')]"
            >
              <template v-slot:append>
                <div class="text-grey-5 text-subtitle2">USDT</div>
              </template>
            </q-input>

            <div class="text-right text-caption q-pr-sm text-grey-7">
              1 USDT
              <span class="text-primary"
                >≈ {{ getRates()?.RMB_SELL + ' ' + currency }}</span
              >
            </div>
          </div>

          <!-- icon -->
          <div class="flex justify-center">
            <q-icon class="material-icons text-primary text-h5 rotate-90">
              repeat
            </q-icon>
          </div>

          <!-- 收到的法幣數量 -->
          <div class="q-mt-md">
            <q-input
              :disable="getRatesLoad()"
              outlined
              :label="$t('我將收到')"
              :model-value="price"
              @update:model-value="
                (val) => {
                  price = thousandInput(val);
                  form.UsdtAmt = thousandTool(
                    numberTool(val) / numberTool(getRates()?.RMB_SELL),
                    'CNY'
                  );
                }
              "
              @focus="
                () => {
                  if (numberTool(price) < 1) price = '0';
                }
              "
              @blur="
                () => {
                  if (!/^[0-9,.]+$/.test(price)) price = '0';
                }
              "
              :rules="[(val) => numberTool(val) > 0 || $t('請輸入有效金額')]"
            >
              <template v-slot:append>
                <q-img width="20px" :src="flag" />
                <div class="text-grey-5 text-subtitle2">{{ currency }}</div>
              </template>
            </q-input>
          </div>

          <div class="q-gutter-sm q-mt-sm">
            <div class="q-my-sm text-subtitle1">
              {{ $t('銀行卡資訊') }}
            </div>
            <q-input
              v-model="form.AccountName"
              outlined
              :label="$t('收款姓名')"
              :rules="[(val) => !!val || $t('請輸入收款姓名')]"
            />
            <q-input
              v-model="form.AccountNumber"
              outlined
              :label="$t('收款帳號')"
              :rules="[(val) => !!val || $t('請輸入收款帳號')]"
            />
            <q-input
              v-model="form.BankName"
              outlined
              :label="$t('開戶銀行')"
              :rules="[(val) => !!val || $t('請輸入開戶銀行')]"
            />
            <q-input
              v-model="form.BankBranch"
              outlined
              :label="$t('所在省市')"
            />
          </div>

          <div class="q-mt-lg">
            <div class="flex justify-between">
              <div class="text-subtitle1">
                {{ $t('訂單資訊') }}
              </div>
              <div class="flex items-center">
                <q-icon class="material-icons text-grey-7">schedule</q-icon>
                <!-- 付款時間 30分鐘 -->
                <div class="text-caption text-grey-7">
                  {{ $t('付款時間 30分鐘') }}
                </div>
              </div>
            </div>
            <div class="mycolor1 q-pa-md">
              <div class="flex justify-between text-grey-7 text-caption">
                <div>{{ $t('出售數量') }}</div>
                <div>{{ form.UsdtAmt }} USDT</div>
              </div>
              <div class="flex justify-between text-grey-7 text-caption">
                <div>{{ $t('交易服務費') }}(0%)</div>
                <div>{{ 0 }} USDT</div>
              </div>
              <q-separator spaced />

              <!-- 交易數量 -->
              <div class="flex justify-between">
                <div class="text-weight-bold">
                  {{ $t('交易數量') }}
                </div>
                <div class="text-weight-bold text-body1">
                  {{ thousandInput(form.UsdtAmt) }} USDT
                </div>
              </div>
              <!-- 總金額 -->
              <div class="flex justify-between">
                <div class="text-right text-primary text-weight-bold">
                  {{ $t('總金額') }}
                </div>
                <div
                  class="text-primary text-weight-bold text-right text-body1"
                >
                  {{ thousandInput(price) + ' ' + currency }}
                </div>
              </div>
            </div>
          </div>
          <!-- 交易匯率依據訂單成立為主 -->
          <div class="text-center text-caption text-grey-6 q-mt-xs q-mb-lg">
            {{ $t('交易匯率依據訂單成立為主') }}
          </div>

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
            type="submit"
            class="full-width"
            color="blue-13"
            :label="$t('開始配對')"
          />
        </div>
      </q-form>
    </div>
    <!-- dialog -->
    <!-- 警告 -->
    <q-dialog
      persistent
      trnasition-show="fade"
      trnasition-hide="fade"
      v-model="createWarn"
    >
      <CreateWarn
        :loading="loading"
        @confirm="
          () => {
            const UsdtAmt = numberTool(form.UsdtAmt);
            create({
              ...form,
              UsdtAmt,
            });
          }
        "
      />
    </q-dialog>
  </div>
</template>

<style scoped></style>
