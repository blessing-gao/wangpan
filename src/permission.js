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
  try {
    //获取token,去判断用户登录、还是未登录
    await userStore.userInfo()
    const token = userStore.token
    const userId = userStore.userId
    const spaceId = userStore.spaceId
    //用户登录判断
    if (userId && spaceId) {
      next()
    } else {
      // 没有token或者userId
      // 需要先获取到当前路由是否是分享链接
      if (['/404'].includes(to.path) || to.path.includes('share')) {
        next()
      } else if (!spaceId) {
        if (to.path !== '/notSpace') {
          next({ path: '/notSpace' }) // 跳转到没有空间的提示页面
        } else {
          next() // 如果已经在 /notSpace 页面，继续导航
        }
      } else if (this.userId == '') {
        this.userId = await this.getCookie('userId')
        this.token = await this.getCookie('token')
        console.log('这里：userId', this.userId)

        // 如果 cookie 中没有 userId，跳转到登录页面
        if (!this.userId) {
          window.location.href = import.meta.env.VITE_LOGIN_URL
          return
        } else {
          SET_USERID(this.userId)
          SET_TOKEN(this.token)
        }

        // 从 cookie 中删除 userId 和 token
        this.deleteCookie('userId')
        this.deleteCookie('token')
      } else {
        next({ path: '/404' })
      }
    }
  } catch (error) {
    next({ path: '/404' }) // In case of error, redirect to 404 page
  }
})
//全局后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})
