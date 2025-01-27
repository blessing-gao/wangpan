<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到商品管理系统</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入获取当前时间的函数
// import { getTime } from '@/utils/time'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'

export default {
  setup() {
    const useStore = useUserStore()
    const loginForms = ref(null)
    const $router = useRouter()
    const $route = useRoute()
    const loading = ref(false)
    const loginForm = reactive({ username: 'admin', password: '111111' })

    // 登录按钮回调
    const login = async () => {
      await loginForms.value.validate()
      loading.value = true
      try {
        await useStore.userLogin(loginForm)
        let redirect = $route.query.redirect
        $router.push({ path: redirect || '/' })
        // 登录成功提示信息
        ElNotification({
          type: 'success',
          message: '欢迎回来',
          title: `HI,你好`,
        })
        loading.value = false
      } catch (error) {
        loading.value = false
        ElNotification({
          type: 'error',
          message: error.message,
        })
      }
    }

    // 自定义校验规则函数
    const validatorUserName = (rule, value, callback) => {
      if (value.length >= 5) {
        callback()
      } else {
        callback(new Error('账号长度至少五位'))
      }
    }

    const validatorPassword = (rule, value, callback) => {
      if (value.length >= 6) {
        callback()
      } else {
        callback(new Error('密码长度至少六位'))
      }
    }

    // 定义表单校验需要配置对象
    const rules = {
      username: [{ trigger: 'change', validator: validatorUserName }],
      password: [{ trigger: 'change', validator: validatorPassword }],
    }

    return {
      User,
      Lock,
      loginForm,
      loading,
      login,
      rules,
      loginForms,
    }
  },
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  //background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    //background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
