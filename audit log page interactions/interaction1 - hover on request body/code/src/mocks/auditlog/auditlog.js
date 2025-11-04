import { AUDIT_LOG_MOCK } from "./AUDIT_LOG_MOCK"

export default [
  {
    url: '/api/v1/auditlog/list',
    method: 'get',
    response: ({ query }) => {
      let {
        page = 1,
        page_size = 10,
        username = '',
        module = '',
        method = '',
        summary = '',
        status,
        start_time,
        end_time,
      } = query

      page = Number(page)
      page_size = Number(page_size)

      let data = [...AUDIT_LOG_MOCK]

      // 过滤条件
      if (username) {
        data = data.filter(item => item.username.includes(username))
      }
      if (module) {
        data = data.filter(item => item.module.includes(module))
      }
      if (method) {
        data = data.filter(item => item.method === method)
      }
      if (summary) {
        data = data.filter(item => item.summary.includes(summary))
      }
      if (status !== undefined && status !== '' && status !== null) {
        data = data.filter(item => item.status === Number(status))
      }

      // 时间过滤
      if (start_time) {
        const start = new Date(start_time).getTime()
        data = data.filter(item => new Date(item.created_at).getTime() > start)
      }
      if (end_time) {
        const end = new Date(end_time).getTime()
        data = data.filter(item => new Date(item.created_at).getTime() < end)
      }

      // 分页
      const total = data.length
      const startIndex = (page - 1) * page_size
      const endIndex = page * page_size
      const pageData = data.slice(startIndex, endIndex)

      return {
        code: 200,
        data: pageData,
        total,
        page,
        page_size,
      }
    },
  },
]
