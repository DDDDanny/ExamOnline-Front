import { createRouter, createWebHistory } from 'vue-router'
import {getCookie} from "../utils/cookie.ts";
import Login from '../views/Login/index.vue'
import Container from '../components/Container.vue'
import HomePage from  '../views/HomePage/index.vue'
import PersonalWarehouse from '../views/QuestionManagement/PersonalWarehouse.vue'
import PublicWarehouse from "../views/QuestionManagement/PublicWarehouse.vue";

const routers: any = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component:Container,
    redirect: '/homepage',
    children: [
      {
        path: '/homepage',
        component: HomePage,
      },
      {
        path: '/personalWarehouse',
        component: PersonalWarehouse,
      },
      {
        path: '/publicQuestions',
        component: PublicWarehouse,
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

// 增加路由守卫，确保登录态后跳转页面
// 使用 router.beforeEach 注册一个全局前置守卫，对所有路由导航进行拦截
router.beforeEach((to, _, next) => {
  // 用户必须登录才能访问任何页面
  const isAuthenticated = localStorage.getItem('TOKEN');
  const userInfo = getCookie('UserInfo')
  if (to.path !== '/login' && (!isAuthenticated || !userInfo)) {
    next('/login'); // 如果用户未登录，将其重定向到登录页面
  } else {
    next(); // 如果用户已登录，继续路由导航
  }
});


export default router
