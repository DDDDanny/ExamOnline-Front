<template>
  <div class="exam-result-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <FileCheck />
      </el-icon>
      <span style="margin-left: 10px">成绩管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">考试名称: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入考试名称" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" >
          <Search class="common-btn-icon-style"/>查 询</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {FileCheck, Search} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  name: null,
})
</script>

<style scoped lang="scss">
.exam-result-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>