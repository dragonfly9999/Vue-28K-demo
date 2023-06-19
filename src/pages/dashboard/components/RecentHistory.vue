<script setup lang="ts">
import RecordItem from 'src/components/RecordItem.vue';
import { useHisotry } from '../api/useHistory';

const { data: history, loading } = useHisotry();
</script>
<template>
  <q-card class="q-pa-md bg-grey-3" bordered>
    <!-- Header -->
    <div class="flex">
      <div class="text-h6 text-weight-bold">
        {{ $t('transaction.recent') }}
      </div>
      <q-space />
      <q-btn
        flat
        color="blue-13"
        :label="$t('transaction.all_transaction_history') + '>'"
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
        v-for="(order, index) in history?.slice(0, 3)"
        :key="index"
        :order="order"
      />
    </q-list>
  </q-card>
</template>

<style scoped></style>
