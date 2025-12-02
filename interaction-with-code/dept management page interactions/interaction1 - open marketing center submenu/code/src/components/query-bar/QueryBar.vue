<template>
  <div
    bg="#fafafc"
    min-h-60
    flex
    items-start
    justify-between
    b-1
    rounded-8
    p-15
    bc-ccc
    dark:bg-black
  >
    <n-space wrap :size="[35, 15]">
      <slot />
      <div>
        <n-button secondary type="primary">Reset</n-button>
        <n-button ml-20 type="primary">Search</n-button>
      </div>
    </n-space>
  </div>
</template>

<script setup>
const emit = defineEmits(['search', 'reset'])
</script>
