<script setup lang="ts">
import 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStateStore } from 'src/stores';
import { useCancel } from 'src/components/api';
import { computed, ref } from 'vue';
defineProps<{ orderStatus: OrderStatus | undefined }>();

const { currency } = useStateStore();
const { run: cancel } = useCancel();
const route = useRoute();
//
const cancelConfirm = ref(false);
const token = computed(() => route?.query?.token as string);
</script>
<template>
  <div align="center" class="q-pa-md q-gutter-y-lg" style="width: 360px">
    <div class="q-gutter-y-md">
      <q-spinner-ball color="primary" size="4em" />
      <div class="text-h5 text-primary text-weight-bold">
        {{ $t('配對中') }}
      </div>
    </div>

    <div>
      <div class="text-center text-subtitle2 text-grey-5">
        {{ useRoute().name === 'buy' ? $t('購買USDT') : $t('出售USDT') }}
      </div>
      <q-separator />
      <table>
        <tr>
          <td>{{ $t('數量') }}</td>
          <td>{{ orderStatus?.UsdtAmt }} USDT</td>
        </tr>
        <tr>
          <td>{{ $t('金額') }}</td>
          <td>{{ orderStatus?.D2 }}{{ currency }}</td>
        </tr>
      </table>
      <q-separator />
    </div>
    <!-- 取消訂單btn -->
    <q-btn
      @click="() => (cancelConfirm = true)"
      flat
      dense
      color="red"
      :label="$t('取消訂單')"
    />
  </div>

  <q-dialog v-model="cancelConfirm">
    <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
      <!-- title 是否要取消訂單-->
      <div>{{ $t('是否要取消訂單') }}</div>
      <div class="flex items-baseline no-wrap">
        <q-icon name="warning" color="orange-9" class="q-mr-sm" />
        <div class="text-orange-9 text-h6 text-weight-bold">
          {{ $t('注意! 若您已完成銀行轉帳，請勿取消此筆訂單') }}
        </div>
      </div>

      <q-card-actions align="right" class="text-primary">
        <!-- 返回btn -->
        <q-btn
          v-close-popup
          outline
          color="primary"
          :label="$t('label.back')"
        />
        <!-- 確認btn -->
        <q-btn
          @click="
            () =>
              cancel({
                Token: token,
              })
          "
          glossy
          color="primary"
          :label="$t('transaction.confirmCancel')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
