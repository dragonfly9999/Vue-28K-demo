<template>
  <q-btn
    :loading="pendingInstant.loading"
    no-caps
    rounded
    unelevated
    color="blue-13"
    :label="t('label.inProgress')"
    style="width: fit-content"
    class="q-px-sm"
    padding="5px 20px"
    :disable="isDisable"
  >
    <q-badge
      color="red"
      floating
      v-if="
        getOrders('progress').length > 0 || (pendingOrders?.length ?? 0) > 0
      "
    >
      {{ getOrders('progress').length || pendingOrders?.length }}
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
        <div v-if="isAgent">
          <order-item
            v-for="(order, index) in orders"
            :key="index"
            :order="order"
            :is-instant="false"
          />
        </div>
        <div v-else-if="pendingInstant.loading">
          <q-item
            clickable
            v-ripple
            class="q-pa-md"
            v-for="(order, index) in pendingOrders"
            :key="index"
          >
            <q-skeleton type="rect" width="260px" height="130px" />
          </q-item>
        </div>

        <div v-else>
          <pending-item
            v-for="(order, index) in pendingOrders"
            :key="index"
            :order="order"
          />
        </div>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useI18n } from 'vue-i18n';
import { useLiveStore, usePendingStore } from 'src/stores';
import { computed } from 'vue';
import { useStorage } from 'vue3-storage';
import PendingItem from 'src/components/PendingItem.vue';
import dayjs from 'dayjs';

const { getOrders } = useLiveStore();
const { pendingInstant } = usePendingStore();
const { t } = useI18n();
// DOM
const pendingOrders = computed(() => pendingInstant.data);
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
const isDisable = computed(() => {
  if (isAgent.value) {
    return getOrders('progress').length === 0;
  }
  return pendingOrders.value && pendingOrders.value.length === 0;
});
const orders = computed(() => {
  const pureOrders = getOrders('progress').slice();
  const makeupOrders = pureOrders.sort((a, b) =>
    dayjs(b.CreateDate).isAfter(dayjs(a.CreateDate)) ? 1 : -1
  );
  return makeupOrders;
});
</script>

<style scoped></style>
