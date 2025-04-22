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
              <ThemeToggleBar />
            </div>
            <div class="q-gutter-x-sm self-center">
              <I18nBtn />
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container
      :style="{
        height: '100vh',
        background: themes.isDark ? '#121212' : '#f5f5f5',
      }"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import logo from 'src/assets/logo_easy.png';
import I18nBtn from 'src/components/I18nBtn.vue';
// import hooks from 'src/hooks';
import ThemeToggleBar from 'src/components/ThemeToggleBar.vue';
import { useThemeStore } from 'src/stores';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const themes = useThemeStore();
const router = useRouter();
</script>

<style scoped></style>
