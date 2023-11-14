<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useLiveStore } from 'src/stores';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { computed } from 'vue';

const { t } = useI18n();
// DOM
const orders = computed(() => useLiveStore().getOrders('progress'));
</script>
<template>
  <q-list>
    <OrderItem
      v-for="(order, index) in orders?.sort((a, b) =>
        dayjs(b.CreateDate.replaceAll('.', '-')).isAfter(a.CreateDate) ? 0 : -1
      )"
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

<style scoped></style>
