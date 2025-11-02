import { ACCESS_TOKEN_MOCK } from "./ACCESS_TOKEN_MOCK"
import { USER_INFO_MOCK } from "./USER_INFO_MOCK"
import { USER_MENU_MOCK } from "./USER_MENU_MOCK"
import { USER_API_MOCK } from "./USER_API_MOCK"

export default [
  {
    url: '/api/v1/base/access_token',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: ACCESS_TOKEN_MOCK,
      }
    },
  },
  {
    url: '/api/v1/base/userinfo',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: USER_INFO_MOCK,
      }
    },
  },
  {
    url: '/api/v1/base/usermenu',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: USER_MENU_MOCK,
      }
    },
  },
  {
    url: '/api/v1/base/userapi',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: USER_API_MOCK,
      }
    },
  },
]
