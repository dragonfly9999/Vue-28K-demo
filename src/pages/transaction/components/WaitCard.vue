<template>
  <q-card align="center" class="width600 q-gutter-y-lg">
    <div class="q-gutter-y-md">
      <q-spinner-ball color="primary" size="4em" />
      <div class="text-h5 text-primary text-weight-bold">
        {{ $t('transaction.配對中') }}
      </div>
    </div>

    <div>
      <div class="text-center text-subtitle2 text-grey-5">
        {{
          useRoute().name === 'buy'
            ? $t('transaction.購買USDT')
            : $t('transaction.出售USDT')
        }}
      </div>
      <table>
        <tr>
          <td>{{ $t('transaction.數量') }}</td>
          <td>{{ thousandTool(orderStatus?.UsdtAmt, 'USDT') }} USDT</td>
        </tr>
        <tr>
          <td>{{ $t('transaction.金額') }}</td>
          <td>{{ thousandTool(orderStatus?.D2, 'CNY') }}{{ currency }}</td>
        </tr>
      </table>
    </div>
    <q-separator inset />
    <!-- 取消訂單btn -->
    <q-btn
      @click="() => (cancelConfirm = true)"
      flat
      dense
      color="red"
      :label="$t('transaction.取消訂單')"
    />
  </q-card>

  <q-dialog v-model="cancelConfirm">
    <q-card class="q-pa-md q-gutter-y-sm" style="width: 360px">
      <!-- title 是否要取消訂單-->
      <div>{{ $t('transaction.cancelWarn.title') }}</div>
      <div class="flex items-baseline no-wrap">
        <q-icon name="warning" color="orange-9" class="q-mr-sm" />
        <div class="text-orange-9 text-h6 text-weight-bold">
          {{ $t('transaction.cancelWarn.content') }}
        </div>
      </div>

      <q-card-actions align="right" class="text-primary">
        <!-- 返回btn -->
        <q-btn v-close-popup outline color="primary" :label="$t('返回')" />
        <!-- 確認btn -->
        <q-btn
          :loading="loading"
          @click="
            () =>
              cancel({
                Token: token,
              })
          "
          color="blue-13"
          :label="$t('transaction.確認取消')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStateStore } from 'src/stores';
import { computed, ref } from 'vue';
import { thousandTool } from 'src/utils/NumberTool';
import { useCancel } from 'src/components/api';
defineProps<{ orderStatus: OrderStatus | undefined }>();

const { run: cancel, loading } = useCancel({});
const { currency } = useStateStore();
const route = useRoute();
//
const cancelConfirm = ref(false);
const token = computed(() => route?.query?.token as string);
</script>

<style scoped></style>
