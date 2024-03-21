import { createRouter, createWebHistory } from 'vue-router'
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

export default router
