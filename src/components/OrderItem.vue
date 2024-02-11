<template>
  <q-item
    :class="{ inPage: isInPage }"
    :clickable="!isInstant"
    v-ripple
    @click="handleClickItem"
  >
    <q-item-section class="q-pa-xs">
      <!-- title -->
      <div class="flex no-wrap q-gutter-x-sm items-center">
        <div>
          <!-- type ##### class 注意空格 -->
          <div :class="'text-h6 text-' + orderInfo.color + ' text-weight-bold'">
            {{ `${orderInfo.label} ${channelLabel}` }}
          </div>
          <!-- currency -->
          <q-badge :color="orderInfo.color">USDT/{{ currency }}</q-badge>
        </div>
        <q-space />

        <!-- 數量 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.數量') }}<span>(USDT)</span>
          </div>
          <div :class="'text-body1 text-weight-bold text-' + orderInfo.color">
            {{ thousandTool(order.UsdtAmt, 'USDT') }}
          </div>
        </div>
        <!-- 金額 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.amount') }}<span>(CNY)</span>
          </div>
          <div class="text-body1">{{ thousandTool(order.D2, 'CNY') }}</div>
        </div>
      </div>
      <div class="flex no-wrap q-py-sm items-end">
        <div class="q-gutter-xs">
          <!-- 代理顯示 交易方姓名 -->
          <div class="flex" v-if="isAgent">
            <div class="text-caption text-grey-6">交易方姓名：</div>
            <div class="text-caption">{{ order?.P5?.split('|')?.[0] }}</div>
          </div>
          <div class="flex">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.rate') }}
            </div>
            <!-- rate -->
            <div class="text-caption">{{ thousandTool(order.D1, 'CNY') }}</div>
          </div>
          <div class="flex">
            <div class="text-caption text-grey-6 q-mr-xs">
              {{ $t('transaction.time') }}
            </div>
            <!-- 日期 -->
            <div class="text-caption">
              {{ dayjs(order.CreateDate).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <q-space />
        <!-- 狀態  Order_StatusID: 32=> 等待配對中, 33 => 等待付款, 34 => 等待確認中, 35 => 申訴,-->
        <div class="q-gutter-sm">
          <div class="q-gutter-sm column items-end justify-end">
            <q-badge
              :label="$t('transaction.訊息') + ': ' + getCount(order.token)"
              v-if="!isInstant"
            />
            <status-master :order="order" />
          </div>
          <div v-if="isInstant">
            <q-btn
              :loading="loadingBuy || loadingSell"
              @click="handleMatch"
              rounded
              unelevated
              icon="shopping_bag"
              color="blue-13"
              :disable="order.MType === MtTypeNum.CantTake"
            >
              開始交易
            </q-btn>
          </div>
        </div>
      </div>
    </q-item-section>
    <!-- 詳細內容 -->
  </q-item>
</template>

<script setup lang="ts">
import { thousandTool } from 'src/utils/NumberTool';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
import dayjs from 'dayjs';
import { MtTypeNum } from 'src/stores/live';
import api from './api';
import {
  useKeyStore,
  useOrderStore,
  useStateStore,
  useThirdStore,
} from 'src/stores';
import { copyToClipboard, useQuasar } from 'quasar';
import StatusMaster from 'src/pages/trade/TradingComponents/StatusMaster.vue';
import { useRoute } from 'vue-router';
const quasar = useQuasar();
const props = defineProps<{
  order: LiveOrder;
  isInstant: boolean;
  isCleanCount?: boolean;
}>();

//
const { currency } = useStateStore();
const { pressing } = useKeyStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const storage = useStorage();
const { setOrderWs } = useOrderStore();
const { setWebSockets, getCount, handleResetCount } = useThirdStore();

// dom
const isAgent = computed(() => storage.getStorageSync('isAgent'));
const channelLabel = computed(() => {
  if (!props.order.Channel) return '';
  if (props.order.Channel === -1) return 'All';
  if (props.order.Channel === 0) return 'BVAC';
  if (props.order.Channel === 1) return 'Demo K100U';
  if (props.order.Channel === 2) return '88U';
  if (props.order.Channel === 3) return 'U88';
  if (props.order.Channel === 4) return 'JP88';
  if (props.order.Channel === 5) return 'K100U com';
  if (props.order.Channel === 6) return 'U28 Exchange';
  if (props.order.Channel === 7) return 'V100U com';
  if (props.order.Channel === 9) return 'Fxcoin';
  if (props.order.Channel === 10) return 'K200U';
  if (props.order.Channel === 11) return 'K100 net';
  return props.order.Channel;
});
const orderInfo = computed(() => {
  switch (props.order.MType) {
    case MtTypeNum.Buy:
      return { label: t('label.buy'), color: 'blue-13' };
    case MtTypeNum.Sell:
      return { label: t('label.sell'), color: 'red' };
    case MtTypeNum.CantTake:
      return { label: t('label.sell'), color: 'grey' };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
});
const isInPage = computed(() => {
  if (!route.name || !['buy', 'sell'].includes(route.name as string))
    return false;
  return route.query.token === props.order.token;
});

// vue request
const { run: matchBuy, loading: loadingBuy } = api.useBuyMatch({
  onSuccess: () => {
    setWebSockets(props.order.token);
    setOrderWs(props.order.token);
  },
});
const { run: matchSell, loading: loadingSell } = api.useSellMatch({
  onSuccess: () => {
    setWebSockets(props.order.token);
    setOrderWs(props.order.token);
  },
});
// handler
const handleMatch = () => {
  if (props.order.MType === MtTypeNum.Sell) {
    matchBuy({
      Token: props.order.token,
    });
  } else {
    matchSell({
      Token: props.order.token,
    });
  }
};

const handleCopy = (value: string) => {
  copyToClipboard(value)
    .then(() => {
      quasar.notify({
        position: 'top-right',
        color: 'positive',
        message: '已複製',
      });
    })
    .catch(() => {
      quasar.notify({
        position: 'top-right',
        color: 'negative',
        message: '複製失敗',
      });
    });
};

const handleClickItem = () => {
  if (pressing() === 'Control') {
    const copyStr =
      '交易方姓名：' +
      props.order?.P5?.split('|')?.[0] +
      '\n' +
      '金額: ' +
      thousandTool(props.order.D2, 'CNY');
    handleCopy(copyStr);
  } else if (pressing() === 'c') {
    const copyStr =
      '交易方姓名：' +
      props.order?.P5?.split('|')?.[0] +
      '\n' +
      '金額(CNY): ' +
      thousandTool(props.order.D2, 'CNY');
    handleCopy(copyStr);
  } else {
    if (props.isCleanCount) handleResetCount(props.order.token);
    router.push({
      name: 'trade',
      query: {
        type: props.order?.MType === MtTypeNum.Buy ? 'buy' : 'sell',
        token: props.order.token,
        action: 'trading',
      },
    });
  }
};
</script>

<style scoped lang="scss">
.inPage {
  background-color: rgba(255, 230, 188, 0.507);
}
</style>
