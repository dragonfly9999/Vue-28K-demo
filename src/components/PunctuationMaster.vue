<template>
  <div
    :class="` text-${porps.type ?? 'caption'} text-${
      color ?? 'grey-5'
    } ellipsis ellipsis-2-lines  q-mt-md`"
    style="max-width: 85vw"
  >
    <div :class="`row justify-${justify ?? 'center'} items-center`">
      <div style="">
        {{ label?.slice(0, Math.ceil((label?.length * 2) / 3)) }}
      </div>
      <div :class="`text-${text_align ?? 'right'}`">
        {{
          label?.slice(Math.ceil((label?.length * 2) / 3) - label?.length) ??
          '--'
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const porps = defineProps<{
  label: string | undefined;
  type?: string;
  color?: string;
  text_align?: string;
  justify?: string;
}>();
</script>

<style scoped></style>
