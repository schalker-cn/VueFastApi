// mock/user.js
import { USER_MOCK } from './USER_MOCK'
import { DEPT_MOCK } from '../dept/DEPT_MOCK'
import { ROLE_MOCK } from '../role/ROLE_MOCK'

function flattenDepts(depts) {
  const flat = []
  for (const dept of depts) {
    flat.push(dept)
    if (dept.children && dept.children.length) {
      flat.push(...flattenDepts(dept.children))
    }
  }
  return flat
}

export default [
  {
    url: '/api/v1/user/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, page_size = 10, username = '', email = '', dept_id } = query
      let data = [...USER_MOCK]
      const flatDepts = flattenDepts(DEPT_MOCK)

      if (username) {
        data = data.filter(u => u.username.toLowerCase().includes(username.toLowerCase()))
      }
      if (email) {
        data = data.filter(u => u.email && u.email.toLowerCase().includes(email.toLowerCase()))
      }
      if (dept_id !== undefined && dept_id !== null && dept_id !== '') {
        const deptIdNum = Number(dept_id)
        data = data.filter(u => u.dept_id === deptIdNum)
      }

      data = data.map(user => {
        const deptMatch = flatDepts.find(d => d.id === user.dept_id)
        return {
          ...user,
          dept: deptMatch || null
        }
      })

      return {
        code: 200,
        msg: 'Success',
        data,
        total: data.length,
        page: Number(page),
        page_size: Number(page_size)
      }
    }
  },
  {
    url: '/api/v1/user/create',
    method: 'post',
    response: ({ body }) => {
      const { email, username, is_active, is_superuser, dept_id, role_ids } = body

      if (USER_MOCK.some(u => u.email === email)) {
        return { code: 400, msg: 'The user with this email already exists in the system.' }
      }

      const newId = Math.max(...USER_MOCK.map(u => u.id), 0) + 1
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

      const roleObjs = ROLE_MOCK.filter(r => role_ids.includes(r.id))

      const newUser = {
        id: newId,
        email,
        username,
        is_active,
        is_superuser,
        dept_id,
        roles: roleObjs,
        phone: null,
        alias: null,
        last_login: null,
        created_at: now,
        updated_at: now
      }

      USER_MOCK.push(newUser)

      return { code: 200, msg: 'Created Successfully', data: newUser }
    }
  },
  {
    url: '/api/v1/user/update',
    method: 'post',
    response: ({ body }) => {
      const { id, email, username, is_active, is_superuser, dept_id, role_ids } = body
      const user = USER_MOCK.find(u => u.id === id)
      if (!user) {
        return { code: 404, msg: 'User not found.' }
      }

      if (USER_MOCK.some(u => u.email === email && u.id !== id)) {
        return { code: 400, msg: 'The user with this email already exists in the system.' }
      }

      const roleObjs = ROLE_MOCK.filter(r => role_ids.includes(r.id))

      user.email = email
      user.username = username
      user.is_active = is_active
      user.is_superuser = is_superuser
      user.dept_id = dept_id
      user.roles = roleObjs
      user.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')

      return { code: 200, msg: 'Updated Successfully', data: user }
    }
  },
  {
    url: '/api/v1/user/delete',
    method: 'delete',
    response: ({ query }) => {
      const { user_id } = query
      const index = USER_MOCK.findIndex(u => u.id === Number(user_id))
      if (index === -1) {
        return { code: 404, msg: 'User not found.' }
      }
      const deleted = USER_MOCK.splice(index, 1)[0]
      return { code: 200, msg: 'Deleted Success', data: deleted }
    }
  }
]
