import { request } from '@/utils'

export default {
  getUserInfo: () => request.get('/base/userinfo'),
  getUserMenu: () => request.get('/base/usermenu'),
  getUserApi: () => request.get('/base/userapi'),
  // users
  getUserList: (params = {}) => request.get('/user/list', { params }),
  updateUser: (data = {}) => request.post('/user/update', data),
}