<template>
  <n-dropdown>
    <div flex cursor-pointer items-center>
      <img src="https://placehold.co/1920/0606FC/0606FC?text=1" mr10 h-35 w-35 rounded-full />
      <span>{{ userStore.name }}</span>
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store'

const userStore = useUserStore()

</script>
