<script setup lang="ts">
import { toRefs } from 'vue';
import api from '../../api';
import { use2faStore } from '../../../stores';

const props = defineProps<{
  model_value: boolean;
}>();
const emit = defineEmits(['update:model_value']);
const { model_value } = toRefs(props);

// queries
const { loading, refresh, isEnabled, qrSrc } = toRefs(use2faStore());
const { run, loading: running } = api.use2faCreate({
  onSuccess: () => {
    refresh.value();
  },
});
const { run: del, loading: deling } = api.use2faDel({
  onSuccess: () => {
    refresh.value();
  },
});

// computes
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
          v-if="isEnabled"
          :src="qrSrc"
          alt="2FA QR"
        />
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
          v-if="isEnabled"
          :loading="running || deling"
          size="small"
          color="warning"
          @click="() => run({})"
        >
          重設
        </q-btn>
        <q-btn
          v-if="isEnabled"
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
