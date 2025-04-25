<template>
  <q-form @submit="handleSet">
    <!-- New password -->
    <q-input
      class="custom-input"
      outlined
      v-model="newPwd"
      :type="isVisibleSetting ? 'text' : 'password'"
      :rules="passwordRules"
      lazy-rules
      error-message="Password must be at least 8 characters, include 1 uppercase and 1 number"
      autocomplete="off"
      placeholder="Enter password"
    >
      <template v-slot:append>
        <q-icon
          :name="isVisibleSetting ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="() => (isVisibleSetting = !isVisibleSetting)"
        />
      </template>
    </q-input>

    <!-- confirm password -->
    <q-input
      class="custom-input"
      outlined
      v-model="confirmPwd"
      :type="isVisibleSetting ? 'text' : 'password'"
      :rules="confirmPasswordRules"
      lazy-rules
      error-message="Passwords must match"
      autocomplete="off"
      placeholder="Confirm password"
    >
      <template v-slot:append>
        <q-icon
          :name="isVisibleSetting ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="() => (isVisibleSetting = !isVisibleSetting)"
        />
      </template>
    </q-input>

    <q-btn
      type="submit"
      color="primary"
      label="Change Password"
      :loading="setting"
      class="q-mt-md"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../api';

const props = defineProps<{ token: string }>();
const emit = defineEmits(['show-notify']);

// Refs & state
const isVisibleSetting = ref(false);
const newPwd = ref('');
const confirmPwd = ref('');

// Validation rules
const passwordRules = [
  (val: string) => !!val || 'Required',
  (val: string) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val) ||
    'Password must be at least 8 characters, include 1 uppercase and 1 number',
];

const confirmPasswordRules = [
  (val: string) => !!val || 'Required',
  (val: string) => val === newPwd.value || 'Passwords must match',
];

// Submit handler
const { run: set, loading: setting } = api.useSetPw({
  onSuccess: () => emit('show-notify'),
});

const handleSet = () => {
  set({
    token: props.token,
    new_password: confirmPwd?.value,
  });
};
</script>

<style scoped>
.custom-input {
  margin-bottom: 16px;
}
</style>
