<template>
  <q-layout view="hHh lpr fff">
    <!-- header -->
    <q-header
      elevated
      class="k28AuthHeader"
      style="background-color: transparent; backdrop-filter: blur(12px)"
    >
      <q-toolbar>
        <!-- left -->
        <q-btn flat @click="() => router.push({ name: 'login' })">
          <q-img
            class="auth-logo"
            :src="AuthLayoutLogo"
            alt="Logo"
            width="137px"
            height="40px"
          />
        </q-btn>

        <!-- space  -->
        <q-space />

        <!-- right -->
        <div class="toolArea flex">
          <ThemeToggleBar />

          <div>
            <I18nBtn />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container
      :style="{
        height: '100vh',
        background: themes.isDark ? 'rgba(33, 30, 54, 1)' : '#f5f5f5',
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
import { useRouter } from 'vue-router';
import AuthLayoutLogo from 'src/assets/images/k28_authLayout_logo.png';

const themes = useThemeStore();
const router = useRouter();
</script>

<style scoped>
.k28AuthHeader {
  background-image: linear-gradient(
    to right,
    #250453 16%,
    rgba(82, 9, 185, 0.3)
  );
}

.toolArea div {
  margin-right: 1rem;
  margin-left: 0.8rem;
}
</style>
