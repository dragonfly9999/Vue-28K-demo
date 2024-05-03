<template>
  <q-btn
    flat
    round
    color="grey-5"
    @click="() => (leavingWarning = true)"
    icon="cancel"
    dense
  />
  <q-dialog v-model="leavingWarning" persistent>
    <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
      <div class="flex items-center q-gutter-x-sm">
        <q-icon name="warning_amber" size="sm" color="orange-9" />
        <!-- title -->
        <div class="text-h6 text-orange-9 text-weight-bold">
          {{ $t('main.title') }}
        </div>
      </div>
      <!-- 取消驗證注意事項 -->
      <div>{{ $t('main.content') }}</div>
      <q-card-actions align="right" class="text-primary">
        <!-- 返回btn -->
        <q-btn
          outline
          color="primary"
          :label="$t('back')"
          @click="() => (leavingWarning = false)"
        />
        <!-- 確認btn -->
        <q-btn
          color="primary"
          glossy
          :label="$t('main.確認')"
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leavingWarning = ref(false);
defineEmits(['confirm']);
</script>
<style scoped></style>
