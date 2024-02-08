<template>
  <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
    <!-- title 是否要取消訂單-->
    <div>{{ $t('transaction.title_confirm_cancel') }}</div>

    <q-card-actions align="right" class="text-blue-13">
      <!-- 返回btn -->
      <q-btn
        v-close-popup
        outline
        color="blue-13"
        :label="$t('transaction.cancel')"
      />
      <!-- 確認btn -->
      <q-btn
        unelevated
        color="blue-13"
        :label="$t('transaction.確認取消')"
        @click="
          () =>
            cancel({
              Token: token,
            })
        "
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useCancel } from './api';
import { usePendingStore } from 'src/stores';
defineProps<{ token: string }>();

// request
const { run: cancel } = useCancel({
  onSuccess: () => {
    usePendingStore().pendingInstant.refresh();
  },
});
//
</script>

<style scoped></style>
