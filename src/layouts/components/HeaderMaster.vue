<script setup lang="ts">
import langs from 'src/i18n';
import I18nBtn from 'src/components/I18nBtn.vue';
import { useRateStore } from 'src/stores';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
import RateBar from 'src/components/RateBar.vue';
import NavBar from 'src/components/NavBar.vue';

const { getRate } = useRateStore();
const router = useRouter();
const { t } = useI18n();
const storage = useStorage();
const i18n = useI18n();
// DOM
const drawerRight = ref(false);

const logout = () => {
  storage.clearStorageSync();
  router.push({ name: 'login' });
};
</script>
<template>
  <q-header reveal class="q-pa-md" style="background: #242e47">
    <!-- Large -->
    <q-toolbar class="gt-sm">
      <div class="flex q-gutter-x-sm">
        <div>
          <div
            class="flex items-center cursor-pointer q-mr-md no-wrap"
            @click="() => router.push({ name: 'dashboard' })"
          >
            <q-img src="src/assets/logo_easy.png" width="122px" height="30px" />
          </div>

          <RateBar />
        </div>
        <NavBar />
      </div>

      <q-space />

      <!-- right -->
      <div class="flex">
        <div class="flex items-center">
          <div class="flex items-center q-mr-md">
            <q-icon name="account_circle" size="sm" class="q-mr-xs" />
            <div>
              <div class="text-caption">{{ $t('label.welcome') }}！</div>
              <div class="text-caption">
                {{ storage.getStorageSync('phone') }}
              </div>
            </div>
          </div>
          <q-separator vertical dark spaced />
          <!-- 登出btn -->
          <q-btn
            flat
            class="q-btn:visited"
            style="text-decoration: none"
            :label="t('label.logout')"
            @click="logout"
          />
        </div>

        <!-- 語言 & 幫助btn -->
        <div class="q-gutter-x-sm self-center">
          <I18nBtn />
        </div>
      </div>
    </q-toolbar>

    <!-- Medium -->
    <q-toolbar class="lt-md">
      <div class="flex q-gutter-x-sm">
        <div
          class="flex items-center cursor-pointer q-mr-md no-wrap"
          @click="() => router.push({ name: 'dashboard' })"
        >
          <q-img src="src/assets/logo_easy.png" width="122px" height="30px" />
        </div>
      </div>

      <q-space />

      <!-- right -->
      <div class="flex">
        <!-- 漢堡btn -->
        <q-btn
          rounded
          @click="() => (drawerRight = !drawerRight)"
          icon="menu"
        />
      </div>
    </q-toolbar>
  </q-header>

  <q-drawer
    side="right"
    v-model="drawerRight"
    overlay
    bordered
    :width="320"
    :breakpoint="1440"
    class="bg-grey-3 shadow-24 text-dark"
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
                {{ getRate()?.RMB_BUY }}
              </div>
            </div>

            <div class="flex justify-end">
              <div class="text-dark text-right q-mr-xs">
                {{ t('rate.sell') }}
              </div>
              <div class="text-right text-weight-bold text-red">
                {{ getRate()?.RMB_SELL }}
              </div>
            </div>
          </div>
        </div>
        <q-separator spaced />
        <!-- Nav -->
        <q-item
          v-for="(item, index) in [
            {
              name: 'transfer',
              icon: 'move_up'
            },
            {
              name: 'wallet',
              icon: 'account_balance_wallet'
            },
            {
              name: 'history',
              icon: 'receipt_long'
            },
            {
              name: 'account',
              icon: 'credit_card'
            }
          ]"
          :key="index"
          clickable
          v-ripple
          @click="
            () => {
              drawerRight = false;
              router.push({ name: item.name });
            }
          "
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section> {{ t(`label.${item.name}`) }} </q-item-section>
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
                  storage.clearStorageSync();
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
