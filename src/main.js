import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import store from './store/index.js'
import panelHeader from './components/panelHeader.vue'


//刷新之后动态路由的添加
const localData = localStorage.getItem('pz_v3')
if (localData) {
  store.dispatch('menu/generateDynamicRoutes', JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main', item)
  })
}


router.beforeEach((to, from) => {
  const falsetoken = localStorage.getItem('pz_token')
  const token = (falsetoken && falsetoken !== 'undefined' && falsetoken.trim() !== '')
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
})

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('panelHeader', panelHeader)

//路由挂载
app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')


