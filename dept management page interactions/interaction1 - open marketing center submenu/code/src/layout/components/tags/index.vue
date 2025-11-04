<template>
  <ScrollX ref="scrollXRef" class="bg-white dark:bg-dark!">
    <n-tag
      v-for="tag in tagsStore.tags"
      ref="tabRefs"
      :key="tag.path"
      class="mx-5 cursor-pointer rounded-4 px-15 hover:color-primary"
      :type="tagsStore.activeTag === tag.path ? 'primary' : 'default'"
      :closable="tagsStore.tags.length > 1"
    >
      {{ tag.title }}
    </n-tag>
  </ScrollX>
</template>

<script setup>
import { useTagsStore } from '@/store'
import ScrollX from '@/components/common/ScrollX.vue'

const route = useRoute()
const tagsStore = useTagsStore()
const tabRefs = ref([])
const scrollXRef = ref(null)

watch(
  () => route.path,
  () => {
    const { name, fullPath: path } = route
    const title = route.meta?.title
    tagsStore.addTag({ name, path, title })
  },
  { immediate: true },
)

watch(
  () => tagsStore.activeIndex,
  async (activeIndex) => {
    await nextTick()
    const activeTabElement = tabRefs.value[activeIndex]?.$el
    if (!activeTabElement) return
    const { offsetLeft: x, offsetWidth: width } = activeTabElement
    scrollXRef.value?.handleScroll(x + width, width)
  },
  { immediate: true },
)
</script>

<style>
.n-tag__close {
  box-sizing: content-box;
  border-radius: 50%;
  font-size: 12px;
  padding: 2px;
  transform: scale(0.9);
  transform: translateX(5px);
  transition: all 0.3s;
}
</style>
