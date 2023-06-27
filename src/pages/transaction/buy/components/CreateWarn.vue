<script setup lang="ts">
defineProps<{ loading: boolean }>();
const emits = defineEmits(['confirm']);
</script>
<template>
  <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
    <div class="flex items-center q-gutter-x-sm">
      <q-icon name="warning_amber" size="sm" color="orange-9" />
      <!-- title-請注意 -->
      <div class="text-h6 text-orange-9 text-weight-bold">
        {{ $t('請注意') }}
      </div>
    </div>
    <!-- hint交易注意事項 -->
    <div>
      {{
        $t(
          '轉帳時請勿註記任何關於數字貨幣相關文字，匯款資料不符時將不受理交易服務，並退還收款金額，相關手續費會於退款時一倂扣除，謝謝。'
        )
      }}
    </div>
    <q-card-actions align="right" class="text-primary">
      <!-- 返回btn -->
      <q-btn v-close-popup outline color="blue-13" :label="$t('label.back')" />
      <!-- 確認btn -->
      <q-btn
        unelevated
        color="blue-13"
        :label="$t('label.confirm')"
        @click="emits('confirm')"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
