<template>
  <q-layout view="hHh lpr fff">
    <HeaderMaster />
    <!-- Body -->
    <q-page-container>
      <q-page-sticky expand position="top">
        <q-toolbar class="bg-white myshadow">
          <ProgressBtn />
          <div
            style="border-radius: 15px"
            class="relative-position text-caption cursor-pointer q-pa-sm"
            v-ripple.early
            @click="() => router.push({ name: 'wallet' })"
          >
            <div class="flex items-center justify-end">
              <div class="text-caption q-mr-xs">
                {{ $t('label.real_balance') }}:
              </div>
              <div class="flex items-center">
                <q-spinner-ios
                  color="blue-13"
                  size="1em"
                  v-if="balanceLoading"
                />
                <div class="text-green-9">
                  {{ thousandTool(balance?.AgtBalance, 3) }} USDT
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end">
              <div class="text-caption q-mr-xs">
                {{ $t('label.avb_balance') }}:
              </div>
              <div class="flex items-center">
                <q-spinner-ios
                  color="blue-13"
                  size="1em"
                  v-if="balanceLoading"
                />
                <div class="text-green-9">
                  {{ thousandTool(balance?.Avb_Balance, 3) }} USDT
                </div>
              </div>
            </div>
          </div>
        </q-toolbar>
      </q-page-sticky>
      <div class="flex justify-center q-pa-md q-mt-xl" style="width: 100%">
        <div style="width: 100%" class="q-gutter-sm q-mt-md">
          <router-view></router-view>
        </div>
      </div>
    </q-page-container>
    <!-- footer -->
    <q-footer class="text-white" style="background: #242e47">
      <div class="wrap">
        <div>
          <div class="flex">
            <div class="col-12 col-md">
              <div class="flex items-center">
                <q-img
                  src="../assets/logo_easy.png"
                  width="130px"
                  class="q-mr-sm"
                />
              </div>
            </div>
            <div
              class="col-12 col-md gt-sm flex justify-end text-subtitle1 text-right"
            ></div>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>

  <!-- <DrawerMaster /> -->
</template>

<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
import { useRouter } from 'vue-router';
import { useBalance, useRate } from './api';
import ProgressBtn from './components/ProgressBtn.vue';
import HeaderMaster from './components/HeaderMaster.vue';
import { onMounted } from 'vue';
import DrawerMaster from './components/DrawerMaster.vue';

const { data: balance, loading: balanceLoading } = useBalance();
const router = useRouter();

onMounted(() => {
  useRate();
});
</script>

<style scoped>
.sticky {
  background: linear-gradient(
    360deg,
    rgba(233, 243, 248, 0.9) 118.6%,
    rgba(169, 224, 248, 0.9) 50.29%
  );
  line-height: 0.3;
}
</style>
