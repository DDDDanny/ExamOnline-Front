import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'
import Container from '../components/container.vue'
import HomePage from  '../views/HomePage/index.vue'

const routers: any = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component:Container,
    children: [
      {
        path: '/homepage',
        component: HomePage,
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

export default router
