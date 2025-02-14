<template>
  <div>
    <el-dialog
      title="到期时间"
      v-model="shareDialogVisible"
      width="540px"
      destroy-on-close
      @close="handleClose"
    >
      <div class="timeStyle">
        <div>
          <el-input-number v-model="day" :controls="false" size="large" />
          天
        </div>
        <div>
          <el-input-number v-model="hours" :controls="false" size="large" />
          小时
        </div>
        <div>
          <el-input-number v-model="minutes" :controls="false" size="large" />
          分钟
        </div>
      </div>
      <div class="btnStyle">
        <el-button plain @click="handleClose">取消</el-button>
        <el-button
          plain
          style="
            background: #de3a05;
            border-radius: 4px;
            color: #fff;
            border: 0;
          "
          @click="handleShare"
        >
          分享
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="shareVisible"
      width="540px"
      destroy-on-close
      @close="handleClose1"
    >
      <template #header>分享文档</template>
      <div class="header-content">
        <div>通过以下URL，您无需登录即可共享此对象。</div>
        <div>
          URL将在您配置的时间({{
            expireTime
          }})或当前Web会话过期的较早时间自动过期。
        </div>
      </div>

      <div class="expireinput">
        <div style="font-size: 14px; color: #000000; font-weight: 400">
          有效期
        </div>
        <div class="timeStyle">
          <div>
            <div>{{ day }}</div>
            天
          </div>
          <div>
            <div>{{ hours }}</div>
            小时
          </div>
          <div>
            <div>{{ minutes }}</div>
            分钟
          </div>
        </div>
      </div>

      <div class="expire-style">
        <div>链接将在以下日期之间可用：</div>
        <div style="font-size: 14px; color: #000000; font-weight: 400">
          {{ expireTimes }}
        </div>
      </div>
      <div class="share-link">
        <span>
          {{ shareLink }}
        </span>
        <el-button plain @click="handleClone">
          <el-icon style="vertical-align: middle"><CopyDocument /></el-icon>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { CopyDocument } from '@element-plus/icons-vue'
import * as panApi from '@/api/pan.js'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const { proxy } = getCurrentInstance()

const shareDialogVisible = ref(false)
const day = ref(0)
const hours = ref(0)
const minutes = ref(0)

const handleEdit = () => {
  shareDialogVisible.value = true
}

const handleClose = () => {
  shareDialogVisible.value = false
}

const shareVisible = ref(false)
const expireTime = ref('')
const shareLink = ref('')

const handleShare = () => {
  if (day.value == 0 && hours.value == 0 && minutes.value == 0) {
    return proxy.$modal.msgWarning('请输入到期时间')
  }
  shareDialogVisible.value = false
  shareVisible.value = true
  if (day.value != 0) {
    expireTime.value += day.value + '天'
  }
  if (hours.value != 0) {
    expireTime.value += hours.value + '小时'
  }
  if (minutes.value != 0) {
    expireTime.value += minutes.value + '分钟'
  }
  addTimeToCurrent()
  const params = {
    documentId: props.id,
    expireTime: '12000',
    userId: '1',
  }
  panApi
    .getShareUrl(params)
    .then((res) => {
      shareLink.value = res.data
    })
    .catch((err) => {
      console.error(err)
      shareLink.value =
        'http://locahost:8080/document/share/download/6fc11b2f-9184-4356-8cf2-44f33f7a9795'
    })
    .finally(() => {})
}

const expireTimes = ref('')
const addTimeToCurrent = () => {
  // 获取当前时间
  const currentTime = new Date()

  // 正则表达式提取时间信息（天、小时、分钟）
  const regex = /(\d+)(天|日)?(\d+)(小时)?(\d+)(分钟)?/
  const match = expireTime.value.match(regex)

  if (!match) {
    // 如果没有匹配的结果，尝试解析更简单的情况
    const regexSimple = /(\d+)(小时|分钟|天)?/
    const simpleMatch = expireTime.value.match(regexSimple)

    if (!simpleMatch) {
      throw new Error('时间格式不正确')
    }

    // 处理简单的情况（例如 '20小时' 或 '24分钟'）
    const hours = simpleMatch[2] === '小时' ? parseInt(simpleMatch[1], 10) : 0
    const minutes = simpleMatch[2] === '分钟' ? parseInt(simpleMatch[1], 10) : 0
    const days = simpleMatch[2] === '天' ? parseInt(simpleMatch[1], 10) : 0

    // 将天、小时和分钟加到当前时间
    currentTime.setDate(currentTime.getDate() + days)
    currentTime.setHours(currentTime.getHours() + hours)
    currentTime.setMinutes(currentTime.getMinutes() + minutes)

    // 格式化为年月日时分秒
    const year = currentTime.getFullYear()
    const month = String(currentTime.getMonth() + 1).padStart(2, '0')
    const day = String(currentTime.getDate()).padStart(2, '0')
    const hour = String(currentTime.getHours()).padStart(2, '0')
    const minute = String(currentTime.getMinutes()).padStart(2, '0')
    const second = String(currentTime.getSeconds()).padStart(2, '0')
    expireTimes.value = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  } else {
    // 如果原始正则成功匹配，继续处理
    const days = match[1] ? parseInt(match[1], 10) : 0
    const hours = match[3] ? parseInt(match[3], 10) : 0
    const minutes = match[5] ? parseInt(match[5], 10) : 0

    // 将天数、小时和分钟加到当前时间
    currentTime.setDate(currentTime.getDate() + days)
    currentTime.setHours(currentTime.getHours() + hours)
    currentTime.setMinutes(currentTime.getMinutes() + minutes)

    // 格式化为年月日时分秒
    const year = currentTime.getFullYear()
    const month = String(currentTime.getMonth() + 1).padStart(2, '0')
    const day = String(currentTime.getDate()).padStart(2, '0')
    const hour = String(currentTime.getHours()).padStart(2, '0')
    const minute = String(currentTime.getMinutes()).padStart(2, '0')
    const second = String(currentTime.getSeconds()).padStart(2, '0')
    expireTimes.value = `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
}

const handleClone = () => {
  const inputNode = document.createElement('input')
  inputNode.value = shareLink.value
  document.body.appendChild(inputNode)
  inputNode.select()
  document.execCommand('Copy')
  document.body.removeChild(inputNode) // 在复制成功后移除生成的 input 元素
  proxy.$modal.msgSuccess('复制成功')
}

const handleClose1 = () => {
  day.value = 0
  hours.value = 0
  minutes.value = 0
  shareVisible.value = false
}

defineExpose({
  handleEdit,
})
</script>

<style lang="scss" scoped>
.timeStyle {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
  div {
    display: flex;
    align-items: center;
    div {
      border: 1px solid #eee;
      width: 38px;
      height: 38px;
      display: flex;
      justify-content: center;
      margin-right: 8px;
    }
  }
}
:deep(.el-input-number--large) {
  width: 38px;
  margin-right: 15px;
}
:deep(.el-input-number.is-without-controls .el-input__wrapper) {
  padding: 0;
}

.btnStyle {
  margin-top: 8px;
  display: flex;
  justify-content: end;
}

.share-link {
  padding: 8px;
  display: flex;
  background-color: #f4f5f7;
  justify-content: space-between;
  align-items: center;
  span {
    color: #555555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.expire-style {
  display: flex;
  margin-bottom: 10px;
}

.header-content {
  margin-bottom: 8px;
}
</style>
