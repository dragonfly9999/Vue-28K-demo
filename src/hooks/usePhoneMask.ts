import { computed, Ref } from 'vue';

export default (code: Ref<string | undefined | null | number>) => {
  const mask = computed(() => {
    switch (Number(code.value)) {
      case 886:
        return '#'.repeat(10);
      case 852:
        return '#'.repeat(8);
      case 65:
        return '#'.repeat(8);
      case 86:
        return '#'.repeat(9);
      case 84:
        return '#'.repeat(8);
      case 81:
        return '#'.repeat(8);
      default:
        return '#'.repeat(10);
    }
  });

  return mask;
};
