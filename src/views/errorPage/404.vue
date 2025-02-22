<template>
  <div class="notspace">
    <el-empty>
      <template #image>
        <img style="width: 256px" src="/icons/提示.svg" alt="" />
      </template>
      <template #description>
        <div class="prompt">404</div>
      </template>
    </el-empty>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.notspace {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.prompt {
  font-family: PingFangSC-Regular;
  font-size: 34px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  line-height: 40px;
  font-weight: 400;
  margin-bottom: 24px;
}
:deep(.el-empty__image) {
  width: 256px;
}
:deep(.el-button--primary) {
  background: #de3a05;
  border-radius: 4px;
  border: 0;
}
</style>
