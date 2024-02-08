<template>
  <div>
    <div class="flex items-center justify-between q-pa-md q-ma-sm">
      <div class="flex items-center">
        <img :src="usdt" style="margin: 0 0.3rem" />
        <div class="text-h6 text-weight-bold">USDT</div>
      </div>

      <div v-if="balanceRequest.loading">
        <q-spinner-dots class="q-mx-sm" color="blue-13" size="1.5em" />
      </div>
      <div v-else>
        <div class="flex items-center justify-end q-gutter-x-sm">
          <!-- 結餘 -->
          <div>{{ $t('wallet.label.real_balance') }}</div>
          <div class="text-body1 text-weight-bold text-green-9">
            {{ formatBalances.actual }}
          </div>
        </div>

        <div class="flex items-center justify-end q-gutter-x-sm">
          <!-- 可提 -->
          <div>{{ $t('wallet.label.avb_balance') }}</div>
          <div class="text-body1 text-weight-bold text-green-9">
            {{ formatBalances.available }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import usdt from 'src/assets/USDT.png';
import { useStateStore } from 'src/stores';

const { formatBalances, balanceRequest } = useStateStore();
</script>
