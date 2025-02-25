<template>
  <el-popover
    placement="bottom"
    width="15.5%"
    :popper-style="{
      padding: '24px',
    }"
    trigger="click"
    @show="handleShow"
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
            <span>{{ fileNumbers }}个</span>
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
import { onMounted, ref } from 'vue'
import { SET_PACEID, GET_PACEID, GET_USERID } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import * as panApi from '@/api/pan.js'

const route = useRoute()
const userStore = useUserStore()
const circleUrl = ref('/icons/头像.svg')

const userName = ref('')

const usedSize = ref('0')
const allSize = ref('0')
const proportion = ref('0%')
const percentage = ref(0)
const fileNumbers = ref(0)

const getProId = async () => {
  let proId = route.query.spaceId || GET_PACEID()
  return proId
}

// 获取spaceId列表
const getSpaceIdList = async () => {
  const params = {
    userId: GET_USERID(),
  }
  let result = await panApi.getUserSpace(params)
  return result.data[0].spaceId
}

// 获取spaceId
const spaceId = ref('')
const getSpaceId = async () => {
  const proId = await getProId()
  spaceId.value = proId
}

const getSpaceDetail = () => {
  panApi
    .spaceDetail(spaceId.value)
    .then((res) => {
      console.log(res.data)
      if (res.data.quota == '-1') {
        allSize.value = '无限制'
      } else {
        allSize.value = formatSize(res.data.quota)
        proportion.value =
          ((Number(res.data.size) / Number(res.data.quota)) * 100).toFixed(2) +
          '%'
        percentage.value = Number(
          ((Number(res.data.size) / Number(res.data.quota)) * 100).toFixed(2),
        )
      }
      usedSize.value = formatSize(res.data.size)
      userName.value = res.data.name
      fileNumbers.value = res.data.objects
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleShow = async () => {
  await getSpaceId()
  getSpaceDetail()
}

const formatSize = (size) => {
  // 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  const TB = GB * 1024

  // 根据字节数大小决定转换的单位
  if (size >= TB) {
    // 如果大于等于 1GB，转换为 GB
    return (size / TB).toFixed(2) + ' TB'
  } else if (size >= GB) {
    // 如果大于等于 1GB，转换为 GB
    return (size / GB).toFixed(2) + ' GB'
  } else if (size >= MB) {
    // 如果大于等于 1MB，转换为 MB
    return (size / MB).toFixed(2) + ' MB'
  } else if (size >= KB) {
    // 如果大于等于 1KB，转换为 KB
    return (size / KB).toFixed(2) + ' KB'
  } else {
    // 小于 1KB，显示为字节
    return size + ' bytes'
  }
}

// onMounted(async () => {
//   await getSpaceId()
//   getSpaceDetail()
// })

const router = useRouter()

const loginOut = async () => {
  await userStore.userLogout(window.location.href)
  // router.push({
  //   path: `/login`,
  // })
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
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
    font-size: 16px;
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
      font-size: 14px;
      color: #c38f5d;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 500;
      margin-right: 4px;
    }
    .all-size {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      line-height: 17px;
      font-weight: 500;
      margin-left: 4px;
    }
  }
  .proportion {
    font-family: PingFangSC-Medium;
    font-size: 14px;
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
