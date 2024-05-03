<template>
  <q-list>
    <live-order-item
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
        {{ $t('main.沒有訂單') }}
      </div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import LiveOrderItem from 'src/components/LiveOrderItem.vue';
import { useLiveStore } from 'src/stores';
import dayjs from 'dayjs';
import { computed } from 'vue';

const { liveOrders } = useLiveStore();
// DOM
const orders = computed(
  () =>
    liveOrders.progress
      .slice()
      ?.sort((a, b) => (dayjs(b.CreateDate).isAfter(a.CreateDate) ? 1 : -1)) ??
    []
);
</script>
