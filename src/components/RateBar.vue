<script setup lang="ts">
defineProps<{ rate?: RateRes }>();
</script>

<template>
  <div
    class="flex items-center justify-between text-blue-grey-3 text-caption q-mr-xl"
  >
    <div class="q-mr-xs">CNY {{ $t('rate.title') }}</div>
    <div class="flex justify-end q-mr-sm">
      <div class="text-right q-mr-xs">
        {{ $t('rate.buy') }}
      </div>
      <div class="text-right text-weight-bold text-blue-13">
        {{ rate?.RMB_BUY }} /USDT
      </div>
    </div>

    <div class="flex justify-end">
      <div class="text-right q-mr-xs">
        {{ $t('rate.sell') }}
      </div>
      <div class="text-right text-weight-bold text-red">
        {{ rate?.RMB_SELL }} /USDT
      </div>
    </div>
  </div>
</template>

<style scoped></style>
