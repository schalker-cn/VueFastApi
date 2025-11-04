import { request } from '@/utils'

export default {
  getUserInfo: () => request.get('/base/userinfo'),
  getUserMenu: () => request.get('/base/usermenu'),
  getUserApi: () => request.get('/base/userapi'),
  // depts
  getDepts: (params = {}) => request.get('/dept/list', { params }),
}
