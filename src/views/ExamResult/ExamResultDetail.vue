<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording"> xxx 考试成绩单 </span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <div>123</div>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import {ChevronLeft} from "lucide-vue-next";

// 返回至考试结果页面
const goBack = () => {
  router.replace('/examResult')
}

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