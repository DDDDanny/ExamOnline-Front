import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'

const routers: any = [
  {
    path: '/login',
    component: Login,
    meta: {
      title: 'ExamOnline Login',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

export default router
