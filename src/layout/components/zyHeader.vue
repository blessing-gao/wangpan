<template>
  <div class="zy_header">
    <div class="left_header">
      <div class="left_header_icon">
        <img src="/assets/位图 2.png" class="menu-item-icon" />
      </div>
      <div class="left_header_text">浙音网盘</div>
    </div>

    <!-- <div class="search_input">
      <el-input
        placeholder="输入并搜索文件..."
        :prefix-icon="Search"
        @click="clickInput"
      >
        <template #append>
          <img
            style="cursor: pointer"
            src="/icons/xiangji.svg"
            @click="clickXiangji"
          />
        </template>
      </el-input>
    </div> -->

    <div class="right_header">
      <el-popover
        placement="bottom"
        :width="130"
        trigger="hover"
        @show="handleShow"
      >
        <template #reference>
          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            "
          >
            <div class="organization">切换组织</div>
            <div class="bottom_icon">
              <img src="/icons/下拉.svg" class="menu-item-icon" />
            </div>
          </div>
        </template>
        <div
          class="organization-content"
          v-for="(item, index) in organizationList"
          :key="index"
          @click="handleChange(item)"
          :class="{ highlighted: item.spaceId === GET_PACEID() }"
        >
          {{ item.spaceName }}
        </div>
      </el-popover>

      <div class="right_header_icon">
        <userAvatar />
      </div>
    </div>
  </div>
  <!-- <uploadSearch ref="uploadSearchRef" />
  <inputSearch ref="inputSearchRefs" /> -->
</template>

<script setup>
// import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance, onMounted } from 'vue'
import { GET_USERID, GET_PACEID, SET_PACEID } from '@/utils/auth'
import uploadSearch from '../../components/uploadSearch.vue'
import inputSearch from '../../components/inputSearch.vue'
import userAvatar from '../../components/userAvatar.vue'
import useUserStore from '@/store/modules/user'
import pinia from '@/store'
import { useRouter } from 'vue-router'

import * as panApi from '@/api/pan.js'
import * as headerApi from '@/api/header.js'

const { proxy } = getCurrentInstance()
const userStore = useUserStore(pinia)

const router = useRouter()

// const uploadSearchRef = ref(null)

// const clickXiangji = () => {
//   // 配置上传的信息
//   let params = {
//     multiple: false,
//     autoUpload: true,
//     type: 'search',
//   }
//   uploadSearchRef.value.handleEdit(params)
// }

// const inputSearchRefs = ref(null)

// const clickInput = () => {
//   inputSearchRefs.value.handleEdit()
// }

const organizationList = ref([])

const handleShow = () => {
  const params = {
    userId: GET_USERID(),
  }
  panApi
    .getUserSpace(params)
    .then((res) => {
      organizationList.value = res.data
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleChange = (item) => {
  SET_PACEID(item.spaceId)
  userStore.spaceId = item.spaceId
  router.go(0)
}
</script>

<style lang="scss" scoped>
.zy_header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative; /* 使内部元素能相对其定位 */
}
.left_header {
  display: flex;
  align-items: center;
  .left_header_icon {
    margin-right: 17px;
    background: #d9d9d9;
    width: 20px;
    height: 31px;
  }
  .left_header_text {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #333333;
    letter-spacing: 0;
    font-weight: 400;
  }
}

// :deep(.search_input .el-input__inner) {
//   height: 36px;
//   cursor: pointer;
// }

// .search_input {
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%); /* 使其水平居中 */
//   width: 41.7%;
// }
// :deep(.search_input .el-input-group__prepend) {
//   border-bottom-left-radius: 18px;
//   border-top-left-radius: 18px;
//   background: #f4f5f7;
//   padding-left: 16px;
//   padding-right: 0;
//   box-shadow: none;
// }
// :deep(.search_input .el-input-group__append) {
//   border-bottom-right-radius: 18px;
//   border-top-right-radius: 18px;
//   background: #f4f5f7;
//   padding-right: 16px;
//   padding-left: 0;
//   box-shadow: none;
// }

// :deep(.search_input .el-input__wrapper.is-focus) {
//   box-shadow: none;
// }
// :deep(.search_input .el-input__wrapper:hover) {
//   box-shadow: none;
// }
// :deep(.search_input .el-input__wrapper) {
//   background: #f4f5f7;
//   padding: 0;
//   padding-left: 16px;
//   box-shadow: none;
//   border-bottom-left-radius: 18px;
//   border-top-left-radius: 18px;
// }

.right_header {
  display: flex;
  align-items: center;
  .organization {
    margin-right: 8px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #555555;
    letter-spacing: 0;
    font-weight: 400;
  }
  .bottom_icon {
    margin-right: 28px;
  }
  .right_header_icon {
    background: #d9d9d9;
    border-radius: 50%;
    height: 28px;
    width: 28px;
    margin-right: 18px;
    cursor: pointer;
  }
  .right_ai_icon {
    display: flex;
  }
}

.organization-content {
  padding: 6px;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.organization-content:hover {
  color: #de3a05;
  background: rgba(255, 215, 202, 0.5);
}

.highlighted {
  color: #de3a05;
  background: rgba(255, 215, 202, 0.5);
}
</style>
