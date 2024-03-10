<template>
  <div class="questions-main-box">
    <div class="module-header-box">
      <el-icon><BookMarked /></el-icon>
      <span style="margin-left: 10px">试题管理</span>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import {BookMarked} from "lucide-vue-next";
</script>

<style scoped lang="scss">
.questions-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.module-header-box {
  height: 30px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #5e5e5e;
  border-radius: 5px;
  background-color: #efefef;
  margin-bottom: 20px;
}
</style>
