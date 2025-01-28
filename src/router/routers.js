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
          keepAlive: true
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
          keepAlive: true
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/file/index.vue'),
        children: [

        ]
      },
      {
        path: '/middle-platform',
        name: 'middle-platform',
        meta: {
          icon: '中台',
          title: '中台',
          keepAlive: true
        },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '../views/middlePlatform/index.vue'
          ),
      },
      {
        path: '/task',
        name: 'task',
        meta: {
          icon: '任务',
          title: '任务',
          keepAlive: true
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '../views/task/index.vue'),
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
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
    },
  },
]

export default constantRoutes
