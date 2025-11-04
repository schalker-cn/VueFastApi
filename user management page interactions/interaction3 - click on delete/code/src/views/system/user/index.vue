<script setup>
import { h, onMounted, ref } from 'vue'
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NForm,
  NFormItem,
  NImage,
  NInput,
  NSpace,
  NSwitch,
  NTag,
  NPopconfirm,
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NTreeSelect,
} from 'naive-ui'

import CommonPage from '@/components/page/CommonPage.vue'
import QueryBarItem from '@/components/query-bar/QueryBarItem.vue'
import CrudTable from '@/components/table/CrudTable.vue'

import { formatDate } from '@/utils'
import api from '@/api'
import TheIcon from '@/components/icon/TheIcon.vue'

defineOptions({ name: 'User Management' })

const $table = ref(null)
const queryItems = ref({})

const roleOption = ref([])
const deptOption = ref([])

onMounted(() => {
  $table.value?.handleSearch()
  api.getRoleList({ page: 1, page_size: 9999 }).then((res) => (roleOption.value = res.data))
  api.getDepts().then((res) => (deptOption.value = res.data))
})

const columns = [
  {
    title: 'username',
    key: 'username',
    width: 60,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'email',
    key: 'email',
    width: 60,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'role',
    key: 'role',
    width: 60,
    align: 'center',
    render(row) {
      const roles = row.roles ?? []
      const group = []
      for (let i = 0; i < roles.length; i++)
        group.push(
          h(NTag, { type: 'info', style: { margin: '2px 3px' } }, { default: () => roles[i].name })
        )
      return h('span', group)
    },
  },
  {
    title: 'department',
    key: 'dept.name',
    align: 'center',
    width: 40,
    ellipsis: { tooltip: true },
  },
  {
    title: 'is superuser',
    key: 'is_superuser',
    align: 'center',
    width: 40,
    render(row) {
      return h(
        NTag,
        { type: 'info', style: { margin: '2px 3px' } },
        { default: () => (row.is_superuser ? 'YES' : 'NO') }
      )
    },
  },
  {
    title: 'last login',
    key: 'last_login',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
    render(row) {
      return h(
        NButton,
        { size: 'small', type: 'text', ghost: true },
        {
          default: () => (row.last_login !== null ? formatDate(row.last_login) : null),
        }
      )
    },
  },
  {
    title: 'banned',
    key: 'is_active',
    width: 50,
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.is_active,
        loading: !!row.publishing,
        checkedValue: false,
        uncheckedValue: true,
      })
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
          NPopconfirm,
          {
            onPositiveClick: () => {},
            onNegativeClick: () => {},
          },
          {
            trigger: () =>
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
            default: () => h('div', {}, 'are you sure to delete this user?'),
          }
        ),
      ]
    },
  },
]

const nodeProps = ({ option }) => {
  return {
  }
}
</script>

<template>
  <NLayout has-sider wh-full>
    <NLayoutSider
      bordered
      content-style="padding: 24px;"
      :collapsed-width="0"
      :width="240"
      show-trigger="arrow-circle"
    >
      <h1>Department List</h1>
      <br />
      <NTree
        block-line
        :data="deptOption"
        key-field="id"
        label-field="name"
        default-expand-all
        :node-props="nodeProps"
      >
      </NTree>
    </NLayoutSider>
    <NLayoutContent>
      <CommonPage show-footer title="User List">
        <template #action>
          <NButton type="primary">
            <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create User
          </NButton>
        </template>
        <!-- table -->
        <CrudTable
          ref="$table"
          v-model:query-items="queryItems"
          :columns="columns"
          :get-data="api.getUserList"
        >
          <template #queryBar>
            <QueryBarItem label="username" :label-width="40">
              <NInput
                v-model:value="queryItems.username"
                clearable
                type="text"
                placeholder="type username here"
              />
            </QueryBarItem>
            <QueryBarItem label="email" :label-width="40">
              <NInput
                v-model:value="queryItems.email"
                clearable
                type="text"
                placeholder="type email here"
              />
            </QueryBarItem>
          </template>
        </CrudTable>
      </CommonPage>
    </NLayoutContent>
  </NLayout>
</template>
