<script setup lang="ts">
defineProps<{ loading: boolean }>();
const emits = defineEmits(['confirm']);
</script>
<template>
  <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
    <!-- title-請注意 -->
    <div class="flex items-center q-gutter-x-sm">
      <q-icon name="warning_amber" size="sm" color="orange-9" />
      <div class="text-h6 text-orange-9 text-weight-bold">
        {{ $t('transaction.createWarn.title') }}
      </div>
    </div>
    <!-- hint交易注意事項 -->
    <div>
      {{ $t('transaction.createWarn.hint') }}
    </div>
    <q-card-actions align="right" class="text-primary">
      <q-btn v-close-popup outline color="blue-13" :label="$t('返回')" />
      <!-- 確認btn -->
      <q-btn
        :loading="loading"
        unelevated
        color="blue-13"
        :label="$t('確認')"
        @click="emits('confirm')"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
