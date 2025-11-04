import { ROLE_MOCK } from './ROLE_MOCK'
import { ROLE_AUTH_MOCK } from './ROLE_AUTH_MOCK'

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

  {
    url: '/api/v1/role/create',
    method: 'post',
    response: ({ body }) => {
      if (ROLE_MOCK.some(role => role.name === body.name)) {
        return {
          code: 400,
          message: 'The role with this role name already exists in the system.'
        }
      }

      const new_id = Math.max(...ROLE_MOCK.map(r => r.id), 0) + 1
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
      const new_role = {
        id: new_id,
        name: body.name,
        desc: body.desc || '',
        created_at: now,
        updated_at: now
      }

      ROLE_MOCK.push(new_role)

      return {
        code: 200,
        message: 'Created Successfully',
        data: new_role
      }
    }
  },

  {
    url: '/api/v1/role/update',
    method: 'post',
    response: ({ body }) => {
      const target = ROLE_MOCK.find(item => item.id === body.id)
      if (!target) {
        return { code: 404, message: 'role ID does not exist' }
      }

      if (
        body.name &&
        body.name !== target.name &&
        ROLE_MOCK.some(item => item.name === body.name && item.id !== body.id)
      ) {
        return {
          code: 400,
          message: 'The role with this role name already exists in the system.'
        }
      }

      if (body.name !== undefined) target.name = body.name
      if (body.desc !== undefined) target.desc = body.desc
      target.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return {
        code: 200,
        message: 'Updated Successfully',
        data: target
      }
    }
  },

  {
    url: '/api/v1/role/delete',
    method: 'delete',
    response: ({ query }) => {
      const role_id = Number(query.role_id)
      const index = ROLE_MOCK.findIndex(item => item.id === role_id)

      if (index === -1) {
        return { code: 404, message: 'role ID does not exist' }
      }

      const deleted = ROLE_MOCK.splice(index, 1)[0]
      return {
        code: 200,
        message: 'Deleted Success',
        data: deleted
      }
    }
  },

  {
    url: '/api/v1/role/authorized',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: ROLE_AUTH_MOCK
      }
    }
  }
]
