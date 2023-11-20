<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useExpired, useHistory, useProgress } from './api';
import DateMasterOne from 'src/components/DateMasterOne.vue';
import dayjs from 'dayjs';
import HistoryList from './components/HistoryList.vue';
import { MasterTypeNum } from 'src/utils/NumberTool';
import { useStorage } from 'vue3-storage';

const { t } = useI18n();
const router = useRouter();
const { data: history, loading, refresh: reStory } = useHistory();
const { data: progress, refresh: reProgress } = useProgress();
const { data: expireds, refresh: reExpired } = useExpired();
// DOM
const dateRange = reactive({
  from: dayjs().startOf('week').format('YYYY-MM-DD HH:mm'),
  to: dayjs().endOf('week').format('YYYY-MM-DD HH:mm'),
});
const current = ref(1);
const type = ref(5);
const filterOrders = computed(() => {
  const useOrders = () => {
    switch (tab.value) {
      case 'finish':
        return history.value;
      case 'someProgress':
        return progress.value;
      case 'fail':
        return expireds.value;
      default:
        return [];
    }
  };
  const pureOrder = useOrders();
  if (!pureOrder) return [];

  const result = pureOrder
    .filter((order) => {
      const date = dayjs(order?.Date.replaceAll('.', '-'));
      const from = dayjs(dateRange.from.replaceAll('.', '-'));
      const to = dayjs(dateRange.to.replaceAll('.', '-'));
      return (
        (date.isAfter(from) && date.isBefore(to)) ||
        date.isSame(from) ||
        date.isSame(to)
      );
    })
    .filter((record) => {
      if (type.value === 5) return true;
      if (tab.value === 'fail' && useStorage().getStorageSync('isAgent')) {
        switch (type.value) {
          case MasterTypeNum.Buy:
            return record.MasterType === MasterTypeNum.Sell;
          case MasterTypeNum.Sell:
            return record.MasterType === MasterTypeNum.Buy;
          case MasterTypeNum.TransIn:
            return record.MasterType === MasterTypeNum.TransOut;
          case MasterTypeNum.TransOut:
            return record.MasterType === MasterTypeNum.TransIn;
          default:
            return false;
        }
      }
      return record.MasterType === type.value;
    });
  return result;
});
const useOrders = computed(
  () =>
    filterOrders.value
      .slice()
      .sort((a, b) =>
        dayjs(b.Date.replaceAll('.', '-')).isBefore(
          dayjs(a.Date.replaceAll('.', '-'))
        )
          ? -1
          : 0
      )
      .slice((current.value - 1) * 5, (current.value - 1) * 5 + 5) // page
);
const maxPaination = computed(() =>
  Math.floor((filterOrders.value.length + 4) / 5)
);
const tab = ref('finish');
</script>
<template>
  <q-page class="width900">
    <q-card class="myshadow q-pt-md">
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
      <q-card class="q-pa-sm q-mb-sm">
        <q-tabs
          dense
          rounded-borders
          v-model="tab"
          active-color="white"
          active-bg-color="blue-13"
          class="text-grey-8 bg-white"
          align="right"
          style="height: 45px"
          indicator-color="transparent"
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
        <q-separator class="q-mb-md" />
        <div class="row">
          <div class="col-sm-5 col-12">
            <DateMasterOne
              v-model:from="dateRange.from"
              v-model:to="dateRange.to"
            />
          </div>
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
              @update:type="() => (current = 1)"
              v-model:type="type"
              :orders="useOrders"
              :loading="loading"
              :is-expired="status === 'fail'"
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
  </q-page>
</template>

<style scoped></style>
