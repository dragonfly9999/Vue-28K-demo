<script lang="ts" setup>
import { ref } from 'vue';
import QrScanner from 'qr-scanner';
import 'qr-scanner/qr-scanner-worker.min.js';
defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['onScan', 'update:modelValue']);

const video = ref();
const scanner = ref<QrScanner>();

const handleShow = () => {
  QrScanner.WORKER_PATH = 'path-to-worker/qr-scanner-worker.min.js';
  scanner.value = new QrScanner(video.value, (result: string) => {
    if (result) {
      emit('onScan', result);
      scanner.value?.pause();
    }
  });
  scanner.value?.start().catch((error: Error) => {
    console.error('QR code scanner initialization failed:', error);
  });
};
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(value) => emit('update:modelValue', value)"
    @show="handleShow"
    @hide="() => scanner?.pause()"
  >
    <q-card class="flex justify-center q-pa-md">
      <video class="qr-reader" ref="video"></video>
      <q-btn
        class="full-width q-mt-md"
        outline
        @click="() => emit('update:modelValue', false)"
      >
        {{ $t('transaction.cancel') }}
      </q-btn>
    </q-card>
  </q-dialog>
</template>
<style scoped>
.qr-reader {
  position: relative;
  width: 300px;
  height: 300px;
  border: 4px solid #000;
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
}
</style>
