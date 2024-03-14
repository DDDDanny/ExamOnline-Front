import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login/index.vue'
import Container from '../components/Container.vue'
import HomePage from  '../views/HomePage/index.vue'
import QuestionManagement from '../views/QuestionManagement/index.vue'

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
        path: '/questionManagement',
        component: QuestionManagement,
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

export default router
