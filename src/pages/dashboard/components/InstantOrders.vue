<script setup lang="ts">
import dayjs from 'dayjs';
import OrderItem from 'src/components/OrderItem.vue';
import { useLiveStore } from 'src/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const orders = computed(() =>
  useLiveStore()
    .getOrders('instant')
    ?.sort((a, b) => (dayjs(b.CreateDate).isAfter(a.CreateDate) ? 1 : 0))
);
</script>
<template>
  <q-list>
    <OrderItem
      v-for="(order, index) in orders"
      :key="index"
      :order="order"
      :is-instant="true"
    />
    <q-item v-if="orders?.length === 0">
      <div
        class="q-pa-md text-capitalize text-weight-medium text-caption text-blue-14"
      >
        {{ t('label.no_order') }}
      </div>
    </q-item>
  </q-list>
</template>

<style scoped></style>
