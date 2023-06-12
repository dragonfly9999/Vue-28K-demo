<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useLiveStore } from 'src/stores';
import { useI18n } from 'vue-i18n';

const { getOrders } = useLiveStore();
const { t } = useI18n();
</script>
<template>
  <q-list>
    <OrderItem
      v-for="(order, index) in getOrders()"
      :key="index"
      :order="order"
      :is-instant="true"
    />
    <q-item v-if="getOrders().length === 0">
      <div
        class="q-pa-md text-capitalize text-weight-medium text-caption text-blue-14"
      >
        {{ t('label.no_order') }}
      </div>
    </q-item>
  </q-list>
</template>

<style scoped></style>
