<template>
  <q-list>
    <live-order-item
      v-for="(order, index) in pureOrders"
      :key="index"
      :order="order"
      :is-instant="true"
    />
    <q-item v-if="pureOrders.length === 0">
      <div class="q-pa-md text-capitalize text-weight-medium text-blue-14">
        {{ $t('沒有訂單') }}
      </div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import LiveOrderItem from 'src/components/LiveOrderItem.vue';
import { useLiveStore } from 'src/stores';
import { computed } from 'vue';

const { liveOrders } = useLiveStore();
const pureOrders = computed(() =>
  liveOrders.instant
    .filter(() => true)
    ?.sort((a, b) => (dayjs(b.CreateDate).isAfter(a.CreateDate) ? 1 : 0))
);
</script>

<style scoped></style>
