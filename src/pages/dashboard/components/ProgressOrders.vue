<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useProgressStore } from 'src/stores';
import { useI18n } from 'vue-i18n';

const { getProgress } = useProgressStore();
const { t } = useI18n();
</script>
<template>
  <q-list>
    <OrderItem
      v-for="(order, index) in getProgress()"
      :key="index"
      :order="order"
      :is-instant="false"
    />
    <q-item v-if="getProgress().length === 0">
      <div
        class="q-pa-md text-capitalize text-weight-medium text-caption text-blue-14"
      >
        {{ t('label.no_order') }}
      </div>
    </q-item>
  </q-list>
</template>

<style scoped></style>
