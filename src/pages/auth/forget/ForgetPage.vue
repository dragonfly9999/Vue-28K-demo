<template>
  <div style="max-width: 420px; margin: auto; padding: 0 0.1rem">
    <q-card class="q-pa-md q-mx-sm q-my-xl justify-center myshadow">
      <!-- title -->
      <div class="row">
        <div class="col-3"></div>

        <div class="col flex justify-center text-h6 text-weight-bold">
          {{ $t('auth.忘記密碼') }}
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
          {{ $t('auth.warn.forget') }}
        </div>
      </div>

      <!-- 驗證手機 -->
      <verify-phone
        v-model:country-code="countryCode"
        @success="(token: string) => (resetToken = token)"
      />

      <!-- 輸入新密碼 -->
      <q-form
        v-if="!!resetToken"
        @submit="
          () => {
            if (!countryCode || !resetToken || !newPassword) return;
            reset({
              reg_countrycode: countryCode.toString(),
              reg_pwd: newPassword,
              reg_tel: '',
              reg_token: resetToken,
            });
          }
        "
      >
        <q-input
          class="q-mt-md"
          v-model="newPassword"
          outlined
          :label="$t('auth.請輸入新密碼')"
          lazy-rules
          :rules="[(val) => !!val || $t('error.input.empty')]"
          :loading="underReset"
          aria-autocomplete="none"
        />

        <q-btn
          class="full-width"
          type="submit"
          color="primary"
          glossy
          :loading="underReset"
        >
          {{ $t('auth.重設密碼') }}
        </q-btn>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VerifyPhone from './VerifyPhone.vue';
import { useStorage } from 'vue3-storage';
import api from './api';
import hooks from 'src/hooks';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const vueStorage = useStorage();
const router = useRouter();
const { t } = useI18n();
// Dom
const countryCode = ref<number>();
const resetToken = ref<string>(import.meta.env.DEV ? '' : '');
const newPassword = ref<string>();
// vue request;
const { loading: underReset, run: reset } = api.useReset({
  onSuccess: () => {
    hooks.useSuccessNotify(t('auth.密碼已重設'));
    vueStorage.clearStorageSync();
    router.push({ name: 'login' });
  },
});

// life cycle
onMounted(() => {
  const storeResetToken = vueStorage.getStorageSync<string>('reset_token');
  if (storeResetToken) {
    resetToken.value = storeResetToken;
  }
});
</script>
<style scoped></style>
