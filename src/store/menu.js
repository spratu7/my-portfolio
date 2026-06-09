// src/store/menu.js
import router from '../router/index' // 必须导入路由实例！
import { markRaw } from 'vue'
const localData = localStorage.getItem('pz_v3')

const state = localData ? localData.menu : {
  isCollapse: false,
  selectMenu: [],
  routerList: [],
  menuActive: '1-1'
}

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    // 对数据进行去重
    if (state.selectMenu.findIndex(item => item.id === payload.id) === -1) {
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(val => val.name === payload.name)
    if (index !== -1) {
      state.selectMenu.splice(index, 1)
    }
  },
  // ✅ Mutation 只做状态赋值，无任何复杂逻辑
  dynamicMenu(state, payload) {
    state.routerList = payload || [] // 兜底空数组
  },
  updataMenuActive(state, payload) {
    state.menuActive = payload
  }
}

const actions = {
  // ✅ 复杂路由注册逻辑全部放在 Action 里
  async generateDynamicRoutes({ commit }, payload) {
    if (!payload || !Array.isArray(payload)) return

    // 1. 批量导入所有视图组件
    const modules = import.meta.glob('../views/**/**/*.vue', { eager: true })

    // 2. 递归格式化路由、绑定组件、注册路由
    function routerSet(routes, parentPath = '') {
      routes.forEach(route => {
        const fullPath = parentPath + route.path
        if ((route.children || []).length === 0) {
          // 拼接组件路径
          const url = `/src/views${route.meta.path}/index.vue`
          // 匹配组件：增加空值保护
          const comp = Object.values(modules).find(item =>
            item?.default?.__file?.includes(url)
          )
          if (comp) {
            route.component = markRaw(comp.default)
            // ✅ 关键：真正注册动态路由
            router.addRoute('main', route)
          } else {
            console.error(`组件匹配失败：${url}，路由：`, route)
          }
        } else {
          // 递归处理子路由
          routerSet(route.children, fullPath + '/')
        }
      })
    }

    // 3. 执行路由注册
    routerSet(payload)

    // 4. 提交 Mutation 更新状态
    commit('dynamicMenu', payload)
  }
}

export default {
  namespaced: true, // 必须开启命名空间
  state,
  mutations,
  actions
}