<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, toRefs } from 'vue';
import { usePendingStore } from 'src/stores/pending';
import PendingItem from 'src/components/PendingItem.vue';

const { t } = useI18n();
const { pendingInstant } = toRefs(usePendingStore());

onMounted(() => {
  pendingInstant.value.refresh();
});
</script>
<template>
  <q-list>
    <pending-item
      v-for="(order, index) in pendingInstant?.data"
      :key="index"
      :order="order"
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

<style scoped></style>
