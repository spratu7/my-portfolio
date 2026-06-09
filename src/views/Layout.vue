<template>
  <div class="common-layout">
    <el-container>
       <Aside></Aside>
      <el-container>
        <navHeader></navHeader>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import Aside from '../components/aside.vue'
  import navHeader from '../components/navHeader.vue';
</script>

<style lang="less" scoped>
// 1. 外层铺满屏幕
.common-layout {
  height: 100%;
}
// 2. 最外层el-container（侧边栏+内层容器）
.common-layout > .el-container {
  display: flex;
  height: 100%;
}
// 3. 内层el-container（头部+main）
.el-container > .el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
// 4. main区域占满剩余空间
.el-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>