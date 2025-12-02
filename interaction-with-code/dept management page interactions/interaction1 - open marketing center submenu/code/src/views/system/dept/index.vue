<script setup>
import { h, onMounted, ref } from 'vue'
import { NButton, NInput } from 'naive-ui'

import CommonPage from '@/components/page/CommonPage.vue'
import QueryBarItem from '@/components/query-bar/QueryBarItem.vue'
import CrudTable from '@/components/table/CrudTable.vue'
import TheIcon from '@/components/icon/TheIcon.vue'
import api from '@/api'

defineOptions({ name: 'Department Management' })

const $table = ref(null)
const queryItems = ref({})

const deptOption = ref([])

onMounted(() => {
  $table.value?.handleSearch()
  api.getDepts().then((res) => (deptOption.value = res.data))
})

const columns = [
  {
    title: 'department name',
    key: 'name',
    width: 'auto',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'department detail',
    key: 'desc',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'actions',
    key: 'actions',
    width: 'auto',
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: 'margin-left: 8px;',
            },
            {
              default: () => 'edit',
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: 'margin-left: 8px;',
            },
            {
              default: () => 'delete',
            }
          ),
      ]
    },
  },
]
</script>

<template>
  <CommonPage show-footer title="Department List">
    <template #action>
      <div>
        <NButton
          class="float-right mr-15"
          type="primary"
        >
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create Department
        </NButton>
      </div>
    </template>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.getDepts"
    >
      <template #queryBar>
        <QueryBarItem label="department name" :label-width="80">
          <NInput
            v-model:value="queryItems.name"
            clearable
            type="text"
            placeholder="department name"
          />
        </QueryBarItem>
      </template>
    </CrudTable>

  </CommonPage>
</template>
