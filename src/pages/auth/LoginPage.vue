<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useLogin } from './api';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
import { useLiveStore } from 'src/stores';

const { t } = useI18n();
const router = useRouter();
const storage = useStorage();
const { run: login } = useLogin({
  onSuccess: (res) => {
    console.log('res:', res);
    const { login_session } = res?.data || {};
    if (login_session) {
      useLiveStore().setOrders(login_session);
    }
    storage.setStorageSync('phone', phone_number.value);
    storage.setStorageSync('password', password.value);
    router.push({ name: 'dashboard' });
  }
});

// DOM
const isTest = import.meta.env.DEV;
const countryCode = ref(isTest ? 886 : null);
const phone_number = ref(isTest ? 938265860 : null);
const password = ref(isTest ? 'dls24068812' : null);
const isVisibleSetting = ref(false);

// handlers
const handleSubmit = () => {
  const purePhone = /^0/.test(phone_number.value?.toString() as string)
    ? phone_number.value?.toString().slice(1)
    : phone_number.value?.toString();
  login({
    Login_countrycode: countryCode?.value?.toString() as string,
    Login_pwd: password.value?.toString() as string,
    Login_tel: purePhone as string
  });
};
</script>
<template>
  <div style="max-width: 420px; margin: auto; padding: 0 0.1rem">
    <q-card class="q-pa-md q-mx-sm q-my-xl justify-center myshadow">
      <!-- title -->
      <div class="row">
        <div class="col-3"></div>

        <div class="col flex justify-center text-h6 text-weight-bold">
          {{ t('label.login') }}
        </div>
        <div class="col-3"></div>
      </div>

      <q-separator spaced />

      <!-- 警示語 -->
      <div class="bg-step q-pa-sm flex items-start justify-center no-wrap">
        <q-icon name="error_outline" color="orange-9" />
        <div class="text-caption text-orange-8 q-ml-sm">
          {{ t('warn.login') }}
        </div>
      </div>
      <q-form @submit="handleSubmit">
        <div class="q-pa-md">
          <div class="row">
            <div class="col-auto">
              <q-select
                class="q-mr-xs"
                outlined
                v-model="countryCode"
                emit-value
                :options="
                  ['886', '852', '65', '86', '84']?.map((code) => ({
                    label: t(`country_code.${code}`),
                    value: code
                  }))
                "
                :label="t('label.country_code')"
                style="min-width: 100px"
                :rules="[(val) => !!val]"
                lazy-rules
                :error-message="t('error.country_code')"
              />
            </div>
            <div class="col">
              <q-input
                @keydown.enter="
                  () =>
                    login({
                      Login_countrycode: '',
                      Login_pwd: '',
                      Login_tel: ''
                    })
                "
                outlined
                v-model="phone_number"
                :label="t('label.phone')"
                :rules="[(val) => !!val]"
                lazy-rules
                :error-message="t('error.phone')"
              />
            </div>
          </div>
          <div class="col q-mt-md">
            <q-input
              outlined
              v-model="password"
              :type="isVisibleSetting ? 'text' : 'password'"
              :label="t('label.password')"
              @keydown.enter="login"
              :rules="[(val) => !!val]"
              lazy-rules
              :error-message="t('error.password')"
            >
              <template v-slot:append>
                <q-icon
                  :name="isVisibleSetting ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="() => (isVisibleSetting = !isVisibleSetting)"
                />
              </template>
            </q-input>
          </div>

          <q-btn
            class="q-mt-md full-width"
            color="blue-13"
            unelevated
            rounded
            type="submit"
            :label="$t('label.login')"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<style scoped></style>
