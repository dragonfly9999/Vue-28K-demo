<template>
  <q-card class="q-pa-md bg-grey-3" bordered>
    <!-- Header -->
    <div class="flex">
      <div class="text-h6 text-weight-bold">
        {{ $t('transaction.最近交易') }}
      </div>
      <q-space />
      <q-btn
        flat
        color="blue-13"
        :label="$t('transaction.所有交易紀錄')"
        to="history"
        style="text-decoration: none"
      />
    </div>
    <q-separator />

    <!-- list -->
    <q-list bordered separator>
      <q-item v-if="loading && !history" class="q-ma-xl" clickable v-ripple>
        <q-spinner-gears color="blue-13" size="5em" />
      </q-item>
      <RecordItem
        v-for="(order, index) in showHistory"
        :key="index"
        :order="order"
      />
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import RecordItem from 'src/components/RecordItem.vue';
import api from '../api';
import { computed } from 'vue';

const { data: history, loading } = api.useHistory({});
const showHistory = computed(() => history.value?.slice(0, 3));
</script>
