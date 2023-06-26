<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useLiveStore } from 'src/stores';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

const { getOrders } = useLiveStore();
const { t } = useI18n();
</script>
<template>
  <q-list>
    <OrderItem
      v-for="(order, index) in getOrders('progress')?.sort((a, b) =>
        dayjs(b.CreateDate).isAfter(a.CreateDate) ? 0 : -1
      )"
      :key="index"
      :order="order"
      :is-instant="false"
      :is-clean-count="true"
    />
    <q-item v-if="getOrders('progress').length === 0">
      <div
        class="q-pa-md text-capitalize text-weight-medium text-caption text-blue-14"
      >
        {{ t('label.no_order') }}
      </div>
    </q-item>
  </q-list>
</template>

<style scoped></style>
