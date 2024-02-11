<template>
  <q-card class="width600 q-pa-md">
    <!-- title -->
    <div class="text-center">
      <q-icon name="cancel" class="text-red text-h1" />
      <div class="text-h6 text-weight-bold">
        {{ $t('transaction.交易取消') }}
      </div>
    </div>

    <!-- order title -->
    <div class="text-left text-subtitle1 text-blue-13 q-mt-lg">
      {{ $t(`label.${route.query.type as string}`) }}
      USDT/ {{ order?.Currency }}
    </div>
    <!-- order info -->
    <div class="text-left bg-step q-pa-md">
      <!-- 數量 -->
      <div class="flex items-center">
        <div class="text-grey-6">{{ $t('transaction.數量') }}：</div>
        <div>
          {{ thousandTool(order?.UsdtAmt, 'USDT') }}
          USDT
        </div>
      </div>
      <!-- 訂單建立時間 -->
      <div class="flex items-center">
        <div class="text-grey-6">{{ $t('transaction.訂單建立時間') }}：</div>
        <div>{{ dayjs(order?.CreateDate).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </div>
      <!-- 訂單號 -->
      <div class="flex items-center ellipsis">
        <div class="text-grey-6">Tx Hash：</div>
        <punctuation-master
          color="black"
          :label="order?.Tx_HASH"
          justify="left"
        />
      </div>
    </div>

    <q-btn
      unelevated
      rounded
      class="full-width q-mt-md"
      @click="() => router.push({ name: 'dashboard' })"
      color="blue-13"
      :label="$t('transaction.返回主頁')"
    />
  </q-card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import PunctuationMaster from 'src/components/PunctuationMaster.vue';
import { useKeyStore } from 'src/stores';
import { thousandTool } from 'src/utils/NumberTool';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
defineProps<{ order: OrderStatus | undefined }>();
const router = useRouter();
const route = useRoute();

// Live cycle
const keyStore = useKeyStore();
onMounted(() => {
  // scroll
  setTimeout(() => {
    setTimeout(() => {
      keyStore.handleUpdateHeaderModel(false);
      keyStore.handleUpdateHeaderModel(true);
    }, 500);
    const domElement = document.documentElement;
    domElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, 200);
});
</script>

<style scoped>
.container {
  min-width: 400px;
}

@media screen and (max-width: 1024px) {
  .container {
    min-width: 20px;
  }
}
</style>
