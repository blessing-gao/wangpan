<template>
  <el-popover
    placement="bottom"
    width="15.5%"
    :popper-style="{
      padding: '24px',
    }"
    trigger="click"
  >
    <template #reference>
      <el-avatar :size="28" :src="circleUrl" />
    </template>
    <!-- 个人信息 -->
    <div>
      <div class="avatar-option">
        <el-avatar style="margin-right: 16px" :size="40" :src="circleUrl" />
        <div class="avatar-option-name">
          {{ userName }}
        </div>
      </div>
      <div class="file-style">
        <div class="file-number">
          <div class="file-number-title">文件总数</div>
          <div class="file-number-number">
            <img
              style="width: 16px; margin-right: 7px"
              src="/icons/编组 32.svg"
            />
            <span>112个</span>
          </div>
        </div>
        <div class="use-size">
          <div class="use-size-left">
            <div class="used-size">{{ usedSize }}</div>
            /
            <div class="all-size">{{ allSize }}</div>
          </div>
          <div class="proportion">
            {{ proportion }}
          </div>
        </div>
        <div>
          <el-progress
            :stroke-width="4"
            :show-text="false"
            :percentage="percentage"
            color="#C38F5D"
          />
        </div>
      </div>
      <div class="footer-btn">
        <div class="btn-style" style="margin-bottom: 24px">
          <img
            style="width: 16px; margin-right: 16px"
            src="/icons/个人信息.svg"
          />
          <span>个人信息</span>
        </div>
        <div class="btn-style" style="margin-bottom: 24px">
          <img
            style="width: 16px; margin-right: 16px"
            src="/icons/修改密码.svg"
          />
          <span>修改密码</span>
        </div>
        <div class="btn-style" @click="loginOut">
          <img
            style="width: 16px; margin-right: 16px"
            src="/icons/退出登录.svg"
          />
          <span>退出登录</span>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const circleUrl = ref(userStore.checkUser.avatar)

const userName = ref(userStore.checkUser.username)

const usedSize = ref('251.04GB')
const allSize = ref('3.67 TB')
const proportion = ref('20%')
const percentage = ref(20)

const router = useRouter()

const loginOut = async () => {
  await userStore.userLogout()
  router.push({
    path: `/login`,
  })
}
</script>

<style lang="scss" scoped>
.avatar-option {
  display: flex;
  align-items: center;
}

.avatar-option-name {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
}

.file-style {
  width: 89%;
  margin-top: 17px;
  background: rgba(243, 232, 222, 0.5);
  border-radius: 8px;
  padding: 10px 16px 14px 14px;
  margin-bottom: 24px;
}

.file-number {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  .file-number-title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
  }
  .file-number-number {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
}

.use-size {
  display: flex;
  justify-content: space-between;
  margin-bottom: 9px;
  .use-size-left {
    display: flex;
    .used-size {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #c38f5d;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 500;
      margin-right: 4px;
    }
    .all-size {
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 500;
      margin-left: 4px;
    }
  }
  .proportion {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 500;
  }
}

:deep(.el-progress-bar__outer) {
  background: #ffffff;
}

.footer-btn {
  .btn-style {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 400;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
