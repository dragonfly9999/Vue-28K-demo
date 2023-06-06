<template>
  <q-btn round icon="language" size="sm">
    <q-menu :offset="[70, 10]">
      <q-list class="q-pa-md" style="width: 100px">
        <q-item
          clickable
          v-close-popup
          v-for="(item, index) in langs"
          :key="index"
          @click="() => handleChangeLocale(item.locale)"
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
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const handleChangeLocale = (newLocale: string) => {
  i18n.locale.value = newLocale;
};
</script>

<style lang="scss" scoped></style>
