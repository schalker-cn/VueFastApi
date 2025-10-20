<template>
  <n-icon size="20" cursor-pointer>
    <img
      class="collapse-icon"
      src="https://placehold.co/20/0606FC/0606FC?text=1"
      @click="appStore.switchCollapsed"
    />
  </n-icon>
</template>

<script setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>
