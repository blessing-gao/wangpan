// permission.js
import router from '@/router'
import setting from './setting'
//@ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)
//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  //获取token,去判断用户登录、还是未登录
  userStore.userInfo()
  const token = userStore.token
  const userId = userStore.userId
  //用户登录判断
  if (token && userId) {
    next();
  } else {
    // 没有token或者userId
    // 需要先获取到当前路由是否是分享链接
    if (['/404'].includes(to.path) || to.path.includes('share')) {
      next()
    } else {
      next({ path: '/404' })
    }
  }
})
//全局后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})
