<template>
  <q-page padding class="row justify-center">
    <div class="container">
      <RouterView />
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
<style scoped lang="scss">
div.container {
  width: 95%;
  max-width: 900px;
}
</style>
