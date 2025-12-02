import { ROLE_MOCK } from './ROLE_MOCK'

export default [
  {
    url: '/api/v1/role/list',
    method: 'get',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const page_size = Number(query.page_size) || 10
      let data = ROLE_MOCK

      if (query.role_name) {
        const role_name = query.role_name.toLowerCase()
        data = data.filter(item => item.name.toLowerCase().includes(role_name))
      }

      const total = data.length
      const start = (page - 1) * page_size
      const end = start + page_size
      const pagedData = data.slice(start, end)

      return {
        code: 200,
        data: pagedData,
        total,
        page,
        page_size
      }
    }
  },

]
