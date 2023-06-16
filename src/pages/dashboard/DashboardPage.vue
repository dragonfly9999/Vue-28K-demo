<script setup lang="ts">
import { useAccessyStore, useLiveStore, useProgressStore } from 'src/stores';
import { ref, toRefs, watch } from 'vue';
import InstantOrders from './components/InstantOrders.vue';
import ProgressOrders from './components/ProgressOrders.vue';
import RecentHistory from './components/RecentHistory.vue';
import { useAuto } from 'src/layouts/api/useAuto';
import progressPng from 'src/assets/in-progress.png';

const { notify, hint } = toRefs(useAccessyStore());
const { getProgress } = useProgressStore();
const { getOrders } = useLiveStore();
const { data: autoInfo, run: updateMode, loading: loadMode } = useAuto();
// DOM
const tab = ref('1');
</script>
<template>
  <div style="max-width: 800px; min-width: 50%" class="q-gutter-sm q-mt-md">
    <!-- 交易列表 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center q-mr-md">
        <q-img :src="progressPng" width="20px" />
        <div class="text-h6 text-weight-bold">
          {{ $t('label.instant_transaction') }}
        </div>
      </div>
      <div class="flex items-center">
        <!-- 通知 -->
        <q-toggle
          dense
          class="q-mr-md"
          color="blue-13"
          :label="$t('label.notify')"
          left-label
          checked-icon="notifications"
          unchecked-icon="notifications_off"
          v-model="notify"
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
          :model-value="autoInfo?.AutoMode === 1"
          @click="
            () => {
              if (autoInfo?.AutoMode === 0) updateMode(1);
              else updateMode(0);
            }
          "
          v-if="!loadMode"
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
      >
        <!-- 即時訂單 -->
        <q-tab name="1" :label="$t('label.instant_transaction')">
          <q-badge
            color="red"
            :label="getOrders()?.length"
            v-if="getOrders()?.length > 0"
            floating
          />
        </q-tab>
        <!-- 進行中 -->
        <q-tab name="2" :label="$t('label.inProgress')">
          <q-badge
            color="red"
            :label="getProgress()?.length"
            v-if="getProgress()?.length > 0"
            floating
          />
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="1" style="padding: 8px">
          <InstantOrders />
        </q-tab-panel>

        <q-tab-panel name="2" style="padding: 8px">
          <ProgressOrders />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <RecentHistory />
  </div>
</template>

<style scoped></style>
