<script setup>
import { useAppStore } from '@/store'
import { useDark, useToggle } from '@vueuse/core'

const appStore = useAppStore()
const isDark = useDark()
const toggleDark = () => {
  appStore.toggleDark()
  useToggle(isDark)()
}
</script>

<template>
  <n-icon mr-20 cursor-pointer size="18">
    <img
      class="collapse-icon"
      src="https://placehold.co/20/0606FC/0606FC?text=1"
      @click="toggleDark"
    />
  </n-icon>
</template>
