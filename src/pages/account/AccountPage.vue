<template>
  <q-page class="width900">
    <q-card class="q-pa-md myshadow">
      <!-- header -->
      <div class="row q-mb-sm">
        <!-- 返回btn -->
        <div class="col-4">
          <q-btn
            flat
            color="blue-13"
            :label="t('label.back')"
            @click="() => router.back()"
          />
        </div>
        <!-- title 帳戶管理-->
        <div class="col flex justify-center text-h6 text-weight-bold">
          {{ $t('label.account') }}
        </div>
        <div class="col-4"></div>
      </div>
      <q-separator />

      <q-card class="q-pa-sm">
        <q-spinner-tail
          color="blue-13"
          size="2em"
          :thickness="10"
          v-if="loading"
        />
        <q-list v-else>
          <div class="flex">
            <q-item-section avatar class="q-pa-sm">
              <q-avatar size="sm">
                <img :src="Flag" />
              </q-avatar>
            </q-item-section>
            <!-- 帳戶 -->
            <q-item-section>
              <div class="text-subtitle1">CNY{{ $t('account.帳戶') }}</div>
            </q-item-section>
            <!-- 帳戶數量 -->
            <div class="q-pa-md flex justify-end">
              <div class="text-subtitle2 text-grey-6">
                {{ $t('account.帳戶數量') + thousandInput(accs?.length) }}
              </div>
            </div>
          </div>

          <!-- 新增帳戶 -->
          <q-card-section style="padding: 0">
            <div class="row">
              <div
                class="col-12 col-md-4 col-sm-6"
                v-for="(Acc, Ai) in showAccs"
                :key="Ai"
              >
                <AccountCard
                  :on-success="
                    () => {
                      del({ H_id: Acc.H_id });
                    }
                  "
                  :current-acc="acc"
                  v-model:del-i-d="delID"
                  :acc-info="Acc"
                />
              </div>

              <div class="col-12 col-md-4 col-sm-6 q-pa-sm">
                <q-btn
                  outline
                  color="blue-13"
                  icon="add"
                  class="q-mx-sm full-width full-height"
                  stack
                  @click="() => router.push({ name: 'account_create' })"
                  no-caps
                >
                  {{ $t('label.add_account') }}
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-list>
      </q-card>
    </q-card>

    <!-- 確認是否刪除 -->
    <CheckCard
      @confirm="
      () =>
        del({
          H_id: delID as number
        })
    "
      @close="() => (delID = undefined)"
      :visible="delID !== undefined"
      :message="t('label.del_hint')"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAccHistory, useDelAcc } from './api';
import { useAcc } from './api';
import { thousandInput } from 'src/utils/NumberTool';
import CheckCard from 'src/components/CheckCard.vue';
import Flag from 'src/assets/CNY.png';
import AccountCard from './AccountCard.vue';

const { t } = useI18n();
const router = useRouter();
const { data: accs, loading, refresh: reStory } = useAccHistory();
const { request } = useAcc();
const { data: acc, refresh: reAcc } = request;
const showAccs = computed(() =>
  accs.value?.slice().sort((a) => {
    if (!acc.value) return 0;
    if (
      a.P1 === acc.value?.P1 &&
      a.P2 === acc.value?.P2 &&
      a.P3 === acc.value?.P3 &&
      a.P4 === acc.value?.P4
    )
      return -1;
    return 1;
  })
);
const { run: del } = useDelAcc({
  onSuccess: () => {
    reStory();
    reAcc();
    delID.value = undefined;
  },
});

const delID = ref<number>();
// DOM
</script>

<style scoped></style>
