import { createRouter, createWebHistory } from 'vue-router'
import constantRoutes from './routers'

const devPreUrl = location.pathname.startsWith('/front') ? '/front' : ''
// devPreUrl + import.meta.env.VITE_ROUTE_BASE
const router = createRouter({
  history:  createWebHistory(),
  routes: constantRoutes,
})

export default router
