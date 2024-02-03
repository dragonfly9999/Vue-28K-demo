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
          :label="$t('label.notify')"
          left-label
          checked-icon="notifications"
          unchecked-icon="notifications_off"
          :model-value="false"
          disable
        >
          <q-tooltip>
            {{ $t('label.notify_hint') }}
          </q-tooltip>
        </q-toggle>
        <!-- 提示音 -->
        <q-toggle
          dense
          class="q-mr-md"
          color="blue-13"
          :label="$t('label.beep')"
          left-label
          checked-icon="volume_up"
          unchecked-icon="volume_off"
          v-model="hint"
        >
          <!-- hint -->
          <q-tooltip>
            {{ $t('label.beep_hint') }}
          </q-tooltip>
        </q-toggle>
        <!-- 自動接單 -->
        <q-toggle
          dense
          :label="$t('label.auto')"
          color="blue-13"
          left-label
          icon="hdr_auto"
          :model-value="getAuto()?.AutoMode === 1"
          @click="
            () => {
              if (getAuto()?.AutoMode === 0) updateAuto(1);
              else updateAuto(0);
            }
          "
          v-if="!getAutoLoad()"
        >
          <!-- hint -->
          <q-tooltip>
            {{ $t('label.auto_hint') }}
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
            :label="instantOrders?.length"
            v-if="instantOrders?.length > 0"
            floating
          />
          <q-inner-loading :showing="liveStore.liveWsConnecting.instant">
            <q-spinner-ball />
          </q-inner-loading>
        </q-tab>
        <!-- 進行中 -->
        <q-tab name="progress" :label="$t('label.inProgress')">
          <q-badge
            color="red"
            :label="progressOrders?.length"
            v-if="progressOrders?.length > 0"
            floating
          />
          <q-inner-loading :showing="liveStore.liveWsConnecting.progress">
            <q-spinner-ball />
          </q-inner-loading>
        </q-tab>
      </q-tabs>

      <q-separator v-if="isAgent" />

      <q-tab-panels :model-value="tab" animated>
        <q-tab-panel name="instant" style="padding: 8px">
          <InstantOrders />
        </q-tab-panel>

        <q-tab-panel name="progress" style="padding: 8px">
          <ProgressOrders />
        </q-tab-panel>
        <!-- 會員的進行中訂單 -->
        <q-tab-panel name="memberProgress" style="padding: 8px">
          <PendingOrders />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <RecentHistory />
  </div>
</template>

<script setup lang="ts">
import { useLiveStore, useStateStore, useThirdStore } from 'src/stores';
import { computed, onMounted, ref, toRefs } from 'vue';
import InstantOrders from './components/InstantOrders.vue';
import ProgressOrders from './components/ProgressOrders.vue';
import RecentHistory from './components/RecentHistory.vue';
import progressPng from 'src/assets/in-progress.png';
import { useStorage } from 'vue3-storage';
import PendingOrders from './components/PendingOrders.vue';

const { hint } = toRefs(useThirdStore());
const { refreshBalance } = useStateStore();
const liveStore = useLiveStore();
const { getAuto, getAutoLoad, updateAuto } = useStateStore();
// DOM
const tab = ref('instant');
const isAgent = computed(() => useStorage().getStorageSync('isAgent'));
const instantOrders = computed(() => liveStore.getOrders('instant'));
const progressOrders = computed(() => liveStore.getOrders('progress'));
// Life cycle
onMounted(() => {
  refreshBalance();
  if (!isAgent.value) {
    hint.value = false;
    tab.value = 'memberProgress';
  }
});
</script>

<style scoped></style>
