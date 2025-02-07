<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import api from '../../api';
import { use2faStore } from '../../../stores';

const props = defineProps<{
  model_value: boolean;
}>();
const emit = defineEmits(['update:model_value']);
// DOM
const { model_value } = toRefs(props);
const isDev = ref(import.meta.env.DEV);
// queries
const { loading, refresh, isEnabled } = toRefs(use2faStore());
const twoFaCreate = api.use2faCreate({
  onSuccess: () => {
    refresh.value();
  },
});
const { data, run, loading: running } = twoFaCreate;
const { run: del, loading: deling } = api.use2faDel({
  onSuccess: () => {
    refresh.value();
  },
});

// computes
const qrSrc = computed(() =>
  !!data.value ? `data:image/png;base64,${data.value?.Qr_img}` : undefined
);
</script>
<template>
  <q-dialog
    :model_value="model_value"
    @update:model_value="(newValue: boolean) => emit('update:model_value', newValue)"
  >
    <q-card class="q-pa-md" :style="{ transform: 'translate(0, -5vh)' }">
      <header
        className="flex items-center justify-between q-mb-md"
        :style="{ 'min-width': '380px' }"
      >
        <div>2FA 驗證</div>
        <q-spinner-gears v-if="loading" color="primary" />
        <div v-else-if="isEnabled">已開啟</div>
        <div v-else>尚未開啟</div>
      </header>

      <main>
        <q-img
          :loading="loading || running || deling"
          v-if="!!qrSrc && isEnabled"
          :src="qrSrc"
          alt="2FA QR"
        />
        <div v-if="!qrSrc && isEnabled" class="text-warning">
          若綁定失敗，請聯繫客服
        </div>
      </main>

      <footer class="flex justify-end" :style="{ gap: '4px' }">
        <q-btn
          v-if="!isEnabled"
          :loading="running || loading"
          size="small"
          color="primary"
          @click="() => run({})"
        >
          啟動
        </q-btn>
        <q-btn
          v-if="isEnabled && false"
          :loading="running || deling"
          size="small"
          color="warning"
          @click="() => run({})"
        >
          重設
        </q-btn>
        <q-btn
          v-if="isEnabled && isDev"
          :loading="running || deling"
          size="small"
          color="red"
          @click="() => del({})"
        >
          移除
        </q-btn>
      </footer>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
