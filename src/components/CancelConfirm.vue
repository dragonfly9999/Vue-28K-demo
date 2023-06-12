<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useCancel } from './api';
const { t } = useI18n();
const route = useRoute();
const { run: cancel } = useCancel();
//
</script>
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
        :label="t('transaction.cancel')"
      />
      <!-- 確認btn -->
      <q-btn
        unelevated
        color="blue-13"
        :label="t('transaction.confirmCancel')"
        @click="
          () =>
            cancel({
              Token: route.query.token as string
            })
        "
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
