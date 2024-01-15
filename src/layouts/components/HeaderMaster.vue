<template>
  <q-header reveal class="q-pa-md" style="background: #242e47; z-index: 5">
    <!-- Large -->
    <q-toolbar class="gt-sm">
      <div class="flex q-gutter-x-sm">
        <div>
          <div
            class="flex items-center cursor-pointer q-mr-md no-wrap"
            @click="() => router.push({ name: 'dashboard' })"
          >
            <q-img :src="logo" width="122px" height="30px" />
          </div>

          <RateBar :rate="getRates()" />
        </div>
        <NavBar />
      </div>

      <q-space />

      <!-- right -->
      <div class="flex q-gutter-x-sm">
        <div class="flex items-center">
          <q-icon name="account_circle" size="md" class="q-mr-xs" />
          <div>
            <div class="text-caption">{{ $t('label.welcome') }}！</div>
            <div class="text-caption">
              {{ storage.getStorageSync('phone') }}
            </div>
          </div>
        </div>
        <!-- 登出btn -->
        <q-btn
          flat
          class="q-btn:visited"
          style="text-decoration: none"
          :label="t('label.logout')"
          @click="logout"
        />

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
          <q-img :src="logo" width="122px" height="30px" />
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
                {{ getRates()?.RMB_BUY }}
              </div>
            </div>

            <div class="flex justify-end">
              <div class="text-dark text-right q-mr-xs">
                {{ t('rate.sell') }}
              </div>
              <div class="text-right text-weight-bold text-red">
                {{ getRates()?.RMB_SELL }}
              </div>
            </div>
          </div>
        </div>
        <q-separator spaced />
        <!-- Nav -->
        <q-expansion-item
          no-separator
          icon="attach_money"
          :label="t('交易')"
          default-closed
          v-if="!isAgent"
        >
          <q-list>
            <q-item clickable @click="() => router.push({ name: 'buy' })">
              <q-item-section>
                <q-item-label class="q-px-md">{{ t('購買') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="() => router.push({ name: 'sell' })"
            >
              <q-item-section>
                <q-item-label class="q-px-md">{{ t('出售') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-item
          v-for="(item, index) in [
            {
              name: 'transfer',
              icon: 'move_up',
            },
            {
              name: 'wallet',
              icon: 'account_balance_wallet',
            },
            {
              name: 'history',
              icon: 'receipt_long',
            },
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
          <q-item-section>
            {{ t(`label.${item.name}`) }}
          </q-item-section>
        </q-item>

        <q-item
          v-if="isAgent"
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
          <q-item-section>
            {{ t(`label.account`) }}
          </q-item-section>
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
            <q-item-section class="q-px-md"> {{ lang.name }} </q-item-section>
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
            <q-btn @click="logout" :label="$t('label.logout')" icon="logout" />
          </div>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import langs from 'src/i18n';
import I18nBtn from 'src/components/I18nBtn.vue';
import { useLiveStore, useStateStore } from 'src/stores';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStorage } from 'vue3-storage';
import RateBar from 'src/components/RateBar.vue';
import NavBar from 'src/components/NavBar.vue';
import logo from 'src/assets/logo_easy.png';

const { updateAuto, getRates } = useStateStore();
const router = useRouter();
const { t } = useI18n();
const storage = useStorage();
const i18n = useI18n();
const { cleanLive } = useLiveStore();
// DOM
const drawerRight = ref(false);
const isAgent = computed(() => storage.getStorageSync('isAgent'));

const logout = () => {
  if (useStorage().getStorageSync('isAgent')) {
    updateAuto(0);
  }
  setTimeout(() => {
    cleanLive();
    storage.clearStorageSync();
    router.push({ name: 'login' });
  }, 100);
};
</script>

<style scoped></style>
