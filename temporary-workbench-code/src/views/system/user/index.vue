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
import CrudModal from '@/components/table/CrudModal.vue'
import CrudTable from '@/components/table/CrudTable.vue'

import { formatDate, renderIcon } from '@/utils'
import { useCRUD } from '@/composables'
// import { loginTypeMap, loginTypeOptions } from '@/constant/data'
import api from '@/api'
import TheIcon from '@/components/icon/TheIcon.vue'
import { useUserStore } from '@/store'

defineOptions({ name: 'User Management' })

const $table = ref(null)
const queryItems = ref({})

const {
  modalVisible,
  modalTitle,
  modalAction,
  modalLoading,
  handleSave,
  modalForm,
  modalFormRef,
  handleEdit,
  handleDelete,
  handleAdd,
} = useCRUD({
  name: 'user',
  initForm: {},
  doCreate: api.createUser,
  doUpdate: api.updateUser,
  doDelete: api.deleteUser,
  refresh: () => $table.value?.handleSearch(),
})

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
        onUpdateValue: () => handleUpdateDisable(row),
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
              onClick: () => {
                handleEdit(row)
                modalForm.value.dept_id = row.dept?.id
                modalForm.value.role_ids = row.roles.map((e) => (e = e.id))
                delete modalForm.value.dept
              },
            },
            {
              default: () => 'edit',
            }
          ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete({ user_id: row.id }, false),
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

// 修改用户禁用状态
async function handleUpdateDisable(row) {
  if (!row.id) return
  const userStore = useUserStore()
  if (userStore.userId === row.id) {
    $message.error('current user cannot be banned')
    return
  }
  row.publishing = true
  row.is_active = row.is_active === false ? true : false
  row.publishing = false
  const role_ids = []
  row.roles.forEach((e) => {
    role_ids.push(e.id)
  })
  row.role_ids = role_ids
  row.dept_id = row.dept?.id
  try {
    await api.updateUser(row)
    $message?.success(row.is_active ? 'ban discarded' : 'ban successful')
    $table.value?.handleSearch()
  } catch (err) {
    row.is_active = row.is_active === false ? true : false
  } finally {
    row.publishing = false
  }
}

let lastClickedNodeId = null

const nodeProps = ({ option }) => {
  return {
    onClick() {
      if (lastClickedNodeId === option.id) {
        $table.value?.handleSearch()
        lastClickedNodeId = null
      } else {
        api.getUserList({ dept_id: option.id }).then((res) => {
          $table.value.tableData = res.data
          lastClickedNodeId = option.id
        })
      }
    },
  }
}

const validateAddUser = {
  username: [
    {
      required: true,
      message: 'user nmae',
      trigger: ['input', 'blur'],
    },
  ],
  email: [
    {
      required: true,
      message: 'email address',
      trigger: ['input', 'change'],
    },
    {
      trigger: ['blur'],
      validator: (rule, value, callback) => {
        const re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!re.test(modalForm.value.email)) {
          callback('email format is incorrect')
          return
        }
        callback()
      },
    },
  ],
  password: [
    {
      required: true,
      message: 'create password',
      trigger: ['input', 'blur', 'change'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: 'confirm password',
      trigger: ['input'],
    },
    {
      trigger: ['blur'],
      validator: (rule, value, callback) => {
        if (value !== modalForm.value.password) {
          callback('the given password does not match')
          return
        }
        callback()
      },
    },
  ],
  roles: [
    {
      type: 'array',
      required: true,
      message: 'please select at least one role',
      trigger: ['blur', 'change'],
    },
  ],
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
          <NButton type="primary" @click="handleAdd">
            <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create User
          </NButton>
        </template>
        <!-- 表格 -->
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
                @keypress.enter="$table?.handleSearch()"
              />
            </QueryBarItem>
            <QueryBarItem label="email" :label-width="40">
              <NInput
                v-model:value="queryItems.email"
                clearable
                type="text"
                placeholder="type email here"
                @keypress.enter="$table?.handleSearch()"
              />
            </QueryBarItem>
          </template>
        </CrudTable>

        <CrudModal
          v-model:visible="modalVisible"
          :title="modalTitle"
          :loading="modalLoading"
          @save="handleSave"
        >
          <NForm
            ref="modalFormRef"
            label-placement="left"
            label-align="left"
            :label-width="80"
            :model="modalForm"
            :rules="validateAddUser"
          >
            <NFormItem label="user name" path="username">
              <NInput v-model:value="modalForm.username" clearable placeholder="type username here" />
            </NFormItem>
            <NFormItem label="email" path="email">
              <NInput v-model:value="modalForm.email" clearable placeholder="type email here" />
            </NFormItem>
            <NFormItem v-if="modalAction === 'add'" label="password" path="password">
              <NInput
                v-model:value="modalForm.password"
                show-password-on="mousedown"
                type="password"
                clearable
                placeholder="please set password"
              />
            </NFormItem>
            <NFormItem v-if="modalAction === 'add'" label="confirm password" path="confirmPassword">
              <NInput
                v-model:value="modalForm.confirmPassword"
                show-password-on="mousedown"
                type="password"
                clearable
                placeholder="please confirm password"
              />
            </NFormItem>
            <NFormItem label="role" path="role_ids">
              <NCheckboxGroup v-model:value="modalForm.role_ids">
                <NSpace item-style="display: flex;">
                  <NCheckbox
                    v-for="item in roleOption"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  />
                </NSpace>
              </NCheckboxGroup>
            </NFormItem>
            <NFormItem label="is superuser" path="is_superuser">
              <NSwitch
                v-model:value="modalForm.is_superuser"
                size="small"
                :checked-value="true"
                :unchecked-value="false"
              ></NSwitch>
            </NFormItem>
            <NFormItem label="banned" path="is_active">
              <NSwitch
                v-model:value="modalForm.is_active"
                :checked-value="false"
                :unchecked-value="true"
                :default-value="true"
              />
            </NFormItem>
            <NFormItem label="department" path="dept_id">
              <NTreeSelect
                v-model:value="modalForm.dept_id"
                :options="deptOption"
                key-field="id"
                label-field="name"
                placeholder="please select department"
                clearable
                default-expand-all
              ></NTreeSelect>
            </NFormItem>
          </NForm>
        </CrudModal>
      </CommonPage>
    </NLayoutContent>
  </NLayout>
</template>
