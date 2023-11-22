<template>
  <div class="row q-mb-sm">
    <div class="col-3">
      <q-btn flat color="primary" :label="$t('返回')" @click="$router.back()" />
    </div>
    <div class="col flex justify-center text-h6 text-weight-bold">
      {{ $t('kyc.實名驗證') }}
    </div>
    <div class="col-3"></div>
  </div>
  <q-card>
    <q-tabs
      dense
      mobile-arrows
      v-model="statusTab"
      align="justify"
      class="bg-grey-1 text-grey"
    >
      <q-tab
        v-for="(statusOption, index) in statusTabOptions"
        :key="index"
        :class="`text-${statusOption.color}-7`"
        :name="statusOption.value"
        :icon="statusOption.icon"
        :label="statusOption.label"
      />
    </q-tabs>
    <q-tab-panels v-model="statusTab" animated>
      <q-tab-panel
        v-for="(statusOption, index) in statusTabOptions"
        :key="index"
        :name="statusOption.value"
        class="q-gutter-y-md"
      >
        <template v-if="statusOption.component">
          <component :is="statusOption.component" :temp-kycs="tempKycs" />
        </template>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import api from './api';
import useTabs from './useTabs';
const { tempKycs } = api.useKycHistory({});
const { statusTab, statusTabOptions } = useTabs();
</script>
