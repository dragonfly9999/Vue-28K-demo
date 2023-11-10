<script setup lang="ts">
import logo from 'src/assets/logo_easy.png';
import I18nBtn from 'src/components/I18nBtn.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
  <q-layout view="hHh lpr fff">
    <!-- header -->
    <q-header reveal class="q-pa-md" style="background: #242e47">
      <q-toolbar>
        <!-- left -->
        <div class="flex q-gutter-x-xs">
          <div
            class="flex items-center cursor-pointer q-mr-md"
            @click="() => router.push({ name: 'dashboard' })"
          >
            <q-img alt="test" :src="logo" width="122px" height="30px" />
          </div>
        </div>

        <q-space />

        <!-- right -->
        <div class="flex">
          <div class="flex q-gutter-x-xs">
            <div class="q-gutter-x-sm self-center">
              <I18nBtn />
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container style="margin-top: 30px">
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
