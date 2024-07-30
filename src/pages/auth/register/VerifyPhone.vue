<template>
  <q-form
    @submit="
      () => {
        if (countryCode && phone && mask?.length === phone.length) {
          checkExsist({
            reg_countrycode: countryCode.toString(),
            reg_tel: phone.replace(/^0/, ''),
          });
        }
      }
    "
  >
    <!-- phone -->
    <div class="row">
      <div class="col-auto">
        <!-- 國碼 -->
        <q-select
          :disable="(!disableVerifyInputer && isLockerSender) || isSuccess"
          :loading="checking || sending || checkingVerification"
          class="q-mr-xs countryCode"
          outlined
          :model-value="
            countryCodeOptions.find((option) => option.value === countryCode)
              ?.label
          "
          @update:model-value="
            (option) => {
              $emit('update:countryCode', option.value);
              verification = '';
            }
          "
          :options="countryCodeOptions"
          :label="$t('auth.國碼')"
          :rules="[(val) => !!val || $t('error.input.countryCode')]"
          :display-value="countryCode ? `+${countryCode}` : undefined"
        />
      </div>
      <div class="col">
        <q-input
          :disable="(!disableVerifyInputer && isLockerSender) || isSuccess"
          :loading="checking || sending || checkingVerification"
          lazy-rules
          :rules="[
            (val) =>
              (!!val && val.length === mask.length) || $t('error.input.phone'),
          ]"
          :model-value="phone"
          outlined
          :label="$t('auth.手機')"
          @update:model-value="
            (value) => {
              verification = '';
              phone = value?.toString() ?? '';
            }
          "
          autocomplete="off"
          inputmode="numeric"
        />
      </div>
    </div>
    <!-- 驗證碼 -->
    <div class="col-12">
      <!-- 使用者輸入時監聽 -->
      <!-- 輸入完整六碼時發送檢驗驗證碼 -->
      <q-input
        :loading="checkingVerification"
        :disable="disableVerifyInputer || isSuccess"
        class="full-width"
        mask="######"
        v-model="verification"
        outlined
        :label="$t('auth.驗證碼')"
        @update:model-value="
          (value) => {
            if (value?.toString().length === 6) {
              checkVerification({
                reg_countrycode: countryCode?.toString() as string,
                reg_tel: phone,
                OneTimePwd: value?.toString(),
              });
            }
          }
        "
        autocomplete="off"
        inputmode="numeric"
      />
    </div>

    <!-- 驗證電話號碼 發送簡訊驗證碼 -->
    <!-- 1. 成功驗證號碼未註冊時鎖住號碼編輯10秒 -->
    <!-- 2. 發送簡訊後鎖住按鈕五分鐘 -->
    <button-locker
      :loading="checking || sending"
      type="submit"
      :disable="isSuccess"
      :label="$t('auth.發送') + $t('auth.驗證碼')"
      :is-lock="isLockerSender"
      @un-lock="handleUnLock"
      :class="'full-width q-mt-md'"
    />
  </q-form>
</template>

<script setup lang="ts">
import hooks from 'src/hooks';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import api from '../api';
import ButtonLocker from 'src/components/ButtonLocker.vue';
import { useStorage } from 'vue3-storage';

const props = defineProps<{ countryCode: number | undefined }>();
const emits = defineEmits(['success', 'update:countryCode']);
const { t } = useI18n();
const countryCodeOptions = hooks.useCountryCodeOptions();
const vueStorage = useStorage();
// DOM
const mask = hooks.usePhoneMask(computed(() => props.countryCode));
const phone = ref('');
const verification = ref('');
const isLockerSender = ref(false);
const disableVerifyInputer = ref(true);
const isSuccess = ref(false);
// vue request
const { run: checkVerification, loading: checkingVerification } =
  api.useCheckVerification({
    onSuccess: () => {
      isSuccess.value = true;
      hooks.useSuccessNotify(t('auth.驗證成功'));
      emits('success');
    },
  });
const { run: sendVerification, loading: sending } = api.useSendVerification({
  onSuccess: () => {
    vueStorage.setStorageSync('verify_locker', true);
    disableVerifyInputer.value = false;
    isLockerSender.value = true;
    hooks.useSuccessNotify(t('auth.已發送驗證碼'));
  },
});
const { run: checkExsist, loading: checking } = api.useCheckExists({
  // 確認是否已註冊
  onSuccess: () => {
    vueStorage.setStorageSync('register', {
      phone: phone.value,
      countryCode: props.countryCode,
    });
    sendVerification({
      reg_countrycode: props.countryCode?.toString() as string,
      reg_tel: phone.value.replace(/^0/, ''),
    });
  },
  onError: () => {
    vueStorage.clearStorageSync();
    phone.value = '';
    emits('update:countryCode', undefined);
  },
});

onMounted(() => {
  const isLockVerify = vueStorage.getStorageSync<boolean>('verify_locker');
  if (isLockVerify) {
    disableVerifyInputer.value = false;
    isLockerSender.value = true;
  }
  const registerInfoStorage = vueStorage.getStorageSync<{
    phone: string;
    countryCode: number;
    token: string;
  }>('register');
  emits(
    'update:countryCode',
    registerInfoStorage?.countryCode
      ? Number(registerInfoStorage.countryCode)
      : undefined
  );
  phone.value = registerInfoStorage?.phone ?? '';
  if (registerInfoStorage?.phone) {
    disableVerifyInputer.value = false;
    if (registerInfoStorage.token) {
      isSuccess.value = true;
      emits('success');
    }
  }
});

const handleUnLock = () => {
  vueStorage.setStorageSync('verify_locker', false);
  isLockerSender.value = false;
};
</script>

<style scoped>
.countryCode {
  min-width: 120px;
}
</style>
