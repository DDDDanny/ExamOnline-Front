import { createRouter, createWebHistory } from 'vue-router'

const routers: any = [
  {
    path: '/login',
    component: () => import('../views/Login/index.vue'),
    meta: {
      title: 'CoursiPay',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

export default router
