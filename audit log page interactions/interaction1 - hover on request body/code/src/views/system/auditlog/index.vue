<script setup>
import { onMounted, ref } from 'vue'
import { NInput, NSelect, NPopover } from 'naive-ui'

import CommonPage from '@/components/page/CommonPage.vue'
import QueryBarItem from '@/components/query-bar/QueryBarItem.vue'
import CrudTable from '@/components/table/CrudTable.vue'

import api from '@/api'

defineOptions({ name: 'Audit Log' })

const $table = ref(null)
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)

  const pad = (num) => num.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1) // month is 0-indexed, so add 1 here
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function getStartOfDayTimestamp() {
  const now = new Date()
  now.setFullYear(now.getFullYear() - 1) // 回到去年同一天
  now.setHours(0, 0, 0, 0) // 设置为当天的零点
  return now.getTime()
}

function getEndOfDayTimestamp() {
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  return now.getTime()
}

const startOfDayTimestamp = getStartOfDayTimestamp()
const endOfDayTimestamp = getEndOfDayTimestamp()

queryItems.value.start_time = formatTimestamp(startOfDayTimestamp)
queryItems.value.end_time = formatTimestamp(endOfDayTimestamp)

const datetimeRange = ref([startOfDayTimestamp, endOfDayTimestamp])

function formatJSON(data) {
  try {
    return typeof data === 'string' 
      ? JSON.stringify(JSON.parse(data), null, 2)
      : JSON.stringify(data, null, 2)
  } catch (e) {
    return data || 'no data'
  }
}

const columns = [
  {
    title: 'user name',
    key: 'username',
    width: 'auto',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'API summary',
    key: 'summary',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'module',
    key: 'module',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'method',
    key: 'method',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'path',
    key: 'path',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'status code',
    key: 'status',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'request body',
    key: 'request_body',
    align: 'center',
    width: 80,
    render: (row) => {
      return h(
        NPopover,
        {
          trigger: 'hover',
          placement: 'right',
        },
        {
          trigger: () =>
            h('div', 
              { style: 'cursor: pointer;' }, 
              [h('img', {
                          src: 'https://placehold.co/1920/0606FC/0606FC?text=1',
                          style: 'width: 20px; height: 20px; border-radius: 4px;'
                        })]),
          default: () =>
            h(
              'pre',
              {
                style:
                  'max-height: 400px; overflow: auto; background-color: #f5f5f5; padding: 8px; border-radius: 4px;',
              },
              formatJSON(row.request_args)
            ),
        }
      )
    },
  },
  {
    title: 'response body',
    key: 'response_body',
    align: 'center',
    width: 80,
    render: (row) => {
      return h('div', 
              { style: 'cursor: pointer;' }, 
              [h('img', {
                          src: 'https://placehold.co/1920/0606FC/0606FC?text=1',
                          style: 'width: 20px; height: 20px; border-radius: 4px;'
                        })])
    },
  },
  {
    title: 'response time(s)',
    key: 'response_time',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
  {
    title: 'created at',
    key: 'created_at',
    align: 'center',
    width: 'auto',
    ellipsis: { tooltip: true },
  },
]
</script>

<template>
  <CommonPage>
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.getAuditLogList"
    >
      <template #queryBar>
        <QueryBarItem label="user name" :label-width="70">
          <NInput
            v-model:value="queryItems.username"
            clearable
            type="text"
            placeholder="please input user name"
          />
        </QueryBarItem>
        <QueryBarItem label="module" :label-width="70">
          <NInput
            v-model:value="queryItems.module"
            clearable
            type="text"
            placeholder="please input module"
          />
        </QueryBarItem>
        <QueryBarItem label="API summary" :label-width="70">
          <NInput
            v-model:value="queryItems.summary"
            clearable
            type="text"
            placeholder="please input summary"
          />
        </QueryBarItem>
        <QueryBarItem label="method" :label-width="70">
          <NSelect
            v-model:value="queryItems.method"
            style="width: 180px"
            clearable
            placeholder="please select method"
          />
        </QueryBarItem>
        <QueryBarItem label="path" :label-width="70">
          <NInput
            v-model:value="queryItems.path"
            clearable
            type="text"
            placeholder="please input path"
          />
        </QueryBarItem>
        <QueryBarItem label="status code" :label-width="60">
          <NInput
            v-model:value="queryItems.status"
            clearable
            type="text"
            placeholder="please input code"
          />
        </QueryBarItem>
        <QueryBarItem label="access time" :label-width="70">
          <NDatePicker
            v-model:value="datetimeRange"
            type="datetimerange"
            clearable
            placeholder="please select time range"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
</template>
