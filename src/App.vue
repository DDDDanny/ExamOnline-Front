<template>
  <el-config-provider :locale="zhCn">
    <div id="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<style scoped>

</style>
