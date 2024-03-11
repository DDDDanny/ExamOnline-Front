<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon><BookMarked /></el-icon>
      <span style="margin-left: 10px">试题管理</span>
    </div>
    <div class="common-module-query-box"></div>
    <div class="common-module-opts-box">
      <el-button type="primary">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button type="danger">
        <Trash2 class="common-btn-icon-style" />
        批量删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookMarked, Plus, Trash2 } from "lucide-vue-next";
</script>

<style scoped lang="scss">
.questions-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
