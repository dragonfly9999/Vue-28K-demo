<script setup lang="ts">
import { useAccessyStore } from 'src/stores';
import { ref, toRefs } from 'vue';

const { notify, hint, auto } = toRefs(useAccessyStore());
// DOM
const tab = ref('1');
const isEdit = ref(false);
</script>
<template>
  <div class="flex items-center justify-between">
    <!-- title即時交易 -->
    <div class="flex items-center">
      <img src="../../assets/in-progress.png" />
      <div class="text-h6 text-weight-bold">
        {{ $t('label.instant_transaction') }}
      </div>
    </div>
    <!-- toggle -->
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
        v-model="auto"
      >
        <!-- hint -->
        <q-tooltip>
          {{ $t('label.auto_hint') }}
        </q-tooltip>
      </q-toggle>
    </div>
  </div>
  <q-card class="myshadow">
    <q-tabs
      v-model="tab"
      class="text-grey"
      active-color="blue-13"
      indicator-color="blue-13"
      align="left"
    >
      <!-- 即時訂單 -->
      <q-tab name="1" :label="$t('label.instant_transaction')">
        <q-badge color="red" :label="2" floating />
      </q-tab>
      <!-- 進行中 -->
      <q-tab name="2" :label="$t('label.inProgress')">
        <q-badge color="red" :label="2" floating />
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="1" style="padding: 8px">
        <Instant />
      </q-tab-panel>

      <q-tab-panel name="2" style="padding: 8px">
        <InstantProgress />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <HistoryList class="q-mb-xl myshadow" />

  <!-- Dialog -->
  <q-dialog v-model="isEdit">
    <EditBankSet />
  </q-dialog>
</template>

<style scoped></style>
