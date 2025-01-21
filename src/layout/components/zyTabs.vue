<template>
  <div>
    <el-menu :default-active="activeMenu" class="el-menu-vertical" router style="margin-top: 35px; border: 0;">
      <!-- 仅遍历 Home 路由下的 children -->
      <el-menu-item
        v-for="route in routes"
        :key="route.path"
        :index="route.path"
      >
        <router-link :to="route.path">
          <!-- 添加图标和标题，并使用 flex 布局 -->
          <div class="menu-item-content">
            <img
              :src="getIconSrc(route.meta?.icon)"
              :class="['menu-item-icon', getIconClass(route.path)]"
              class="menu-item-icon"
            />
            <span class="menu-item-title">{{ route.meta?.title }}</span>
          </div>
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const routes = computed(() => {
  return route.matched.find((r) => r.name === 'Home')?.children || []
})

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})
// 处理菜单项选择事件
const handleMenuSelect = (index) => {
  console.log('Selected menu item:', index)
}
// 获取图标的动态类
const getIconClass = (path) => {
  return route.path === path ? 'active-icon' : '' // 判断是否是当前路由，激活时添加 'active-icon' 类
}

const getIconSrc = (icon) => {
  if (icon === '工作台') {
    return '/icons/工作台.svg' // 本地图标路径
  } else if (icon === '网盘') {
    return '/icons/网盘.svg' // 本地图标路径
  } else if (icon === '中台') {
    return '/icons/数字中台.svg' // 本地图标路径
  }
}
</script>

<style lang="scss" scoped>
.router-link-active {
  color: #de3a05;
}
:deep(.el-menu) {
  text-align: center;
}
:deep(.el-menu-item) {
  display: flex;
  justify-content: center;
  font-family: PingFangSC-Medium;
  font-size: 9px;
  letter-spacing: 0;
  font-weight: 500;
  text-align: center;
  background: #f4f5f7;
  border: 0px;
}
.menu-item-link {
  display: block; /* 使链接成为块级元素 */
}

.menu-item-content {
  display: flex;
  flex-direction: column; /* 让图标和标题垂直排列 */
  align-items: center; /* 水平居中对齐 */
  text-align: center; /* 标题文字居中 */
}

.menu-item-icon {
  font-size: 24px; /* 设置图标大小 */
  margin-bottom: 5px; /* 图标和标题之间的间距 */
}

.menu-item-title {
  //   font-size: 14px; /* 设置标题文字的大小 */
  line-height: 1.5; /* 设置标题的行高，避免过于紧凑 */
}

.active-icon {
  transform: scale(1.2); /* 放大图标 */
  filter: brightness(1.2); /* 增加图标亮度 */
  fill: #de3a05;
}

.active-icon {
  filter: brightness(1.2) saturate(1.5); /* 改变颜色，通过滤镜调整亮度和饱和度 */
}

/* 针对SVG图标的颜色变化 */
:deep(.active-icon g) {
  fill: #de3a05; /* 设置激活图标的颜色 */
}
</style>
