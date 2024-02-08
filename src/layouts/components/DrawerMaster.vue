<script setup lang="ts">
import langs from 'src/i18n';
import { useStateStore } from 'src/stores';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
const router = useRouter();
const i18n = useI18n();
const { t } = useI18n();
const { formatRates } = useStateStore();
const storage = useStorage();
// DOM
const drawerRight = ref(true);
</script>
<template>
  <q-drawer
    side="right"
    v-model="drawerRight"
    show-if-above
    overlay
    :width="360"
    :breakpoint="500"
    class="bg-grey-3 shadow-24 text-dark no-border"
    :delay="1200"
    :persistent="false"
  >
    <q-scroll-area style="margin-top: 80px; height: calc(100% - 150px)">
      <q-list class="q-pa-md">
        <!-- 漢堡匯率 -->

        <div
          color="blue-grey-1"
          class="flex items-start justify-between text-caption"
        >
          <div class="text-dark">USDT/CNY {{ t('rate.title') }}</div>

          <div>
            <div class="flex justify-end">
              <div class="text-dark text-right q-mr-xs">
                {{ t('rate.buy') }}
              </div>
              <div class="text-right text-weight-bold text-blue-13">
                {{ formatRates.buy }}
              </div>
            </div>

            <div class="flex justify-end">
              <div class="text-dark text-right q-mr-xs">
                {{ t('rate.sell') }}
              </div>
              <div class="text-right text-weight-bold text-red">
                {{ formatRates.sell }}
              </div>
            </div>
          </div>
        </div>
        <q-separator spaced />
        <!--轉帳  -->
        <q-item
          clickable
          v-ripple
          @click="
            () => {
              drawerRight = false;
              router.push({ name: 'transfer' });
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="move_up" />
          </q-item-section>
          <q-item-section> {{ t('label.transfer') }} </q-item-section>
        </q-item>

        <!-- 錢包 -->
        <q-item
          clickable
          v-ripple
          @click="
            () => {
              drawerRight = false;
              router.push({ name: 'wallet' });
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" />
          </q-item-section>
          <q-item-section> {{ t('label.wallet') }} </q-item-section>
        </q-item>
        <!-- 紀錄 -->
        <q-item
          clickable
          v-ripple
          @click="
            () => {
              drawerRight = false;
              router.push({ name: 'history' });
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section> {{ t('label.history') }} </q-item-section>
        </q-item>
        <!-- 帳戶 -->
        <q-item
          clickable
          v-ripple
          @click="
            () => {
              drawerRight = false;
              router.push({ name: 'account' });
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="credit_card" />
          </q-item-section>
          <q-item-section>{{ t('label.account') }}</q-item-section>
        </q-item>

        <!-- 語言 -->
        <q-expansion-item
          no-separator
          icon="language"
          :label="t('label.language')"
          default-closed
        >
          <q-item
            v-for="(lang, index) in langs"
            :key="index"
            clickable
            v-ripple
            @click="
              () => {
                drawerRight = false;
                i18n.locale.value = lang.locale;
              }
            "
          >
            <q-item-section> {{ lang.name }} </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-scroll-area>
    <!-- 歡迎登入 -->
    <div class="absolute-top bg-blue-grey-10 text-white" style="height: 80px">
      <div class="absolute-bottom bg-transparent q-pa-md">
        <q-btn
          class="absolute-right"
          icon="chevron_right"
          flat
          color="white"
          @click="() => (drawerRight = !drawerRight)"
        />
        <div class="flex items-end justify-between">
          <div class="flex items-end q-gutter-x-md">
            <div>
              <!-- 歡迎登入 -->
              <div>{{ t('label.welcome') }}</div>
              <div class="text-weight-bold text-body1">
                {{ storage.getStorageSync('phone') }}
              </div>
            </div>
            <!-- 登出btn -->
            <q-btn
              @click="
                () => {
                  router.push({ name: 'login' });
                }
              "
              :label="$t('label.logout')"
              icon="logout"
            />
          </div>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<style scoped></style>
