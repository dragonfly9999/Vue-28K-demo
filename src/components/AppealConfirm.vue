<template>
  <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
    <!-- title是否要申訴 -->
    <div>{{ $t('transaction.title_confirm_appeal') }}</div>

    <q-card-actions align="right" class="text-blue-13">
      <!-- 返回btn -->
      <q-btn v-close-popup outline color="blue-13" :label="$t('label.close')" />
      <!-- 確認btn -->
      <q-btn
        v-close-popup
        @click="
          () =>
            appeal({
              Token: route.query.token as string
            })
        "
        unelevated
        color="blue-13"
        :label="$t('label.confirm')"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAppeal } from './api';

const route = useRoute();

// request
const { run: appeal } = useAppeal();
</script>

<style scoped></style>
