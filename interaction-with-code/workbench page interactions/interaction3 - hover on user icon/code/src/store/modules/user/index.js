import { defineStore } from 'pinia'
import api from '@/api'
import { USER_MOCK } from '~/src/mocks/user/USER_MOCK'

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: USER_MOCK[0],
    }
  },
  getters: {
    userId() {
      return this.userInfo?.id
    },
    name() {
      return this.userInfo?.username
    },
    email() {
      return this.userInfo?.email
    },
    avatar() {
      return this.userInfo?.avatar
    },
    role() {
      return this.userInfo?.roles || []
    },
    isSuperUser() {
      return this.userInfo?.is_superuser
    },
    isActive() {
      return this.userInfo?.is_active
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUserInfo()
        if (res.code === 401) {
          return
        }
        const { id, username, email, avatar, roles, is_superuser, is_active } = res.data
        this.userInfo = { id, username, email, avatar, roles, is_superuser, is_active }
        return res.data
      } catch (error) {
        return error
      }
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
