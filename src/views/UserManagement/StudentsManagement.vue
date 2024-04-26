<template>
  <div class="students-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <GraduationCap />
      </el-icon>
      <span style="margin-left: 10px">学生管理</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GraduationCap } from "lucide-vue-next";
</script>

<style scoped lang="scss">
.students-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
