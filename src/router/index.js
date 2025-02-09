import { createRouter, createWebHistory } from 'vue-router'
import constantRoutes from './routers'

const devPreUrl = location.pathname.startsWith('/front') ? '/front' : ''

const router = createRouter({
  history:  createWebHistory(devPreUrl + import.meta.env.VITE_ROUTE_BASE),
  routes: constantRoutes,
})

export default router
