import { defineStore } from 'pinia'
import { basicRoutes, vueModules } from '@/router/routes'
import Layout from '@/layout/index.vue'
import api from '@/api'
import { USER_MENU_MOCK } from '~/src/mocks/base/USER_MENU_MOCK'
import { USER_API_MOCK } from '~/src/mocks/base/USER_API_MOCK'

// * backend routes data
// construct front-end routes from back-end data

function buildRoutes(routes = []) {
  return routes.map((e) => {
    const route = {
      name: e.name,
      path: e.path,
      component: shallowRef(Layout),
      isHidden: e.is_hidden,
      redirect: e.redirect,
      meta: {
        title: e.name,
        icon: e.icon,
        order: e.order,
        keepAlive: e.keepalive,
      },
      children: [],
    }

    if (e.children && e.children.length > 0) {
      // submenu case
      route.children = e.children.map((e_child) => ({
        name: e_child.name,
        path: e_child.path,
        component: vueModules[`/src/views${e_child.component}/index.vue`],
        isHidden: e_child.is_hidden,
        meta: {
          title: e_child.name,
          icon: e_child.icon,
          order: e_child.order,
          keepAlive: e_child.keepalive,
        },
      }))
    } else {
      // no submenu case, create default route
      route.children.push({
        name: `${e.name}Default`,
        path: '',
        component: vueModules[`/src/views${e.component}/index.vue`],
        isHidden: true,
        meta: {
          title: e.name,
          icon: e.icon,
          order: e.order,
          keepAlive: e.keepalive,
        },
      })
    }

    return route
  })
}

export const usePermissionStore = defineStore('permission', {
  state() {
    return {
      accessRoutes: buildRoutes(USER_MENU_MOCK),
      accessApis: USER_API_MOCK,
    }
  },
  getters: {
    routes() {
      return basicRoutes.concat(this.accessRoutes)
    },
    menus() {
      return this.routes.filter((route) => route.name && !route.isHidden)
    },
    apis() {
      return this.accessApis
    },
  },
  actions: {
    async generateRoutes() {
      const res = await api.getUserMenu() // get backend menu data
      this.accessRoutes = buildRoutes(res.data) // convert backend data to frontend routes
      return this.accessRoutes
    },
    async getAccessApis() {
      const res = await api.getUserApi()
      this.accessApis = res.data
      return this.accessApis
    },
    resetPermission() {
      this.$reset()
    },
  },
})
