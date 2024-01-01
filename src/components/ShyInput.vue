<script setup lang="ts">
import { ValidationRule } from 'quasar';
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: string;
  style?: CSSStyleSheet;
  class?: string;
  label: string;
  rules?: Array<ValidationRule>;
  lazyRules?: boolean;
}>();
defineEmits(['update:model-value']);

const customClass = computed(() => props.class);

const visible = ref(false);
</script>
<template>
  <q-input
    :lazy-rules="lazyRules"
    :rules="rules"
    style="
       {
        ..style;
      }
    "
    :class="customClass"
    outlined
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:model-value', value)"
    :type="visible ? 'text' : 'password'"
    :label="label"
  >
    <template v-slot:append>
      <q-icon
        :name="visible ? 'visibility' : 'visibility_off'"
        class="cursor-pointer"
        @click="visible = !visible"
      />
    </template>
  </q-input>
</template>

<style scoped></style>
