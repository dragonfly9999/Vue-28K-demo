<template>
  <div class="bg-green-1 text-green-10 q-pa-md">
    {{ $t('kyc.listHint.failed') }}
  </div>
  <div class="row">
    <div
      v-for="(kycInfo, index) in failedKycs"
      :key="index"
      class="col-12 col-md-4 col-sm-6"
    >
      <bank-card :kyc-info="kycInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FormatKycOptions } from '../api/useKycHistory';
import BankCard from './BankCard.vue';

const props = defineProps<{ tempKycs: Array<FormatKycOptions> }>();

const failedKycs = computed(() =>
  props.tempKycs.filter((kycInfo) => kycInfo.User_BankStatus === -1)
);
</script>
<style scoped></style>
