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
        {{ formatRates.buy }}
      </div>
    </div>

    <div class="flex justify-end">
      <div class="text-right q-mr-xs">
        {{ $t('rate.sell') }}
      </div>
      <div class="text-right text-weight-bold text-red">
        {{ formatRates.sell }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores';

const { formatRates } = useStateStore();
</script>

<style scoped></style>
