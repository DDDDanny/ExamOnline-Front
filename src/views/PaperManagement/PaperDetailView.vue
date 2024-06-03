<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">xxx试卷预览</span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
  </div>
</template>

<script setup lang="ts">
import {ChevronLeft} from "lucide-vue-next";
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
  font-size: 14px;
}

</style>
