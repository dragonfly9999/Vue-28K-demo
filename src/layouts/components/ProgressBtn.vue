<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <q-btn
    no-caps
    rounded
    unelevated
    color="blue-13"
    :label="t('label.inProgress')"
    style="width: fit-content"
    class="lt-xs q-px-sm"
  >
    <q-badge color="red" floating> 2 </q-badge>

    <q-menu :offset="[160, 10]" transition-show="scale" transition-hide="scale">
      <q-list
        bordered
        class="rounded-borders q-pa-xs"
        style="min-width: fit-content"
      >
      </q-list>
    </q-menu>
  </q-btn>
</template>

<style scoped></style>
