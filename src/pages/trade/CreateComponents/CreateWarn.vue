<template>
  <q-dialog
    persistent
    trnasition-show="fade"
    trnasition-hide="fade"
    :model-value="visible"
    @update:model-value="(value) => $emit('update:visible', value)"
  >
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
        <q-btn v-close-popup outline color="blue-13" :label="$t('main.返回')" />
        <!-- 確認btn -->
        <q-btn
          :loading="loading"
          unelevated
          color="blue-13"
          :label="$t('main.確認')"
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean; visible: boolean }>();
defineEmits(['confirm', 'update:visible']);
</script>

<style scoped></style>
