<template>
  <el-config-provider :locale="zhCn">
    <div id="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style scoped>

</style>
