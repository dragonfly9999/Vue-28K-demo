<template>
  <q-btn
    :loading="loading"
    :type="type"
    :class="props.class"
    glossy
    color="primary"
    style="width: min-content"
    @click="() => $emit('click')"
    :disable="timeRemain > 0 || disable"
  >
    {{ timeRemain > 0 ? timeRemain : label }}
  </q-btn>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  label: string;
  isLock: boolean;
  class?: string;
  type?: 'a' | 'submit' | 'button' | 'reset' | 'image/png' | string;
  loading?: boolean;
  disable?: boolean;
}>();
const emits = defineEmits(['click', 'unLock', 'lock']);
let lockerInterval: NodeJS.Timeout;
const timeRemain = ref(0); // seconds

const handleLock = () => {
  clearInterval(lockerInterval);
  timeRemain.value = import.meta.env.DEV ? 10 : 60 * 5;
  emits('lock');
  lockerInterval = setInterval(() => {
    timeRemain.value -= 1;
    if (timeRemain.value < 1) {
      emits('unLock');
      clearInterval(lockerInterval);
    }
  }, 1000);
};

watch(props, (_, newValue) => {
  if (newValue?.isLock) {
    handleLock();
  }
});
</script>
<style scoped></style>
