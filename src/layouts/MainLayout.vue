<template>
  <q-layout view="hHh lpr fff">
    <HeaderMaster />
    <!-- Body -->
    <q-page-container>
      <q-page-sticky expand position="top" style="z-index: 5">
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
      <div class="flex justify-center q-pa-md q-mt-xl" style="min-width: 100%">
        <div>
          {{ $t('翻譯') }}
        </div>

        <router-view></router-view>
      </div>
    </q-page-container>
    <!-- footer -->
    <!-- <q-footer class="text-white q-pa-lg" style="background: #242e47">
      <div class="wrap">
        <div>
          <div class="flex">
            <div class="col-12 col-md">
              <div class="flex items-center">
                <q-img :src="logo" width="130px" class="q-mr-sm" />
              </div>
            </div>
            <div
              class="col-12 col-md gt-sm flex justify-end text-subtitle1 text-right"
            ></div>
          </div>
        </div>
      </div>
    </q-footer> -->
  </q-layout>
  <!-- sound -->
  <div>
    <audio :volume="0.5" loop :src="instantSound" ref="instantAudio" />
    <audio :src="matchSound" ref="matchAudio" />
    <audio loop :src="paymentSound" ref="paymentAudio" />
    <audio loop :src="appealSound" ref="appealAudio" />
  </div>
</template>

<script setup lang="ts">
import logo from 'src/assets/logo_easy.png';
import { thousandTool } from 'src/utils/NumberTool';
import { useRouter } from 'vue-router';
import { useBalance, useRate } from './api';
import ProgressBtn from './components/ProgressBtn.vue';
import HeaderMaster from './components/HeaderMaster.vue';
import { onMounted, ref, toRefs, watch } from 'vue';
import { useAccessyStore, useLiveStore } from 'src/stores';
import instantSound from 'src/assets/sound/instants5.mp3';
import matchSound from 'src/assets/sound/match.mp3';
import paymentSound from 'src/assets/sound/payment2.mp3';
import appealSound from 'src/assets/sound/owl.mp3';
import { MtTypeNum, OrderStatusNum } from 'src/stores/live';
import { useStorage } from 'vue3-storage';

useRate();
const { data: balance, loading: balanceLoading } = useBalance();

//
const { hint } = toRefs(useAccessyStore());
const { setOnMessage, setOrders } = useLiveStore();
const { getAccess } = useAccessyStore();
const router = useRouter();
// DOM
const instantAudio = ref();
const matchAudio = ref();
const paymentAudio = ref();
const appealAudio = ref();
const handleResetSound = () => {
  if (instantAudio?.value) {
    instantAudio.value?.pause();
    instantAudio.value.currentTime = 0;
  }
  if (matchAudio?.value) {
    matchAudio.value?.pause();
    matchAudio.value.currentTime = 0;
  }
  if (paymentAudio?.value) {
    paymentAudio.value?.pause();
    paymentAudio.value.currentTime = 0;
  }
  if (appealAudio?.value) {
    appealAudio.value?.pause();
    appealAudio.value.currentTime = 0;
  }
};

onMounted(() => {
  const login_session = useStorage().getStorageSync('login_session');
  setOrders(login_session);
  // sound
  setOnMessage({
    type: 'instant',
    fn: (OrderFromServer) => {
      handleResetSound();
      setTimeout(() => {
        if (
          OrderFromServer &&
          OrderFromServer?.length > 0 &&
          getAccess().hint &&
          instantAudio.value
        ) {
          instantAudio.value.play();
        }
      }, 100);
    },
  });
  setOnMessage({
    type: 'progress',
    fn: (OrderFromServer) => {
      handleResetSound();
      setTimeout(() => {
        if (
          OrderFromServer &&
          OrderFromServer?.length > 0 &&
          getAccess().hint
        ) {
          let flag = true;
          [
            OrderStatusNum.Committed,
            OrderStatusNum.Assigned,
            OrderStatusNum.Appeal,
          ].forEach((statusID) => {
            OrderFromServer?.forEach((order: LiveOrder) => {
              if (flag && order.Order_StatusID === statusID) {
                switch (statusID) {
                  case OrderStatusNum.Assigned:
                    matchAudio.value?.play();
                    flag = false;
                    break;
                  case OrderStatusNum.Committed:
                    if (order.MType === MtTypeNum.Sell) {
                      paymentAudio.value?.play();
                      flag = false;
                    }
                    break;
                  case OrderStatusNum.Appeal:
                    if (order.MType === MtTypeNum.Buy) {
                      appealAudio.value?.play();
                      flag = false;
                      return;
                    }
                    break;
                }
              }
            });
          });
        }
      }, 100);
    },
  });
});
watch(hint, (newValue) => {
  if (!newValue) handleResetSound();
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
