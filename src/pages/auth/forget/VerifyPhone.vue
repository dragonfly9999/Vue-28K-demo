<template>
  <q-form
    @submit="
      () => {
        if (!countryCode || !phone || mask?.length !== phone.length) return;
        checkExsist({
          reg_countrycode: countryCode.toString(),
          reg_tel: purePhone,
        });
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
          :mask="mask"
          outlined
          inputmode="decimal"
          aria-autocomplete="none"
          :label="$t('auth.手機')"
          @update:model-value="
            (value) => {
              verification = '';
              phone = value?.toString() ?? '';
            }
          "
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
        inputmode="decimal"
        aria-autocomplete="none"
        @update:model-value="
          (value: string|undefined) => {
            if (value?.toString().length === 6) {
              checkVerification({
                reg_countrycode: countryCode?.toString() as string,
                reg_tel: purePhone,
                OneTimePwd: value?.toString(),
              });
            }
          }
        "
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
import api from './api';
import ButtonLocker from 'src/components/ButtonLocker.vue';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';
import { storageHelper } from 'src/utils/foragePkg';

const props = defineProps<{ countryCode: number | undefined }>();
const emits = defineEmits(['success', 'update:countryCode']);
const { t } = useI18n();
const countryCodeOptions = hooks.useCountryCodeOptions();
const router = useRouter();
// DOM
const mask = hooks.usePhoneMask(computed(() => props.countryCode));
const phone = ref('');
const verification = ref('');
const isLockerSender = ref(false);
const disableVerifyInputer = ref(true);
const isSuccess = ref(false);
// compute
const purePhone = computed(() => phone.value.replace(/^0/, ''));
// vue request
const { run: checkVerification, loading: checkingVerification } = api.useVerify(
  {
    onSuccess: (res) => {
      if (!res) return;
      isSuccess.value = true;
      hooks.useSuccessNotify(t('auth.驗證成功'));
      storageHelper('reset_token').setItem(res.data);
      emits('success', res?.data);
    },
  }
);
// step: 2 => 發送驗證碼
const { run: sendVerification, loading: sending } = api.useSendVerification({
  onSuccess: () => {
    storageHelper<boolean>('verify_locker').setItem(true);
    disableVerifyInputer.value = false;
    isLockerSender.value = true;
    hooks.useSuccessNotify(t('auth.已發送驗證碼'));
  },
});

// step: 1 => 檢查手機是否已註冊
const { run: checkExsist, loading: checking } = api.useCheckExists({
  onSuccess: () => {
    Notify.create({
      type: 'info',
      message: t('auth.此手機尚未註冊'),
      position: 'top-right',
      timeout: 2000,
    });
    setTimeout(() => {
      router.push({ name: 'register' });
    }, 100);
  },
  onError: (e) => {
    const virgilError = e as AxiosError<VirgilRes<string>>;
    if (Number(virgilError.response?.data.code) === 11) {
      storageHelper<{ phone: string; countryCode?: number }>(
        'forget_Info'
      ).setItem({
        phone: phone.value,
        countryCode: props.countryCode,
      });
      sendVerification({
        reg_countrycode: props.countryCode?.toString() as string,
        reg_tel: purePhone.value,
      });
    } else {
      hooks.useKickOut.clean();
      phone.value = '';
      emits('update:countryCode', undefined);
    }
  },
});

// life cycle
onMounted(() => {
  const isLockVerify = storageHelper<boolean>('verify_locker').getItem();
  if (isLockVerify) {
    disableVerifyInputer.value = false;
    isLockerSender.value = true;
  }
  const forgetInfoStorage = storageHelper<{
    phone: string;
    countryCode: number;
  }>('forget_Info').getItem();
  emits(
    'update:countryCode',
    forgetInfoStorage?.countryCode
      ? Number(forgetInfoStorage.countryCode)
      : undefined
  );
  phone.value = forgetInfoStorage?.phone ?? '';

  const resetTokenStore = storageHelper('reset_token').getItem();
  if (resetTokenStore) {
    disableVerifyInputer.value = false;
    isSuccess.value = true;
    emits('success', resetTokenStore);
  }
});

const handleUnLock = () => {
  storageHelper<boolean>('verify_locker').setItem(false);
  isLockerSender.value = false;
};
</script>

<style scoped>
.countryCode {
  min-width: 120px;
}
</style>
