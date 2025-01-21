import Layout from '@/layout/index.vue'
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
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/home/index.vue'),
      },
      {
        path: '/pan',
        name: 'pan',
        meta: {
          icon: '网盘',
          title: '网盘',
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/pan/index.vue'),
      },
      {
        path: '/middle-platform',
        name: 'middle-platform',
        meta: {
          icon: '中台',
          title: '中台',
        },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '../views/middlePlatform/index.vue'
          ),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
    },
  },
]

export default constantRoutes
