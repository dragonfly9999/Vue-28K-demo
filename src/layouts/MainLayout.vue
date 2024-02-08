<template>
  <q-layout view="hHh lpr fff">
    <HeaderMaster />
    <!-- Body -->
    <q-page-container style="margin: auto">
      <q-page-sticky expand position="top" style="z-index: 5">
        <q-toolbar class="bg-white myshadow justify-end">
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
                  v-if="balanceRequest.loading"
                />
                <div class="text-green-9">
                  {{ formatBalances?.actual }}
                  USDT
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
                  v-if="balanceRequest.loading"
                />
                <div class="text-green-9">
                  {{ formatBalances?.available }}
                  USDT
                </div>
              </div>
            </div>
          </div>
        </q-toolbar>
      </q-page-sticky>
      <div style="margin-top: 70px">
        <router-view></router-view>
      </div>
    </q-page-container>
    <!-- sound -->
    <div>
      <audio :volume="0.5" loop :src="instantSound" ref="instantAudio" />
      <audio :src="matchSound" ref="matchAudio" />
      <audio loop :src="paymentSound" ref="paymentAudio" />
      <audio loop :src="appealSound" ref="appealAudio" />
    </div>

    <NoHintWarn v-model:visible="noHintWarn" />
  </q-layout>
</template>

<script setup lang="ts">
import NoHintWarn from './components/NoHintWarn.vue';
import { useRouter } from 'vue-router';
import ProgressBtn from './components/ProgressBtn.vue';
import HeaderMaster from './components/HeaderMaster.vue';
import {
  onBeforeUnmount,
  onErrorCaptured,
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue';
import { useLiveStore, useStateStore, useThirdStore } from 'src/stores';
import instantSound from 'src/assets/sound/instants5.mp3';
import matchSound from 'src/assets/sound/match.mp3';
import paymentSound from 'src/assets/sound/payment2.mp3';
import appealSound from 'src/assets/sound/owl.mp3';
import { MtTypeNum, OrderStatusNum } from 'src/stores/live';
import { useStorage } from 'vue3-storage';
import { useKeyStore } from 'src/stores/key';
import hooks from 'src/hooks';

//
const { balanceRequest, formatBalances } = useStateStore();

const { handleRemove, handelSet } = useKeyStore();
const { hint } = toRefs(useThirdStore());
const { setOnMessage, setLiveOrderWs, setPendingOrderWs } = useLiveStore();
const router = useRouter();
const vueStorage = useStorage();
// DOM
const instantAudio = ref<HTMLAudioElement>();
const matchAudio = ref<HTMLAudioElement>();
const paymentAudio = ref<HTMLAudioElement>();
const appealAudio = ref<HTMLAudioElement>();
const noHintWarn = ref(false);
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

//
onMounted(() => {
  setLiveOrderWs();
  setPendingOrderWs();

  // hint
  const isAgent = vueStorage.getStorageSync('isAgent');
  if (!hint.value && isAgent && import.meta.env.PROD) {
    noHintWarn.value = true;
  }

  // sound
  setOnMessage({
    type: 'instant',
    messageName: 'Hint sound',
    fn: (OrderFromServer) => {
      handleResetSound();
      setTimeout(() => {
        if (
          OrderFromServer &&
          OrderFromServer?.length > 0 &&
          hint.value &&
          instantAudio.value
        ) {
          instantAudio.value.play();
        }
      }, 100);
    },
  });
  setOnMessage({
    type: 'progress',
    messageName: 'Hint sound',
    fn: (OrderFromServer) => {
      handleResetSound();
      setTimeout(() => {
        if (OrderFromServer && OrderFromServer?.length > 0 && hint.value) {
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
  // keyboard
  handelSet();
});
onBeforeUnmount(() => {
  handleRemove();
});

onErrorCaptured((error) => {
  hooks.useInfoNotify(error.message);
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
