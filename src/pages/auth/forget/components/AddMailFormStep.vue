<template>
  <div class="add_mail_container">
    <q-form @submit="handleSend" class="q-gutter-md">
      <q-input
        class="custom-input"
        outlined
        autocomplete="off"
        v-model="email"
        :rules="[(val) => !!val]"
        lazy-rules
        error-message="enter mail"
        inputmode="email"
        placeholder="enter mail"
      />

      <q-btn
        unelevated
        rounded
        color="purple"
        type="submit"
        label="Send Mail"
        :loading="checking"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import api from '../api';
import hooks from 'src/hooks';
import { storageHelper } from 'src/utils/foragePkg';
import { devEnv } from 'src/router/routes';

// setup funcs

const emit = defineEmits(['mail-added']);
const handleSend = () => {
  if (mailVfy.value)
    send({
      Email: mailVfy.value,
    });
};
const { run: send, loading: checking } = api.useVfyMail({
  onSuccess: () => {
    storageHelper<string | null>('mail_vfy').setItem(email.value);
    emit('mail-added');
    hooks.useSuccessNotify('Send Successflly! Please check your Email');
  },
});

const email = ref<string | null>(devEnv ? 'getCode@gmail.com' : '');

const mailVfy = computed(() => email.value);
</script>

<style scoped></style>
