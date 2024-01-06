<template>
  <div style="max-width: 420px; margin: auto; padding: 0 0.1rem">
    <q-card class="q-pa-md q-mx-sm q-my-xl justify-center myshadow">
      <!-- title -->
      <div class="row">
        <div class="col-3"></div>

        <div class="col flex justify-center text-h6 text-weight-bold">
          {{ t('auth.註冊') }}
        </div>
        <div class="col-3"></div>
      </div>

      <q-separator spaced />

      <!-- 警示語 -->
      <div
        class="bg-step q-pa-sm flex items-start justify-center no-wrap q-mb-md"
      >
        <q-icon name="error_outline" color="orange-9" />
        <div class="text-caption text-orange-8 q-ml-sm">
          {{ t('auth.warn.register') }}
        </div>
      </div>

      <verify-phone
        v-model:country-code="countryCode"
        @success="
          () => {
            isVerifyPhoneSuccess = true;
          }
        "
      />
      <!-- 設定密碼 -->
      <div v-show="isVerifyPhoneSuccess">
        <q-form
          @submit="
            () => {
              if (!whetherTwenty.value) {
                whetherTwenty.isError = true;
                return;
              }
              register({
                reg_pwd: password,
              });
            }
          "
        >
          <shy-input
            :loading="underRegister"
            lazy-rules
            class="q-mt-md full-width"
            :rules="[(val) => !!val || $t('error.input.password')]"
            v-model:model-value="password"
            :label="$t('auth.設定密碼')"
          />

          <!-- password check -->
          <shy-input
            :loading="underRegister"
            class="full-width"
            :rules="[
              (val) => !!val || $t('error.input.password'),
              (val) => val === password || $t('error.input.re_password'),
            ]"
            v-model:model-value="rePassword"
            :label="$t('auth.檢查密碼')"
          />

          <!-- 是否已滿20歲 -->
          <div class="flex no-wrap items-center">
            <q-checkbox
              v-model="whetherTwenty.value"
              @update:model-value="() => (whetherTwenty.isError = false)"
            />
            <p class="text-body2 text-right" style="margin: 0">
              {{ $t(`auth.isTwenty.${countryCode ?? 886}`) }}
            </p>
          </div>

          <div class="flex full-width justify-between items-center q-mb-md">
            <div
              class="whetherTwenty text-negative"
              :class="{ error: whetherTwenty.isError }"
            >
              {{ t('auth.請閱讀並同意') }}
            </div>
            <div class="row">
              <q-btn
                flat
                color="primary"
                :label="$t('auth.免責聲明')"
                size="md"
                dense
              />
              <q-btn
                flat
                color="primary"
                :label="$t('auth.使用條款')"
                size="md"
                dense
              />
              <q-btn
                flat
                color="primary"
                :label="$t('auth.隱私權條款')"
                size="md"
                dense
              />
            </div>
          </div>
          <!-- 發送註冊 -->
          <q-btn
            :loading="underRegister"
            type="submit"
            class="full-width"
            glossy
            color="primary"
            :label="$t('auth.註冊')"
          />
        </q-form>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import ShyInput from 'src/components/ShyInput.vue';
import { useI18n } from 'vue-i18n';
import { AxiosError } from 'axios';
import VerifyPhone from './VerifyPhone.vue';
import useRegister from '../api/useRegister';
import { useStorage } from 'vue3-storage';
import hooks from 'src/hooks';
import { useRouter } from 'vue-router';

const { t } = useI18n();
defineEmits(['toLogin']);
const vueStorage = useStorage();
const router = useRouter();
// DOM
const countryCode = ref<number>();
const password = ref('');
const rePassword = ref('');
const whetherTwenty = reactive({
  value: false,
  isError: false,
});
const isVerifyPhoneSuccess = ref(false);
const { run: register, loading: underRegister } = useRegister({
  onSuccess: () => {
    hooks.useSuccessNotify(t('auth.註冊成功'));
    vueStorage.clearStorageSync();
    router.push({ name: 'login' });
  },
  onError: (error) => {
    const virgilError = error as AxiosError<VirgilRes<unknown>>;
    hooks.useSuccessNotify(t(`error.${virgilError.response?.data.code}`));

    if (Number(virgilError.response?.data?.code) === 11) {
      vueStorage.clearStorageSync();
      router.push({ name: 'login' });
    }
  },
});

onMounted(() => {
  if (import.meta.env.DEV) {
    password.value = '123456';
    rePassword.value = '123456';
  }
});
</script>

<style scoped>
div.whetherTwenty {
  transition: height 0.5s ease-in-out;
  height: 0px;
  overflow-y: hidden;
  &.error {
    height: 20px;
  }
}
</style>
