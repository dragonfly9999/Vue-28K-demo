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
import { ref } from 'vue';
import { storageHelper } from 'src/utils/foragePkg';

// states
const { formatRates } = useStateStore();
const isAgent = ref(storageHelper<boolean>('isAgent').getItem());
</script>

<style scoped></style>
