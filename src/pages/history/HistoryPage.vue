<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useExpired, useHistory, useProgress } from './api';
import DateMasterOne from 'src/components/DateMasterOne.vue';
import dayjs from 'dayjs';
import HistoryList from './components/HistoryList.vue';
import { MasterTypeNum } from 'src/utils/NumberTool';

const { t } = useI18n();
const router = useRouter();
const { data: history, loading, refresh: reStory } = useHistory();
const { data: progress, refresh: reProgress } = useProgress();
const { data: expireds, refresh: reExpired } = useExpired();
// DOM
const dateRange = reactive({
  from: dayjs().startOf('week').format('YYYY-MM-DD HH:mm'),
  to: dayjs().endOf('week').format('YYYY-MM-DD HH:mm')
});
const current = ref(1);
const useOrders = computed(() => {
  let useOrders: Array<OrderRecord | ExpiredOrder> | undefined;
  switch (tab.value) {
    case 'finish': {
      useOrders = history.value;
      break;
    }
    case 'someProgress': {
      useOrders = progress.value;
      break;
    }
    case 'fail': {
      useOrders = expireds.value;
      break;
    }
    default:
      return [];
  }
  useOrders = useOrders
    ?.filter((order) => {
      switch (type.value) {
        case MasterTypeNum.Buy:
          return order?.MasterType === MasterTypeNum.Buy;
        case MasterTypeNum.Sell:
          return order?.MasterType === MasterTypeNum.Sell;
        case MasterTypeNum.TransIn:
          return order?.MasterType === MasterTypeNum.TransIn;
        case MasterTypeNum.TransOut:
          return order?.MasterType === MasterTypeNum.TransOut;
        default:
          return true;
      }
    })
    .filter((order) => {
      const date = dayjs(order?.Date);
      const from = dayjs(dateRange.from);
      const to = dayjs(dateRange.to);
      return (
        date.isSame(from) ||
        date.isSame(to) ||
        (date.isAfter(from) && date.isBefore(to))
      );
    });
  return useOrders;
});
const maxPaination = computed(() =>
  Math.floor(
    ((useOrders.value?.length === 0 ? 5 : useOrders.value?.length ?? 5) + 4) / 5
  )
);
const tab = ref('finish');
const type = ref(5);
</script>
<template>
  <q-card class="q-pt-sm">
    <div class="row">
      <div class="col-3">
        <!-- 返回btn -->
        <q-btn
          flat
          color="blue-13"
          :label="t('label.back')"
          @click="() => router.back()"
        />
      </div>
      <!-- title交易紀錄 -->
      <div
        class="col col-md flex no-wrap justify-center text-h6 text-weight-bold"
      >
        {{ $t('transaction_history.title') }}
      </div>
      <div class="col-3"></div>
    </div>
    <q-card class="q-pa-sm q-mb-sm myshadow">
      <div class="row justify-between items-center q-gutter-sm">
        <DateMasterOne
          v-model:from="dateRange.from"
          v-model:to="dateRange.to"
        />
        <q-tabs
          dense
          rounded-borders
          v-model="tab"
          indicator-color="transparent"
          active-color="white"
          active-bg-color="blue-13"
          class="text-grey-8 bg-white"
          align="right"
          style="height: 45px"
        >
          <!-- 完成tab -->
          <q-tab
            name="finish"
            @click="() => reStory()"
            :label="t('transaction_history.label.finish')"
          />
          <!-- 進行中tab -->
          <q-tab
            @click="() => reProgress()"
            name="someProgress"
            :label="t('transaction_history.label.inProgress')"
          >
            <q-badge
              v-if="progress?.length"
              color="red"
              style="float: right"
              floating
            >
              {{ progress?.length }}
            </q-badge>
          </q-tab>
          <!-- 未完成tab -->
          <q-tab
            @click="() => reExpired()"
            name="fail"
            :label="t('transaction_history.label.fail')"
          />
        </q-tabs>
      </div>
      <!-- Status Panel -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel
          :name="status"
          v-for="(status, index) in ['finish', 'someProgress', 'fail']"
          :key="index"
          class="q-pa-xs"
        >
          <HistoryList
            v-model:type="type"
            :orders="useOrders?.slice((current - 1) * 5, (current - 1) * 5 + 5)"
            :loading="loading"
          />
        </q-tab-panel>
      </q-tab-panels>

      <!-- 頁碼 -->
      <q-pagination
        v-model="current"
        :max="maxPaination"
        input
        class="q-my-md justify-center"
      />
    </q-card>
  </q-card>
</template>

<style scoped></style>
