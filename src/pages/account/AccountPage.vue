<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAccHistory, AccNum, useDelAcc } from './api';
import { useSetAcc } from './api';
import { useAcc } from './api';
import { thousandTool } from 'src/utils/NumberTool';
import CheckCard from 'src/components/CheckCard.vue';
import Flag from 'src/assets/CNY.png';

const { t } = useI18n();
const router = useRouter();
const { data: accs, loading, refresh: reStory } = useAccHistory();
const { data: acc, refresh: reAcc } = useAcc();
const { run: set } = useSetAcc({
  onSuccess: () => {
    reStory();
    reAcc();
  }
});
const { run: del } = useDelAcc({
  onSuccess: () => {
    reStory();
    reAcc();
    delID.value = undefined;
  }
});

const delID = ref<number>();
// DOM
</script>
<template>
  <q-card
    class="q-pa-sm q-ma-sm q-mt-md q-mb-xl myshadow"
    style="min-width: 60%"
  >
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
          <!-- ()帳戶 -->
          <q-item-section>
            <div class="text-subtitle1">CNY{{ $t('label.account') }}</div>
          </q-item-section>
          <!-- ()帳戶數量 -->
          <div class="q-pa-md flex justify-end">
            <div class="text-subtitle2 text-grey-6">
              {{ $t('transaction.quantity') + thousandTool(accs?.length) }}
            </div>
          </div>
        </div>

        <!-- cards -->
        <q-card-section style="padding: 0">
          <div class="row">
            <!-- card 1 -->
            <div
              class="col-12 col-md-4 col-sm-6"
              v-for="(Acc, Ai) in accs"
              :key="Ai"
            >
              <!-- card 1 -->
              <q-card class="q-pa-md q-ma-sm" flat bordered>
                <!-- 編輯帳戶 -->
                <div v-for="(AccKey, aki) in Object.values(AccNum)" :key="aki">
                  <div class="text-grey-6 text-caption">
                    {{ t(`label.CNY.${AccKey}`) }}
                  </div>
                  <div class="flex items-center justify-end cursor-pointer">
                    {{ Acc[AccKey] }}
                    <q-popup-edit
                      v-model="Acc[AccKey]"
                      v-slot="scope"
                      touch-position
                      persistent
                      buttons
                      @save="
                        (value, initValue) => {
                          if (value !== initValue) {
                            set({
                              [AccNum.Account]: Acc[AccNum.Account],
                              [AccNum.Name]: Acc[AccNum.Name],
                              [AccNum.BankID]: Acc[AccNum.BankID],
                              [AccNum.Branch]: Acc[AccNum.Branch],
                              [AccKey]: value
                            });
                            del({
                              H_id: Acc.H_id
                            });
                          }
                        }
                      "
                      :label-set="$t('label.confirm')"
                      :label-cancel="$t('transaction.cancel')"
                    >
                      <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        counter
                        @keyup.enter="() => scope.set()"
                      />
                    </q-popup-edit>
                    <q-icon
                      flat
                      round
                      name="edit"
                      color="blue-13"
                      class="q-ml-xs"
                    />
                  </div>
                  <div style="border: 0.25px dashed #eeeeee"></div>
                </div>

                <q-card-actions
                  align="right"
                  class="q-gutter-x-sm"
                  style="padding: 0; margin-top: 15px"
                >
                  <!-- 設為預設帳戶 btn -->
                  <!-- if帳戶數量=0，新增第一個帳戶後，自動設為預設 -->
                  <!-- 變成預設帳戶後，點亮這顆星  -->
                  <!-- 變成預設帳戶後，disable不可點擊 -->
                  <q-checkbox
                    :model-value="acc?.[AccNum.Account] === Acc[AccNum.Account]"
                    checked-icon="star"
                    unchecked-icon="star_border"
                    color="orange"
                    @click="
                      () =>
                        set({
                          [AccNum.Account]: Acc[AccNum.Account],
                          [AccNum.Name]: Acc[AccNum.Name],
                          [AccNum.BankID]: Acc[AccNum.BankID],
                          [AccNum.Branch]: Acc[AccNum.Branch]
                        })
                    "
                  >
                    <!-- hint -->
                    <q-tooltip>
                      {{ $t('label.preset_hint2') }}
                    </q-tooltip>
                  </q-checkbox>

                  <!-- 刪除帳戶 btn-->
                  <!-- 變成預設帳戶後，disable不可點擊 -->
                  <q-btn
                    :disable="acc?.[AccNum.Account] === Acc[AccNum.Account]"
                    @click="() => (delID = Acc.H_id)"
                    flat
                    round
                    color="blue-13"
                    icon="delete"
                  >
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>

            <!-- 新增 -->
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
                <!-- 新增()帳戶 -->
                {{ $t('label.add_account') }}
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-list>
    </q-card>
  </q-card>
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
</template>

<style scoped></style>
