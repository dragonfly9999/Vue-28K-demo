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
      <div class="flex justify-center q-pa-md q-mt-xl" style="min-width: 100%">
        <router-view></router-view>
      </div>
    </q-page-container>
    <!-- footer -->
    <q-footer class="text-white" style="background: #242e47">
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
    </q-footer>
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
import {
  useAccessyStore,
  useCsStore,
  useLiveStore,
  useProgressStore
} from 'src/stores';
import WebSocketClient from 'src/utils/WebsocketClient';
import instantSound from 'src/assets/sound/instants5.mp3';
import matchSound from 'src/assets/sound/match.mp3';
import paymentSound from 'src/assets/sound/payment2.mp3';
import appealSound from 'src/assets/sound/owl.mp3';
import { MtTypeNum, OrderStatusNum } from 'src/stores/live';

const { hint } = toRefs(useAccessyStore());
const { data: balance, loading: balanceLoading } = useBalance();
const { setOrders, addOrders } = useLiveStore();
const { setProgress, addProgress } = useProgressStore();
const { setChats, addChats } = useCsStore();
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
// WS
const defaultOptions = {
  reconnectEnabled: true,
  reconnectInterval: 2000
};

onMounted(() => {
  useRate();
  // live order
  const liveURL = '/ws_liveorders.ashx';
  const liveWS = new WebSocketClient(liveURL, {
    ...defaultOptions,
    isChat: false
  });
  liveWS.connect();
  liveWS.onMessage = (msg) => {
    if (msg.data && typeof msg.data === 'string') {
      const OrderFromServer:
        | VirgilRes<Array<LiveOrder>>
        | VirgilRes<LiveOrder> = JSON.parse(msg.data);
      if (Array.isArray(OrderFromServer.data)) {
        setOrders(OrderFromServer.data.reverse());
        // sound
        handleResetSound();
        setTimeout(() => {
          if (
            Array.isArray(OrderFromServer.data) &&
            OrderFromServer.data?.length > 0 &&
            getAccess().hint &&
            instantAudio.value
          ) {
            instantAudio.value.play();
          }
        }, 100);
      } else {
        addOrders(OrderFromServer.data);
      }
    }
  };
  // progress order
  const progressURL = '/WS_livePendingOrders.ashx';
  const progressWS = new WebSocketClient(progressURL, {
    ...defaultOptions,
    isChat: false
  });
  progressWS.connect();
  progressWS.onMessage = (msg) => {
    if (msg.data && typeof msg.data === 'string') {
      const OrderFromServer:
        | VirgilRes<Array<LiveOrder>>
        | VirgilRes<LiveOrder> = JSON.parse(msg.data);
      if (Array.isArray(OrderFromServer.data)) {
        const progress = OrderFromServer.data;
        setProgress(progress.reverse());
        // sound
        handleResetSound();
        setTimeout(() => {
          if (progress?.length > 0 && getAccess().hint) {
            let flag = true;

            [
              OrderStatusNum.Committed,
              OrderStatusNum.Assigned,
              OrderStatusNum.Appeal
            ].forEach((statusID) => {
              progress?.forEach((order: LiveOrder) => {
                console.log('on message');
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
      } else {
        addProgress(OrderFromServer.data);
      }
    }
  };
  // CS chat
  const CsURL = '/ws_chatuser.ashx';
  const CsWS = new WebSocketClient(CsURL, { ...defaultOptions, isChat: true });
  CsWS.connect();
  CsWS.onMessage = (msg) => {
    if (msg.data && typeof msg.data === 'string') {
      const OrderFromServer: Array<ChatRes> | ChatRes = JSON.parse(msg.data);
      if (Array.isArray(OrderFromServer)) {
        setChats(OrderFromServer.reverse());
      } else {
        addChats(OrderFromServer);
      }
    }
  };
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
