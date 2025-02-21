import Layout from '@/layout/index.vue'
import zyVideo from '@/layout/components/fileDetail.vue'
const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          icon: '工作台',
          title: '工作台',
          keepAlive: true,
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/home/index.vue'),
      },
      {
        path: '/file',
        name: 'file',
        meta: {
          icon: '网盘',
          title: '网盘',
          keepAlive: true,
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/file/index.vue'),
        children: [],
      },
    ],
  },
  {
    path: '/detail', // 视频详情页的路由路径
    name: 'VideoDetail',
    component: zyVideo,
    meta: {
      link: true, // 可以根据需要设置
    },
  },
  {
    path: '/document/share/download/:id', // 视频详情页的路由路径
    name: 'sharePreview',
    component: () =>
      import(/* webpackChunkName: "404" */ '../views/sharePreview/index.vue'),
    meta: {
      link: true, // 可以根据需要设置
    },
  },
  {
    path: '/404',
    name: '404',
    component: () =>
      import(/* webpackChunkName: "404" */ '../views/errorPage/404.vue'),
    meta: { title: '404', affix: true },
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
    },
  },
  { path: '/:catchAll(.*)', redirect: '/404' },
]

export default constantRoutes
