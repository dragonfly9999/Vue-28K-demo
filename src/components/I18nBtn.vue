<template>
  <q-btn round icon="language" size="sm">
    <q-menu :offset="[70, 10]">
      <q-list style="width: 100px">
        <q-item
          clickable
          v-close-popup
          v-for="(item, index) in langs"
          :key="index"
          @click="() => ($i18n.locale = item.locale)"
        >
          <q-item-section>
            {{ item?.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import langs from 'src/i18n';
</script>

<style lang="scss" scoped></style>
