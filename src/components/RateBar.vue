<template>
  <div
    class="flex items-center justify-between text-blue-grey-3 text-caption q-mr-xl"
  >
    <div class="q-mr-xs">USDT/CNY {{ $t('rate.title') }}</div>
    <div class="flex justify-end q-mr-sm">
      <div class="text-right q-mr-xs">
        {{ $t('rate.buy') }}
      </div>
      <div class="text-right text-weight-bold text-blue-13">
        {{ isAgent ? formatRates.sell : formatRates.buy }}
      </div>
    </div>

    <div class="flex justify-end">
      <div class="text-right q-mr-xs">
        {{ $t('rate.sell') }}
      </div>
      <div class="text-right text-weight-bold text-red">
        {{ isAgent ? formatRates.buy : formatRates.sell }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores';
import { computed } from 'vue';
import { useStorage } from 'vue3-storage';

const vueStorage = useStorage();
// states
const { formatRates } = useStateStore();
const isAgent = computed(() => vueStorage.getStorageSync('isAgent'));
</script>

<style scoped></style>
