<script setup>
import { h, onMounted, ref } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NPopconfirm,
  NTag,
  NTree,
  NDrawer,
  NDrawerContent,
  NTabs,
  NTabPane,
} from 'naive-ui'

import CommonPage from '@/components/page/CommonPage.vue'
import QueryBarItem from '@/components/query-bar/QueryBarItem.vue'
import CrudTable from '@/components/table/CrudTable.vue'

import { formatDate } from '@/utils'
import api from '@/api'
import TheIcon from '@/components/icon/TheIcon.vue'

defineOptions({ name: 'Role Management' })

const $table = ref(null)
const queryItems = ref({})

const pattern = ref('')
const menuOption = ref([])
const active = ref(false)
const menu_ids = ref([])
const role_id = ref(0)

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  {
    title: 'role name',
    key: 'name',
    width: 80,
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {
      return h(NTag, { type: 'info' }, { default: () => row.name })
    },
  },
  {
    title: 'role detail',
    key: 'desc',
    width: 80,
    align: 'center',
  },
  {
    title: 'created at',
    key: 'created_at',
    width: 60,
    align: 'center',
    render(row) {
      return h('span', formatDate(row.created_at))
    },
  },
  {
    title: 'actions',
    key: 'actions',
    width: 80,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: 'margin-right: 8px;',
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
              style: 'margin-right: 8px;',
            },
            {
              default: () => 'delete',
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: async () => {
                try {
                  // use Promise.all to fetch all requests
                  const [menusResponse, roleAuthorizedResponse] = await Promise.all([
                    api.getMenus({ page: 1, page_size: 9999 }),
                    api.getRoleAuthorized({ id: row.id }),
                  ])

                  menuOption.value = menusResponse.data
                  menu_ids.value = roleAuthorizedResponse.data.menus.map((v) => v.id)

                  active.value = true
                  role_id.value = row.id
                } catch (error) {
                  console.error('Error loading data:', error)
                }
              },
            },
            {
              default: () => 'set access',
            }
          ),
      ]
    },
  },
]

</script>

<template>
  <CommonPage show-footer title="Role List">
    <template #action>
      <NButton type="primary">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create Role
      </NButton>
    </template>

    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.getRoleList"
    >
      <template #queryBar>
        <QueryBarItem label="role name" :label-width="50">
          <NInput
            v-model:value="queryItems.role_name"
            clearable
            type="text"
            placeholder="please input role name"
          />
        </QueryBarItem>
      </template>
    </CrudTable>

    <NDrawer v-model:show="active" placement="right" :width="500"
      ><NDrawerContent>
        <NTabs>
          <NTabPane name="menu" tab="menu access" display-directive="show">
            <NTree
              :data="menuOption"
              :checked-keys="menu_ids"
              :pattern="pattern"
              :show-irrelevant-nodes="false"
              key-field="id"
              label-field="name"
              checkable
              :default-expand-all="true"
              :block-line="true"
              :selectable="false"
            />
          </NTabPane>
        </NTabs>
        <template #header> set access </template>
      </NDrawerContent>
    </NDrawer>
  </CommonPage>
</template>
