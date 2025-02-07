<template>
  <q-stepper
    v-if="
      isAgent
        ? order?.MasterType === MasterTypeNum.Buy
        : order?.MasterType === MasterTypeNum.Sell
    "
    :model-value="stepFormat"
    contracted
    color="blue-13"
    animated
    class="q-mb-md no-shadow"
    header-class="no-border"
    style="border-bottom-left-radius: 30px; border-bottom: 1px solid #f0f0f0"
  >
    <q-step :name="1" prefix="1" title="步驟一" :done="stepFormat > 1">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_1') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_1') }}
      </div>
    </q-step>

    <q-step :name="2" prefix="2" title="步驟二" :done="stepFormat > 2">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_2') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_2') }}
      </div>
    </q-step>

    <q-step :name="3" prefix="3" title="步驟三" :done="stepFormat > 3">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_3') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_3') }}
      </div>
    </q-step>

    <q-step :name="4" prefix="4" title="步驟四" :done="stepFormat > 4">
      <div class="text-h6 text-weight-bold">
        {{ $t('sell.step_hint_sell_title_4') }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ $t('sell.step_hint_sell_text_4') }}
      </div>
    </q-step>
  </q-stepper>

  <q-stepper
    v-else
    :model-value="stepFormat"
    contracted
    color="blue-13"
    animated
    class="q-mb-md no-shadow"
    style="border-bottom-left-radius: 30px; border-bottom: 1px solid #f0f0f0"
    header-class="no-border"
  >
    <q-step :name="1" prefix="1" title="步驟一" :done="stepFormat > 1">
      <!-- 步驟title 提交訂單 -->
      <div class="text-h6 text-weight-bold">
        {{ $t('buy.step_hint_buy_title_1') }}
      </div>
      <!-- 請填寫訂單資料 -->
      <div class="text-grey-6">
        {{ $t('buy.step_hint_buy_text_1') }}
      </div>
    </q-step>

    <q-step :name="2" prefix="2" title="步驟二" :done="stepFormat > 2">
      <div class="text-h6 text-weight-bold">
        {{ $t('buy.step_hint_buy_title_2') }}
      </div>
      <div class="text-grey-6">
        {{ $t('buy.step_hint_buy_text_2') }}
      </div>
    </q-step>

    <q-step :name="3" prefix="3" title="步驟三" :done="stepFormat > 3">
      <div class="text-h6 text-weight-bold">
        {{ $t('buy.step_hint_buy_title_3') }}
      </div>
      <div class="text-grey-6">
        {{ $t('buy.step_hint_buy_text_3') }}
      </div>
      <div v-if="isAgent" class="text-body2">
        <q-separator />
        <div class="flex full-width text-subtitle1">
          <div class="q-pr-md">金額: {{ thousandInput(order?.D2) }}</div>
          <div>USDT: {{ thousandInput(order?.UsdtAmt) }}</div>
        </div>
        <span class="text-h6 text-weight-bold text-blue"> 收款方 </span>
        <div>姓名: {{ order?.P2 }}</div>
        <div>銀行帳號: {{ order?.P1 }}</div>
        <div>銀行名稱: {{ order?.P3 }}</div>
        <div>所在省市: {{ order?.P4 }}</div>
      </div>
    </q-step>

    <q-step :name="4" prefix="4" title="步驟四" :done="stepFormat > 4">
      <div class="text-h6 text-weight-bold">
        {{ $t('buy.step_hint_buy_title_4') }}
      </div>
      <div class="text-grey-6">
        {{ $t('buy.step_hint_buy_text_4') }}
      </div>
    </q-step>
  </q-stepper>
</template>

<script setup lang="ts">
import { OrderStatusNum } from 'src/stores/live';
import { MasterTypeNum, thousandInput } from 'src/utils/NumberTool';
import { computed, ref } from 'vue';
import { storageHelper } from 'src/utils/foragePkg';

// Definition
const props = defineProps<{ order?: OrderStatus }>();

// DOM
const isAgent = ref(storageHelper<boolean>('isAgent').getItem());
const stepFormat = computed(() => {
  switch (props.order?.Order_StatusID) {
    case undefined:
      return 1;
    case OrderStatusNum.Assigned:
      return 2;
    case OrderStatusNum.Committed:
      return 3;
    case OrderStatusNum.Complete:
      return 4;
    case OrderStatusNum.Appeal: {
      if (isAgent.value) {
        return props.order.MasterType === MasterTypeNum.Buy ? 3 : 2;
      } else {
        return props.order.MasterType === MasterTypeNum.Buy ? 2 : 3;
      }
    }
    default:
      return 0;
  }
});
</script>
