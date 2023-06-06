<script setup lang="ts">
import logo from 'src/assets/logo_easy.png';
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

    <!-- footer -->
    <q-footer class="text-white" style="background: #242e47">
      <div class="wrap" style="margin: 0.5rem; padding: 2rem">
        <div>
          <div class="flex">
            <div class="col-12 col-md">
              <div class="flex items-center">
                <!-- logo -->

                <q-img
                  :src="logo"
                  width="260px"
                  height="60px"
                  class="q-mr-sm"
                />
              </div>
            </div>
            <div
              class="col-12 col-md gt-sm flex justify-end text-subtitle1 text-right"
            ></div>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<style scoped></style>
