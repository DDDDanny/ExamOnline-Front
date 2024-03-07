import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'
import Container from '../components/container.vue'

const routers: any = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component:Container
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

export default router
