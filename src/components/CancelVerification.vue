<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const emit = defineEmits(['confirm']);
const { t } = useI18n();
</script>
<template>
  <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
    <div class="flex items-center q-gutter-x-sm">
      <q-icon name="warning_amber" size="sm" color="orange-9" />
      <!-- title-取消驗證 -->
      <div class="text-h6 text-orange-9 text-weight-bold">
        {{ t('transaction.cancel') }}
      </div>
    </div>
    <!-- 取消驗證注意事項 -->
    <div>{{ t('warn.cancel') }}</div>
    <q-card-actions align="right" class="text-blue-13">
      <!-- 返回btn -->
      <q-btn outline color="blue-13" :label="t('main.back')" v-close-popup />
      <!-- 確認btn -->
      <q-btn
        color="blue-13"
        unelevated
        :label="t('main.confirm')"
        @click="() => emit('confirm')"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
