<template>
  <div class="q-pa-xl flex flex-center">
    <div class="text-h4 text-weight-bold text-primary">
      {{ t('tit_check') }}
    </div>
  </div>
  <q-form @submit="handleSubmit">
    <div class="q-pa-md">
      <div class="row">
        <div class="col">
          <q-input
            outlined
            autocomplete="off"
            :label="t('email')"
            v-model="email"
            :rules="[(val) => !!val]"
            lazy-rules
            error-message="Please enter Email"
            inputmode="email"
          />
        </div>
      </div>
      <div class="col">
        <q-input
          outlined
          v-model="pwd"
          :type="isVisibleSetting ? 'text' : 'password'"
          :label="t('pwd')"
          :rules="[(val) => !!val]"
          lazy-rules
          error-message="Please enter password"
          autocomplete="off"
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
        label="Login"
        :loading="isLoging"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { storageHelper } from 'src/utils/foragePkg';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLogin } from './api';
import useSuccessNotify from 'src/hooks/useSuccessNotify';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const name = ref('DevChecker');
const $q = useQuasar();
// demo
function clickCheckName() {
  $q.notify({
    type: 'positive',
    message: `Mike check ${name.value}`,
    position: 'top',
    icon: 'check',
  });
}

const isTest = import.meta.env.DEV;
const email = ref(isTest ? 'K28@gmail.com' : null);
const pwd = ref(isTest ? '123k28' : null);
const isVisibleSetting = ref(false);

// mutation
const { run: testLog, loading: isLoging } = useLogin({
  onSuccess: () => {
    storageHelper<string | null>('email').setItem(email.value);
    storageHelper<string | null>('pwd').setItem(pwd.value);
    router.push({ name: 'home' });
    useSuccessNotify('Login successfully');
  },
});

// handlers

const handleSubmit = () => {
  testLog({
    Email: email?.value?.toString() as string,
    Pwd: pwd?.value?.toString() as string,
  });
};
</script>

<style scoped></style>
