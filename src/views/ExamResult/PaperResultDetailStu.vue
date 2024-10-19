<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">xxx考试 - 成绩预览</span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import {computed, onBeforeUnmount, onMounted} from "vue";
import {ChevronLeft} from "lucide-vue-next";

// 处理页面返回
const goBack = () => {
  const sourceUrl = localStorage.getItem('RESULT_DETAILS_SOURCE_URL_STU')
  router.replace(sourceUrl)
}

onBeforeUnmount(() => {
  // 销毁
  localStorage.removeItem('RESULT_DETAILS_SOURCE_URL_STU')
})
</script>

<style scoped lang="scss">
@import "../../style.scss";

.exam-result-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.page-header-wording {
  color:#5e5e5e;
  font-size: 14px;
}
</style>
