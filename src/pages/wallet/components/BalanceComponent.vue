<script setup lang="ts">
import usdt from 'src/assets/USDT.png';
import { useStateStore } from 'src/stores';
import { thousandInput } from 'src/utils/NumberTool';

const { getBalance } = useStateStore();
</script>
<template>
  <div>
    <div class="flex items-center justify-between q-pa-md q-ma-sm">
      <div class="flex items-center">
        <img :src="usdt" style="margin: 0 0.3rem" />
        <div class="text-h6 text-weight-bold">USDT</div>
      </div>

      <div v-if="getBalance()?.Real_Balance === null">
        <q-spinner-dots class="q-mx-sm" color="blue-13" size="1.5em" />
      </div>
      <div v-else>
        <div class="flex items-center justify-end q-gutter-x-sm">
          <!-- 結餘 -->
          <div>{{ $t('wallet.label.real_balance') }}</div>
          <div class="text-body1 text-weight-bold text-green-9">
            {{ thousandInput(getBalance()?.Real_Balance) }}
          </div>
        </div>

        <div class="flex items-center justify-end q-gutter-x-sm">
          <!-- 可提 -->
          <div>{{ $t('wallet.label.avb_balance') }}</div>
          <div class="text-body1 text-weight-bold text-green-9">
            {{ thousandInput(getBalance()?.Avb_Balance) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
