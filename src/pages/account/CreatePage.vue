<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AccNum, AccRes } from './api/useAccHistory';
import { useRouter } from 'vue-router';
import { useSetAcc } from './api';
import CancelVerification from 'src/components/CancelVerification.vue';
const timeIntervale = ref<NodeJS.Timeout>();
const { t } = useI18n();
const router = useRouter();
const { run: set } = useSetAcc({
  onSuccess: () => {
    timeIntervale.value = setInterval(() => {
      if (time.value > 0) {
        time.value -= 1;
      } else {
        router.push({ name: 'account' });
      }
    }, 1000);
  }
});
// DOM
const time = ref(5);
const formData = reactive<Omit<AccRes, 'H_id'>>({
  [AccNum.Account]: '',
  [AccNum.Name]: '',
  [AccNum.BankID]: '',
  [AccNum.Branch]: ''
});
const visible = reactive({
  warn: false,
  redirect: false
});
//
onBeforeUnmount(() => {
  clearInterval(timeIntervale.value);
});
</script>
<template>
  <q-card class="q-pa-sm q-ma-sm q-mt-md q-mb-xl" style="max-width: 600px">
    <q-form
      @submit="
        () =>
          set({
            [AccNum.Account]: formData[AccNum.Account],
            [AccNum.Name]: formData[AccNum.Name],
            [AccNum.BankID]: formData[AccNum.BankID],
            [AccNum.Branch]: formData[AccNum.Branch]
          })
      "
    >
      <div class="row q-mb-sm items-center">
        <div class="col-2">
          <q-btn
            flat
            dense
            color="blue-13"
            :label="t('label.back')"
            @click="() => (visible.warn = true)"
          />
        </div>
        <!-- title帳戶驗證 -->
        <div class="col text-center text-h6 text-weight-bold">
          {{ $t('label.title_add_account') }}
          <!-- ()帳戶 -->
          <div class="text-overline text-blue-13">
            {{ $t('label.CNY.account') }}{{ $t('label.account') }}
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
            <div>{{ $t('label.bank_info') }}</div>
            <div>
              <!-- hint -->
              {{ $t('warn.bank_hint') }}
            </div>
          </div>

          <div>
            <!-- 銀行戶名 -->
            <div class="q-my-sm">{{ $t(`label.CNY.${AccNum.Name}`) }}</div>
            <q-input
              outlined
              v-model="formData[AccNum.Name]"
              :rules="[
                (val) => (val?.length > 0 && !!val) || t('error.simple_input')
              ]"
            />
          </div>
          <div>
            <!-- 銀行帳號 -->
            <div class="q-my-sm">{{ $t(`label.CNY.${AccNum.Account}`) }}</div>
            <q-input
              outlined
              v-model="formData[AccNum.Account]"
              :rules="[
                (val) => (val?.length > 0 && !!val) || t('error.simple_input')
              ]"
            />
          </div>
          <div>
            <!-- 銀行名稱 -->
            <div class="q-my-sm">{{ $t(`label.CNY.${AccNum.BankID}`) }}</div>
            <q-input
              outlined
              v-model="formData[AccNum.BankID]"
              :rules="[
                (val) => (val?.length > 0 && !!val) || t('error.simple_input')
              ]"
            />
          </div>
          <div>
            <!-- 省分 -->
            <div class="q-my-sm">{{ $t(`label.CNY.${AccNum.Branch}`) }}</div>
            <q-input
              outlined
              v-model="formData[AccNum.Branch]"
              :rules="[
                (val) => (val?.length > 0 && !!val) || t('error.simple_input')
              ]"
            />
          </div>

          <!-- buttons -->
          <div class="flex q-gutter-x-md justify-end">
            <!-- 確認btn -->
            <q-btn
              color="blue-13"
              unelevated
              :label="t('label.confirm')"
              type="submit"
            />
          </div>
        </div>
      </div>
    </q-form>
  </q-card>
  <!-- 跳轉前提示 -->
  <q-dialog :model-value="!!timeIntervale" persistent>
    <q-card class="q-pa-lg" align="center" style="width: 360px">
      <q-icon name="check_circle" color="green-8" size="lg" />
      <!-- 提交成功 -->
      <div class="text-h6 text-weight-bold">{{ $t('kyc.label.success') }}</div>
      <div class="flex justify-center q-gutter-x-sm q-mt-lg text-grey-5">
        <!-- 等待跳轉 -->
        <div>{{ $t('label.jump') }}</div>
        <q-spinner-dots size="1.5em" />
        <div>{{ time }}</div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="visible.warn" persistent>
    <CancelVerification @confirm="() => router.push({ name: 'account' })" />
  </q-dialog>
</template>

<style scoped></style>
