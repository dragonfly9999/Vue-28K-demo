<script setup lang="ts">
import OrderItem from 'src/components/OrderItem.vue';
import { useI18n } from 'vue-i18n';
import { useLiveStore, usePendingStore } from 'src/stores';
import { computed, toRefs } from 'vue';
import { useStorage } from 'vue3-storage';
import PendingItem from 'src/components/PendingItem.vue';
import dayjs from 'dayjs';

const { getOrders } = useLiveStore();
const { pendingInstant } = toRefs(usePendingStore());
const { t } = useI18n();
// DOM
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
</script>
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
    :disable="
      !(
        getOrders('progress').length !== 0 ||
        (pendingInstant?.data?.length ?? 0) !== 0
      )
    "
  >
    <q-badge
      color="red"
      floating
      v-if="
        getOrders('progress').length > 0 ||
        (pendingInstant?.data?.length ?? 0) > 0
      "
    >
      {{ getOrders('progress').length || pendingInstant?.data?.length }}
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
            v-for="(order, index) in getOrders('progress')?.sort((a, b) =>
              dayjs(b.CreateDate.replaceAll('.', '-')).isAfter(
                dayjs(a.CreateDate.replaceAll('.', '-'))
              )
                ? 0
                : -1
            )"
            :key="index"
            :order="order"
            :is-instant="false"
          />
        </div>
        <div v-else>
          <pending-item
            v-for="(order, index) in pendingInstant?.data"
            :key="index"
            :order="order"
          />
        </div>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<style scoped></style>
