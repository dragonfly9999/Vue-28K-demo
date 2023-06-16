<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useI18n } from 'vue-i18n';
import { useLiveStore } from 'src/stores';

const { getOrders } = useLiveStore();

const { t } = useI18n();
</script>
<template>
  <q-btn
    no-caps
    rounded
    unelevated
    color="blue-13"
    :label="t('label.inProgress')"
    style="width: fit-content"
    class="lt-xs q-px-sm"
    :disable="getOrders('progress').length === 0"
  >
    <q-badge color="red" floating v-if="getOrders('progress').length > 0">
      {{ getOrders('progress').length }}
    </q-badge>

    <q-menu
      :offset="[160, 10]"
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-list
        bordered
        class="rounded-borders q-pa-xs"
        style="min-width: fit-content"
      >
        <order-item
          v-for="(order, index) in getOrders('progress')"
          :key="index"
          :order="order"
          :is-instant="false"
        />
      </q-list>
    </q-menu>
  </q-btn>
</template>

<style scoped></style>
