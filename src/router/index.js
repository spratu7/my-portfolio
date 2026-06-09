import { createRouter, createWebHashHistory } from "vue-router"

import Layout from '../views/Layout.vue'
import Dashboard from '../views/dashboard/index.vue'
import Order from '../views/vppz/order/index.vue'
import Admin from '../views/auth/admin/index.vue'
import Login from '../views/login/index.vue'
import Group from '../views/auth/group/index.vue'
import Staff from '../views/vppz/staff/index.vue'



const routes = [

  {
    path: '/',
    component: Layout,
    name: 'main',
    redirect: (to) => {
      const localData = localStorage.getItem('pz_v3')
      try {
        // 安全判断：确保 localData 存在且有效，避免解析报错
        if (!localData) {
          // 如果没有登录信息，直接跳转到登录页
          return '/login';
        }
        const menuData = JSON.parse(localData);
        const routerList = menuData?.menu?.routerList || [];

        // 安全判断：确保 routerList 有数据
        if (routerList.length === 0) {
          return '/login';
        }
        const firstMenu = routerList[0];
        const child = firstMenu.children || [];
        // 修复点 2：使用短路运算，避免数组为空时报错
        const targetPath = child.length > 0 ? child[0].meta.path : firstMenu.meta.path;

        return targetPath || '/login'; // 最终目标路径，无结果则跳登录
      } catch (e) {
        // 捕获任何解析异常，防止堆栈溢出
        console.error("路由解析错误：", e);
        return '/login';
      }
    },
    children: [
    ]
  },
  {
    path: '/login',
    component: Login
  },
]


const router = createRouter({
  //路由匹配模式
  history: createWebHashHistory(),
  //路由数据
  routes

})

export default router