<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording"> xxx 考试成绩单 </span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">学生姓名: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入学生姓名" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">考试分数: </span>
        <el-input v-model="queryInfo.result_mark" placeholder="请输入考试分数" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" >
          <Search class="common-btn-icon-style"/>查 询</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import router from "../../router";
import {ChevronLeft, Search} from "lucide-vue-next";

// 返回至考试结果页面
const goBack = () => {
  router.replace('/examResult')
}

// 查询条件
const queryInfo = reactive({
  name: null,
  result_mark: null
})

</script>

<style scoped lang="scss">
.exam-result-detail-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.page-header-wording {
  color:#5e5e5e;
  font-size: 16px;
}
</style>