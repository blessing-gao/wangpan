import { createRouter, createWebHistory } from 'vue-router'
import constantRoutes from './routers'

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

export default router
