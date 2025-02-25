<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <zyHeaderVue />
      </el-header>
      <el-container style="height: 93%">
        <el-aside width="61px" class="left_tab">
          <zyTabsVue />
        </el-aside>
        <el-main>
          <router-view v-slot="{ Component, route }">
            <!-- <keep-alive> -->
            <component
              v-if="!route.meta.link"
              :is="Component"
              :key="route.path"
            />
            <!-- </keep-alive> -->
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import zyHeaderVue from './components/zyHeader.vue'
import zyTabsVue from './components/zyTabs.vue'
</script>

<style lang="scss" scoped>
.el-header {
  height: 7%;
  padding: 10px 18px 10px 16px;
  background: #ffffff;
  box-shadow: 0px 1px 0px 0px rgba(230, 231, 234, 1);
}
.el-container {
  height: 100%;
}
.left_tab {
  background: #f4f5f7;
  width: 4.2%;
}
.common-layout {
  height: 100%;
}
.el-main {
  padding: 0;
  width: calc(100% - 71px);
}
</style>
