<template>
  <q-item
    :class="{ inPage: isInPage }"
    v-ripple
    @click="
      () =>
        router.push({
          name: order?.MasterType === MasterTypeNum.Buy ? 'buy' : 'sell',
          query: { token: order.token },
        })
    "
    clickable
  >
    <q-item-section class="q-pa-xs">
      <!-- title -->
      <div class="flex no-wrap q-gutter-x-sm items-center">
        <div>
          <!-- type ##### class 注意空格 -->
          <div
            :class="
              'text-h6 text-' + orderInfo(order).color + ' text-weight-bold'
            "
          >
            {{ orderInfo(order).label }}
          </div>
          <!-- currency -->
          <q-badge :color="orderInfo(order).color">USDT/CNY</q-badge>
        </div>
        <q-space />

        <!-- 數量 -->
        <div class="items-center text-right">
          <div class="text-caption text-grey-7">
            {{ $t('transaction.數量') }}<span>(USDT)</span>
          </div>
          <div
            :class="
              'text-body1 text-weight-bold text-' + orderInfo(order).color
            "
          >
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
              {{ dayjs(order.Date).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <q-space />
        <!-- 狀態  Order_StatusID: 32=> 等待配對中, 33 => 等待付款, 34 => 等待確認中, 35 => 申訴,-->
        <div class="q-gutter-sm">
          <div class="q-gutter-sm column items-end justify-end">
            <q-badge :label="$t('訊息') + ': ' + getCount(order?.token)" />
            <status-master :order="fakeLiveOrder" />
          </div>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MasterTypeNum } from 'src/utils/NumberTool';
import { useI18n } from 'vue-i18n';
import { thousandTool } from 'src/utils/NumberTool';
import dayjs from 'dayjs';
import { useThirdStore } from 'src/stores';
import { computed } from 'vue';
import StatusMaster from 'src/pages/transaction/components/StatusMaster.vue';
import { MtTypeNum } from 'src/stores/live';
import { useRoute } from 'vue-router';

const props = defineProps<{ order: PendingOrder }>();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { getCount } = useThirdStore();
// DOM
const orderInfo = (order: PendingOrder) => {
  switch (order.MasterType) {
    case MasterTypeNum.Buy:
      return { label: t('label.buy'), color: 'blue-13' };
    case MasterTypeNum.Sell:
      return { label: t('label.sell'), color: 'red' };
    default: {
      return { label: t('label.undefined'), color: 'purple' };
    }
  }
};
const fakeLiveOrder = computed(() => {
  const order: LiveOrder = {
    Order_StatusID: props.order.Order_StatusID,
    MType:
      props.order.MasterType === MasterTypeNum.Buy
        ? MtTypeNum.Buy
        : MtTypeNum.Sell,
    DeltaTime: 0,
    UsdtAmt: 0,
    D1: 0,
    D2: 0,
    CreateDate: '',
    P5: '',
    extraInfo: null,
    token: '',
  };
  return order;
});

const isInPage = computed(() => {
  if (!route.name || !['buy', 'sell'].includes(route.name as string))
    return false;
  return route.query.token === props.order.token;
});
</script>

<style scoped lang="scss">
.inPage {
  background-color: rgba(255, 230, 188, 0.507);
}
</style>
