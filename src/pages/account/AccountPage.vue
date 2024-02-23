<template>
  <q-page class="width1440">
    <!-- header -->
    <div class="row q-mb-sm">
      <div class="col-4">
        <q-btn
          flat
          color="blue-13"
          :label="$t('label.back')"
          @click="() => router.back()"
        />
      </div>
      <!-- title 帳戶管理-->
      <div class="col flex justify-center text-h6 text-weight-bold">
        {{ $t('account.帳戶管理') }}
      </div>
      <div class="col-4"></div>
    </div>
    <div class="row">
      <!-- 設定通道 -->
      <div class="col-12 col-md-3 q-pa-sm">
        <components.SetChannels
          :accs="accs"
          :show-accs="showAccs"
          @refresh="
            () => {
              reStory();
            }
          "
        />
      </div>
      <!-- CNY 帳戶 -->
      <div class="col-12 col-md-9 q-pa-sm">
        <q-card class="q-pa-md myshadow">
          <q-inner-loading :showing="loading">
            <q-spinner-tail color="blue-13" size="2em" :thickness="10" />
          </q-inner-loading>

          <q-list>
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
                  {{ $t('account.帳戶數量') + thousandInput(showAccs?.length) }}
                </div>
              </div>
            </div>

            <q-card-section style="padding: 0">
              <div class="row">
                <!-- 帳戶 -->
                <div
                  class="col-12 col-md-4 col-sm-6"
                  v-for="(Acc, Ai) in showAccs"
                  :key="Ai"
                >
                  <components.AccountCard
                    :current-acc="acc"
                    v-model:del-i-d="delID"
                    :acc-info="Acc"
                    :loading="loading || underDel || setting"
                    @edit="handleMutiEditField"
                  />
                </div>

                <!-- 新增帳戶 -->
                <div class="col-12 col-md-4 col-sm-6 q-pa-sm">
                  <q-btn
                    v-if="!loading"
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
      </div>
    </div>
    <!-- 確認是否刪除 -->
    <CheckCard
      @confirm="handleMutiDel"
      @close="() => (delID = undefined)"
      :visible="delID !== undefined"
      :message="$t('label.del_hint')"
    />
    <!-- 沒有預設帳號 -->
    <components.NoDefaultWarn v-model:visible="isNoDefaultWarn" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AccNum, useAccHistory, useDelAcc, useSetAcc } from './api';
import { useAcc } from './api';
import { thousandInput } from 'src/utils/NumberTool';
import CheckCard from 'src/components/CheckCard.vue';
import Flag from 'src/assets/CNY.png';
import components from './components';
import type { AccRes } from './api/useAccHistory';

const router = useRouter();
// DOM
const isAlreadyWarn = ref(false);
const isNoDefaultWarn = ref(false);
const delID = ref<number>();

// ##### query
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
const { data: acc, refresh: reAcc } = useAcc(); // default Acc
const accsInfoJson = computed(() =>
  // [{value: string, id: id}]
  accs.value
    ?.filter(
      (accFilter) =>
        !(
          accFilter.P1 === null &&
          accFilter.P2 === null &&
          accFilter.P3 === null &&
          accFilter.P4 === null
        )
    )
    .map((accInfo) => ({
      value: JSON.stringify({ ...accInfo, H_id: -2, [AccNum.Channel]: null }),
      id: accInfo.H_id,
    }))
);
const showAccs = computed<Array<AccRes>>(() => {
  const setAccValue = // Set([{value: string, id: id}])
    Array.from(new Set(accsInfoJson.value?.map((mapInfo) => mapInfo.value))) ??
    [];
  const setAccs = setAccValue.map((mapValue) => {
    const setInfo = accsInfoJson.value?.find(
      (findInfo) => findInfo.value === mapValue
    );
    const setAcc = accs.value
      ?.slice()
      .find((findAcc) => findAcc.H_id === setInfo?.id);
    return setAcc;
  }) as Array<AccRes>;
  return setAccs;
});

// del
const editWait = ref(false);
const { run: del, loading: underDel } = useDelAcc({
  onSuccess: () => {
    if (!editWait.value) {
      setTimeout(() => reStory(), 200);
      reAcc();
      delID.value = undefined;
    } else {
      editWait.value = false;
    }
  },
});

// set
const { run: set, loading: setting } = useSetAcc({
  onSuccess: () => {
    if (!editWait.value) {
      setTimeout(() => reStory(), 200);
      reAcc();
      delID.value = undefined;
    } else {
      editWait.value = false;
    }
  },
});

// ##### handler
const handleMutiDel = (propsID?: number) => {
  const delAcc = accs.value?.find(
    (findAcc) => findAcc.H_id === delID.value || findAcc.H_id === propsID
  );
  if (!delAcc) return;

  const delAccInfo = JSON.stringify({
    ...delAcc,
    H_id: -2,
    [AccNum.Channel]: null,
  });
  const delIDs = accsInfoJson.value
    ?.filter((filterInfo) => filterInfo.value === delAccInfo)
    .map((mapInfo) => mapInfo.id);
  delIDs?.forEach((forID) =>
    del({
      H_id: forID,
    })
  );
};

const handleMutiEditField = ({
  field,
  value,
  id,
}: {
  field: AccNum;
  value: string;
  id: number;
}) => {
  const delAcc = accs.value?.find((findAcc) => findAcc.H_id === id);
  if (!delAcc) return;
  const delAccInfo = JSON.stringify({
    ...delAcc,
    H_id: -2,
    [AccNum.Channel]: null,
  });

  const delIDs =
    accsInfoJson.value
      ?.filter((filterInfo) => filterInfo.value === delAccInfo)
      .map((mapInfo) => mapInfo.id) ?? [];

  delIDs.forEach((forID) => {
    editWait.value = true;
    const editAcc = accs.value?.find((findAcc) => findAcc.H_id === forID);
    if (!editAcc) return;
    // 修改欄位時自動新增並且預設，同時刪除原本的帳號
    del({
      H_id: editAcc.H_id,
    });
    set({
      [AccNum.Name]: editAcc[AccNum.Name],
      [AccNum.Account]: editAcc[AccNum.Account],
      [AccNum.BankID]: editAcc[AccNum.BankID],
      [AccNum.Branch]: editAcc[AccNum.Branch],
      [AccNum.Channel]: editAcc[AccNum.Channel],
      [field]: value,
    });
  });
};
</script>

<style scoped></style>
