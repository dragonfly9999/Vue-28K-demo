<template>
  <span>
    <!-- 當Button進入loading時網頁會警告訊息: Consider marking event handler as 'passive' to make the page more responsive. -->
    <q-btn
      :loading="pendingInstant.loading"
      no-caps
      rounded
      unelevated
      color="blue-13"
      :label="t('dashboard.進行中')"
      style="width: fit-content"
      class="q-px-sm"
      padding="5px 20px"
      :disable="isDisable"
    >
      <q-badge
        color="red"
        floating
        v-if="
          liveOrders.progress.length > 0 || (pendingOrders?.length ?? 0) > 0
        "
      >
        {{ liveOrders.progress.length || pendingOrders?.length }}
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
            <live-order-item
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
  </span>
</template>

<script setup lang="ts">
import LiveOrderItem from 'src/components/LiveOrderItem.vue';
import { useI18n } from 'vue-i18n';
import { useLiveStore, usePendingStore } from 'src/stores';
import { computed, ref } from 'vue';
import PendingItem from 'src/components/PendingItem.vue';
import dayjs from 'dayjs';
import { storageHelper } from 'src/utils/foragePkg';

// Definition
const { liveOrders } = useLiveStore();
const { pendingInstant } = usePendingStore();
const { t } = useI18n();
// DOM
const isAgent = ref(storageHelper('isAgent').getItem());

// Compute
const pendingOrders = computed(() => pendingInstant.data);
const isDisable = computed(() => {
  if (isAgent.value) {
    return liveOrders.progress.length === 0;
  }
  return pendingOrders.value && pendingOrders.value.length === 0;
});
const orders = computed(() => {
  const pureOrders = liveOrders.progress.slice();
  const makeupOrders = pureOrders.sort((a, b) =>
    dayjs(b.CreateDate).isAfter(dayjs(a.CreateDate)) ? 1 : -1
  );
  return makeupOrders;
});
</script>

<style scoped></style>
