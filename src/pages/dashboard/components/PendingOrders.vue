<template>
  <q-list style="min-height: 50px">
    <q-inner-loading :showing="pendingInstant.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
    <pending-item
      v-for="(order, index) in pendingInstant?.data"
      :key="index"
      :order="order"
      :loading="pendingInstant.loading"
    />

    <q-item v-if="pendingInstant.data?.length === 0">
      <div
        class="q-pa-md text-capitalize text-weight-medium text-caption text-blue-14"
      >
        {{ t('label.no_order') }}
      </div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { usePendingStore } from 'src/stores/pending';
import PendingItem from 'src/components/PendingItem.vue';

const { t } = useI18n();
// DOM
const { pendingInstant } = usePendingStore();

onMounted(() => {
  if (pendingInstant.data) pendingInstant.refresh();
});
</script>
