<template>
  <div style="max-width: 420px; margin: auto; padding: 0 0.1rem">
    <q-card class="q-pa-md q-mx-sm q-my-xl justify-center myshadow">
      <!-- title -->
      <div class="row">
        <div class="col-3"></div>

        <div class="col flex justify-center text-h6 text-weight-bold">
          {{ $t('auth.登入') }}
        </div>
        <div class="col-3"></div>
      </div>

      <q-separator spaced />

      <!-- 警示語 -->
      <div class="bg-step q-pa-sm flex items-start justify-center no-wrap">
        <q-icon name="error_outline" color="orange-9" />
        <div class="text-caption text-orange-8 q-ml-sm">
          {{ $t('auth.warn.login') }}
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
                  ['886', '852', '65', '86', '84', '63']?.map((code) => ({
                    label: $t(`countryCode.${code}`),
                    value: code,
                  }))
                "
                :label="t('auth.國碼')"
                style="min-width: 100px"
                :rules="[(val) => !!val]"
                lazy-rules
                :error-message="t('error.country_code')"
              />
            </div>
            <div class="col">
              <q-input
                outlined
                v-model="phone_number"
                :label="t('auth.手機')"
                :rules="[(val) => !!val]"
                lazy-rules
                :error-message="t('error.phone')"
              />
            </div>
          </div>
          <div class="col">
            <q-input
              outlined
              v-model="password"
              :type="isVisibleSetting ? 'text' : 'password'"
              :label="t('auth.密碼')"
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
            class="full-width"
            color="blue-13"
            unelevated
            rounded
            type="submit"
            :label="$t('auth.登入')"
            :loading="loading"
          />
        </div>
      </q-form>
      <div class="flex justify-between q-px-md items-center">
        <div class="q-gutter-sm">
          <q-btn
            dense
            size="small"
            v-if="isTest"
            @click="
              () => {
                countryCode = 86;
                phone_number = 938265860;
                password = '123456';
              }
            "
            color="orange"
            :outline="
              countryCode !== 86 &&
              phone_number !== 938265860 &&
              password !== '123456'
            "
          >
            會員
          </q-btn>
          <q-btn
            dense
            size="small"
            v-if="isTest"
            @click="
              () => {
                countryCode = 886;
                phone_number = 9809806674;
                password = '000000';
              }
            "
            color="blue"
            :outline="
              countryCode !== 886 &&
              phone_number !== 9809806674 &&
              password !== '000000'
            "
          >
            代理
          </q-btn>
        </div>
        <div class="q-gutter-md">
          <!-- <router-link to="register_master" class="text-blue">
            <q-btn dense unelevated> {{ $t('auth.註冊') }} </q-btn>
          </router-link> -->
          <router-link to="forget" class="text-blue">
            <q-btn dense unelevated> {{ $t('auth.忘記密碼') }} </q-btn>
          </router-link>
        </div>
      </div>
    </q-card>
  </div>
</template>

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

// DOM
const isTest = import.meta.env.DEV;
const countryCode = ref(isTest ? 886 : null);
const phone_number = ref(isTest ? 9809806674 : null);
const password = ref(isTest ? '000000' : null);
const isVisibleSetting = ref(false);

// mutation
const { run: login, loading } = useLogin({
  onSuccess: (res) => {
    const { login_session } = res?.data || {};
    if (login_session) {
      useLiveStore().setOrders(login_session);
    }
    storage.setStorageSync('phone', phone_number.value);
    storage.setStorageSync('password', password.value);
    router.push({ name: 'dashboard' });
  },
});

// handlers
const handleSubmit = () => {
  const purePhone = /^0/.test(phone_number.value?.toString() as string)
    ? phone_number.value?.toString().slice(1)
    : phone_number.value?.toString();
  login({
    Login_countrycode: countryCode?.value?.toString() as string,
    Login_pwd: password.value?.toString() as string,
    Login_tel: purePhone as string,
  });
};
</script>

<style scoped></style>
