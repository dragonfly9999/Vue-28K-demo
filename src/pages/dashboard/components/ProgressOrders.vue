<template>
  <q-list>
    <OrderItem
      v-for="(order, index) in orders"
      :key="index"
      :order="order"
      :is-instant="false"
      :is-clean-count="true"
    />
    <q-item v-if="orders.length === 0">
      <div
        class="q-pa-md text-capitalize text-weight-medium text-caption text-blue-14"
      >
        {{ t('label.no_order') }}
      </div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useLiveStore } from 'src/stores';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { computed } from 'vue';

const { t } = useI18n();
// DOM
const orders = computed(
  () =>
    useLiveStore()
      .getOrders('progress')
      ?.sort((a, b) => (dayjs(b.CreateDate).isAfter(a.CreateDate) ? 1 : -1)) ??
    []
);
</script>
