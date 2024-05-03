<template>
  <q-page class="width480">
    <q-card class="q-pa-sm q-ma-sm q-mt-md q-mb-xl">
      <q-form
        @submit="
          () =>
            set({
              [AccNum.Account]: formData[AccNum.Account],
              [AccNum.Name]: formData[AccNum.Name],
              [AccNum.BankID]: formData[AccNum.BankID],
              [AccNum.Branch]: formData[AccNum.Branch],
              [AccNum.Channel]: formData[AccNum.Channel]?.value ?? null,
            })
        "
      >
        <div class="row q-mb-sm items-center">
          <div class="col-2">
            <q-btn
              flat
              dense
              color="blue-13"
              :label="t('main.back')"
              @click="() => (visible.warn = true)"
            />
          </div>
          <!-- title帳戶驗證 -->
          <div class="col text-center text-h6 text-weight-bold">
            {{ $t('account.title_add_account') }}
            <!-- ()帳戶 -->
            <div class="text-overline text-blue-13">
              {{ $t('account.CNY.account') }}
            </div>
          </div>
          <div class="col-2 flex justify-end"></div>
        </div>
        <q-separator />

        <div class="q-pa-md">
          <div class="q-gutter-y-lg q-mt-xs">
            <!-- 填寫銀行資料 -->
            <div
              class="q-mt-lg bg-blue-grey-1 q-pa-sm"
              style="border-bottom-right-radius: 15px"
            >
              <div>{{ $t('back.bank_info') }}</div>
              <div>
                <!-- hint -->
                {{ $t('warn.bank_hint') }}
              </div>
            </div>

            <div>
              <!-- 銀行戶名 -->
              <div>{{ $t(`account.CNY.${AccNum.Name}`) }}</div>
              <q-input
                outlined
                v-model="formData[AccNum.Name]"
                :rules="[
                  (val) =>
                    (val?.length > 0 && !!val) || t('error.simple_input'),
                ]"
              />
            </div>
            <!-- 銀行帳號 -->
            <div>
              <div>{{ $t(`account.CNY.${AccNum.Account}`) }}</div>
              <q-input
                outlined
                v-model="formData[AccNum.Account]"
                :rules="[
                  (val) =>
                    (val?.length > 0 && !!val) || t('error.simple_input'),
                ]"
              />
            </div>
            <!-- 銀行名稱 -->
            <div>
              <div>{{ $t(`account.CNY.${AccNum.BankID}`) }}</div>
              <q-input
                outlined
                v-model="formData[AccNum.BankID]"
                :rules="[
                  (val) =>
                    (val?.length > 0 && !!val) || t('error.simple_input'),
                ]"
              />
            </div>
            <!-- 所在省市 -->
            <div>
              <div>{{ $t(`account.CNY.${AccNum.Branch}`) }}</div>
              <q-input
                outlined
                v-model="formData[AccNum.Branch]"
                :rules="[
                  (val) =>
                    (val?.length > 0 && !!val) || t('error.simple_input'),
                ]"
              />
            </div>

            <!-- 設定頻道 -->
            <div>
              <div>{{ $t('account.頻道') }}</div>
              <q-select
                v-model="formData.P5"
                :label="$t('account.請設定通道')"
                outlined
                :options="accountStore.allowChannelsOption"
              >
              </q-select>
            </div>

            <!-- buttons -->
            <div class="flex q-gutter-x-md justify-end">
              <!-- 確認btn -->
              <q-btn
                color="blue-13"
                unelevated
                :label="t('main.confirm')"
                type="submit"
              />
            </div>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
  <!-- 跳轉前提示 -->
  <q-dialog :model-value="!!timeIntervale" persistent>
    <q-card class="q-pa-lg" align="center" style="width: 360px">
      <q-icon name="check_circle" color="green-8" size="lg" />
      <!-- 提交成功 -->
      <div class="text-h6 text-weight-bold">{{ $t('account.success') }}</div>
      <div class="flex justify-center q-gutter-x-sm q-mt-lg text-grey-5">
        <!-- 等待跳轉 -->
        <div>{{ $t('main.jump') }}</div>
        <q-spinner-dots size="1.5em" />
        <div>{{ time }}</div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="visible.warn" persistent>
    <CancelVerification @confirm="() => router.push({ name: 'account' })" />
  </q-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AccNum, type AccRes } from './api/useAccHistory';
import { useRouter } from 'vue-router';
import { useSetAcc } from './api';
import CancelVerification from 'src/components/CancelVerification.vue';
import dayjs from 'dayjs';
import { useAccountStore } from 'src/stores';
const timeIntervale = ref<NodeJS.Timeout>();
const { t } = useI18n();
const router = useRouter();
const accountStore = useAccountStore();

// DOM
const time = ref(5);
const formData = reactive<
  Omit<AccRes, 'H_id' | AccNum.Channel> & {
    [AccNum.Channel]: { label: string; value: number } | null;
  }
>({
  [AccNum.Account]: '',
  [AccNum.Name]: '',
  [AccNum.BankID]: '',
  [AccNum.Branch]: '',
  [AccNum.Channel]: null,
});
const visible = reactive({
  warn: false,
  redirect: false,
});

// reuqest
const { run: set } = useSetAcc({
  onSuccess: () => {
    timeIntervale.value = setInterval(
      () => {
        if (time.value > 0) {
          time.value -= 1;
        } else {
          router.push({ name: 'account' });
        }
      },
      import.meta.env.DEV ? 10 : 1000
    );
  },
});

// live cycle
onMounted(() => {
  if (import.meta.env.DEV) {
    formData[AccNum.Name] = '測試戶名' + dayjs().format('YYYYMM-DD HH:ss');
    formData[AccNum.Account] = '374892374' + dayjs().format('ss');
    formData[AccNum.BankID] = '測試銀行';
    formData[AccNum.Branch] = '測試省分';
  }
});
onBeforeUnmount(() => {
  clearInterval(timeIntervale.value);
});
</script>

<style scoped></style>
