<template>
  <div class="q-pa-md flex flex-center column items-center">
    <div class="text-h6 q-mb-sm">驗證碼</div>

    <div class="row q-gutter-sm justify-center q-mb-md">
      <q-input
        v-for="(char, index) in otp"
        :key="index"
        ref="inputs"
        v-model="otp[index]"
        mask="X"
        maxlength="1"
        outlined
        square
        dense
        class="otp-input"
        @keyup="handleKeyup(index, $event)"
        input-class="text-center text-h6"
        type="password"
      />
    </div>

    <q-btn
      label="下一步"
      color="primary"
      unelevated
      class="q-mt-md full-width"
      :loading="sending"
      @click="handleSubmit"
    />
    <q-btn color="primary" icon="check" label="back" @click="handleBack" />
  </div>
</template>

<script setup lang="ts">
import hooks from 'src/hooks';
import { onMounted, ref } from 'vue';
import api from '../api';
import { storageHelper } from 'src/utils/foragePkg';

const emit = defineEmits<{
  (e: 'tokenGot', token: string): void;
  (e: 'currMail', mail: string | null): void;
}>();

const otp = ref(Array(6).fill(''));
const inputs = ref<HTMLInputElement[]>([]);
const currentMail = ref<string | null>();

onMounted(() => {
  inputs.value[0]?.focus();
  currentMail.value = storageHelper<string | null>('mail_vfy').getItem();
});

const { run: codeSend, loading: sending } = api.useSendCode({
  onSuccess: (res) => {
    const token = res?.data?.token;
    if (token) {
      emit('tokenGot', token);
      hooks.useSuccessNotify('Successfully send code');
      console.log({ token });
    }
  },
});

const handleKeyup = (index: number, e: KeyboardEvent) => {
  const key = e.key;
  const value = otp.value[index];

  if (key === 'Backspace') {
    if (!value && index > 0) {
      inputs.value[index - 1]?.focus();
    }
  } else if (key.match(/[0-9]/) && index < 5) {
    // Only number
    inputs.value[index + 1]?.focus();
  }
};

// back addMail
const handleBack = () => {
  if (currentMail.value) {
    emit('currMail', currentMail.value);
    storageHelper<string>('mail_vfy').remove();
  }
};

const handleSubmit = () => {
  const otpSend = otp.value.join('');
  if (!/^\d{6}$/.test(otpSend)) {
    return;
  }
  const optNum = Number(otpSend);
  codeSend({ CodeVerify: optNum });
};
</script>

<style scoped>
.otp-input {
  width: 48px;
}
</style>
