<template>
  <!-- Title -->
  <div class="row q-px-sm q-mt-md items-center">
    <div class="col-2">
      <!-- 返回btn -->
      <q-btn
        flat
        dense
        color="blue-13"
        :label="t('label.back')"
        @click="() => router.back()"
      />
    </div>
    <!-- title轉出USDT -->
    <div class="col flex justify-center text-h6 text-weight-bold">
      {{ $t('transfer.title') }} USDT
    </div>
    <div class="col-2 flex justify-end">
      <!-- 轉帳手續費 -->
      <q-btn
        flat
        no-caps
        size="sm"
        dense
        icon="paid"
        class="text-blue-13 non-selectable text-caption"
      >
        <q-popup-proxy>
          <q-banner>
            <div class="flex items-center q-mb-md">
              <q-icon name="paid" color="blue-13" class="q-mr-sm" />
              <div>{{ $t('transfer.label.premium') }}</div>
            </div>

            <div class="flex items-center">
              <div>
                <div class="text-grey-7">TRC20</div>
                <div class="text-weight-bold text-h6 text-blue-13">
                  1.00 USDT
                </div>
              </div>
              <div class="hr self-center" style="background-color: grey"></div>
              <div>
                <div class="text-grey-7">ERC20</div>
                <div class="text-weight-bold text-h6 text-blue-13">
                  35.00 USDT
                </div>
              </div>
            </div>
          </q-banner>
        </q-popup-proxy>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
</script>

<style scoped></style>
