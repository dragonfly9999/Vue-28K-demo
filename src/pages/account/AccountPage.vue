<template>
  <q-page class="width1440">
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
    <div class="row">
      <div class="col-12 col-md-3 q-pa-sm">
        <q-card class="q-pa-md myshadow">
          <q-card-section class="text-subtitle1">
            <q-avatar
              icon="edit_road"
              size="sm"
              color="blue-13"
              text-color="white"
              class="q-mr-md"
            />
            設定通道
          </q-card-section>

          <div class="q-pa-sm">
            <q-select
              stack-label
              filled
              color="blue-13"
              standout="bg-blue-13 text-white"
              label="全部通道"
              v-model="channel_1"
              :options="accountOptioins"
            />
          </div>
          <div class="q-pa-sm">
            <q-select
              stack-label
              filled
              color="blue-13"
              standout="bg-blue-13 text-white"
              label="K100U.com"
              v-model="channel_2"
              :options="accountOptioins"
              @click="
                () => {
                  isRepeat = true;
                }
              "
            />
          </div>
          <div class="q-pa-sm">
            <q-select
              stack-label
              filled
              color="blue-13"
              standout="bg-blue-13 text-white"
              label="K200U.uk"
              v-model="channel_3"
              :options="accountOptioins"
            />
          </div>
          <div class="q-pa-sm">
            <q-select
              stack-label
              filled
              color="blue-13"
              standout="bg-blue-13 text-white"
              label="K100U.net"
              v-model="channel_4"
              :options="accountOptioins"
            />
          </div>
          <q-card-actions align="right">
            <q-btn unelevated disable color="blue-13" label="儲存" padding="5px 20px" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-9 q-pa-sm">
        <q-card class="q-pa-md myshadow">
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
                      :on-fresh-info="
                        () => {
                          reStory();
                          reAcc();
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
      </div>
    </div>
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
    <!-- 沒有預設帳號 -->
    <q-dialog v-model="isNoDefaultWarn">
      <q-card
        class="q-pa-md"
        @click="
          () => {
            isNoDefaultWarn = false;
          }
        "
      >
        <div class="flex text-orange-12 items-center text-h5">
          <q-icon
            class="material-icons-outlined q-mr-md"
            name="report_problem"
          />
          <div class="text-bold">
            {{ $t('account.未設定預設帳號') }}
          </div>
        </div>
        <div class="text-body1">
          ({{ $t('account.設定一個帳號的頻道為全部') }})
        </div>
      </q-card>
    </q-dialog>
    <!-- 帳號使用中，是否取代 -->
    <q-dialog v-model="isRepeat" persistent>
      <q-card class="q-pa-md">
        <div class="text-orange-12 text-center text-h5">
          <q-icon name="report_problem" size="60px" />
          <div class="text-bold">
            此帳戶已在使用，如果接受，它將從【{'某通道'}】中移除。
          </div>
        </div>
        <q-card-actions vertical>
          <q-btn
            unelevated
            class="full-width"
            color="blue-13"
            label="接受並重新設定【{'某通道'}】帳戶"
            @click="
              () => {
                isRepeat = false;
              }
            "
          />
          <q-btn
            class="full-width"
            color="blue-13"
            outline
            label="取消"
            @click="
              () => {
                isRepeat = false;
              }
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { AccNum, useAccHistory, useDelAcc } from './api';
import { useAcc } from './api';
import { thousandInput } from 'src/utils/NumberTool';
import CheckCard from 'src/components/CheckCard.vue';
import Flag from 'src/assets/CNY.png';
import AccountCard from './AccountCard.vue';

const { t } = useI18n();
const router = useRouter();
// DOM
const isAlreadyWarn = ref(false);
const isNoDefaultWarn = ref(false);
const isRepeat = ref(false);
const {
  data: accs,
  loading,
  refresh: reStory,
} = useAccHistory({
  onSuccess: (res) => {
    if (!isAlreadyWarn.value) {
      isNoDefaultWarn.value = !!res?.data.every(
        (accInfo) => accInfo[AccNum.Channel] !== -1
      );
      if (isNoDefaultWarn.value) {
        setTimeout(() => {
          isNoDefaultWarn.value = false;
          isAlreadyWarn.value = true;
        }, 3000);
      }
    }
  },
});
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
// alan
const channel_1 = ref('未設定');
const channel_2 = ref('未設定');
const channel_3 = ref('未設定');
const channel_4 = ref('未設定');
const accountOptioins = [
  { label: '未設定', value: null },
  {
    label: '王曉明 | 0000000000000016 | 招商銀行 | 深圳西鄉分行',
    value: -1,
  },
  {
    label: '王曉明 | 0000000000000099 | 平安銀行 | 北京總行',
    value: 5,
  },
];
</script>

<style scoped></style>
