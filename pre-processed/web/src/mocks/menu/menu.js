import { MENU_MOCK } from './MENU_MOCK'

export default [
  {
    url: '/api/v1/menu/list',
    method: 'get',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const page_size = Number(query.page_size) || 10
      return {
        code: 200,
        data: MENU_MOCK,
        total: MENU_MOCK.length,
        page,
        page_size
      }
    }
  },
  {
    url: '/api/v1/menu/update',
    method: 'post',
    response: ({ body }) => {
      const target = MENU_MOCK.find(item => item.id === body.id)
      if (!target) {
        return {
          code: 404,
          message: 'Menu item not found'
        }
      }
      Object.assign(target, body)
      return {
        code: 200,
        message: 'Updated Success'
      }
    }
  }
]
