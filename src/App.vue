<template>
  <suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <h1>Loading...</h1>
    </template>
  </suspense>
</template>

<script setup lang="ts"></script>
