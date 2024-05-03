<template>
  <div class="q-gutter-y-md q-mt-md width900">
    <!-- 交易列表 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center q-mr-md">
        <q-img :src="progressPng" width="20px" />
        <div class="text-h6 text-weight-bold">
          {{ isAgent ? $t('dashboard.即時訂單') : $t('dashboard.交易進行中') }}
        </div>
      </div>
      <div class="flex items-center" v-if="isAgent">
        <!-- 通知 -->
        <q-toggle
          dense
          class="q-mr-md"
          color="blue-13"
          :label="$t('main.notify')"
          left-label
          checked-icon="notifications"
          unchecked-icon="notifications_off"
          :model-value="false"
          disable
        >
          <q-tooltip>
            {{ $t('main.notify_hint') }}
          </q-tooltip>
        </q-toggle>
        <!-- 提示音 -->
        <q-toggle
          dense
          class="q-mr-md"
          color="blue-13"
          :label="$t('main.beep')"
          left-label
          checked-icon="volume_up"
          unchecked-icon="volume_off"
          v-model="hint"
        >
          <!-- hint -->
          <q-tooltip>
            {{ $t('main.beep_hint') }}
          </q-tooltip>
        </q-toggle>
        <!-- 自動接單 -->
        <q-toggle
          dense
          :label="$t('main.auto')"
          color="blue-13"
          left-label
          icon="hdr_auto"
          :model-value="autoModeRequest.data?.AutoMode === 1"
          @click="
            () => {
              if (autoModeRequest.data?.AutoMode === 0) autoModeRequest.run(1);
              else autoModeRequest.run(0);
            }
          "
          v-if="!autoModeRequest.loading"
        >
          <!-- hint -->
          <q-tooltip>
            {{ $t('main.auto_hint') }}
          </q-tooltip>
        </q-toggle>
        <q-spinner v-else />
      </div>
    </div>
    <q-card class="myshadow q-pa-sm">
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="blue-13"
        indicator-color="blue-13"
        align="left"
        v-if="isAgent"
      >
        <!-- 即時訂單 -->
        <q-tab name="instant" :label="$t('dashboard.即時訂單')">
          <q-badge
            color="red"
            :label="liveOrders.instant?.length"
            v-if="liveOrders.instant?.length > 0"
            floating
          />
          <q-inner-loading :showing="liveStore.liveWsConnecting.instant">
            <q-spinner-ball />
          </q-inner-loading>
        </q-tab>
        <!-- 進行中 -->
        <q-tab name="progress" :label="$t('dashboard.進行中')">
          <q-badge
            color="red"
            :label="liveOrders.progress?.length"
            v-if="liveOrders.progress?.length > 0"
            floating
          />
          <q-inner-loading :showing="liveStore.liveWsConnecting.progress">
            <q-spinner-ball />
          </q-inner-loading>
        </q-tab>
      </q-tabs>

      <q-separator v-if="isAgent" />

      <q-tab-panels :model-value="tab" animated>
        <q-tab-panel
          v-for="(panelOption, index) in panelOptions"
          :key="index"
          :name="panelOption.tabName"
          style="padding: 8px"
        >
          <div v-if="panelOption.panel">
            <component :is="panelOption.panel"> </component>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <RecentHistory />
  </div>
</template>

<script setup lang="ts">
import { useLiveStore, useStateStore, useThirdStore } from 'src/stores';
import { type Component, computed, onMounted, ref, toRefs } from 'vue';
import InstantOrders from './components/InstantOrders.vue';
import ProgressOrders from './components/ProgressOrders.vue';
import RecentHistory from './components/RecentHistory.vue';
import progressPng from 'src/assets/in-progress.png';
import { useStorage } from 'vue3-storage';
import PendingOrders from './components/PendingOrders.vue';

const { hint } = toRefs(useThirdStore());
const { balanceRequest, autoModeRequest } = useStateStore();
const liveStore = useLiveStore();
// DOM
const tab = ref('instant');
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
const { liveOrders } = useLiveStore();
// Life cycle
onMounted(() => {
  if (balanceRequest.data) balanceRequest.refresh();
  if (!isAgent.value) {
    setTimeout(() => {
      hint.value = false;
      tab.value = 'memberProgress';
    });
  }
});
</script>

<script lang="ts">
type TabTypes = 'instant' | 'progress' | 'memberProgress';
type PanelOption = {
  tabName: TabTypes;
  panel: Component;
};
const panelOptions: Array<PanelOption> = [
  {
    // 代理及時訂單
    tabName: 'instant',
    panel: InstantOrders,
  },
  {
    // 代理進行中訂單
    tabName: 'progress',
    panel: ProgressOrders,
  },
  {
    // 會員的進行中訂單
    tabName: 'memberProgress',
    panel: PendingOrders,
  },
];
</script>

<style scoped></style>
