<template>
  <div class="exam-online-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <SwatchBook />
      </el-icon>
      <span style="margin-left: 10px">在线考试引导页</span>
    </div>
    <div class="exam-online-info-box">
      <div class="newest-exam-info">
        <span style="margin: auto;font-size: 25px">《xxx上半学期期末考试》</span>
        <span style="margin-top: 20px;margin-bottom: 20px;font-size: 20px">考试即将开始，距离考试开始还有: 00:01:30</span>
        <el-button type="primary" :icon="Highlighter">进 入 考 试</el-button>
      </div>
      <el-divider content-position="left">
        <div style="display: flex;align-items: center;color: #5e5e5e;font-size: 13px;font-weight: 400;">
          <el-icon><FileClock/></el-icon>
          <span style="margin-left: 6px">未开始的考试</span>
        </div>
      </el-divider>
      <div class="exam-list-box">
        <div class="exam-list-item"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwatchBook, FileClock, Highlighter } from "lucide-vue-next";
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.exam-online-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.exam-online-info-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.newest-exam-info {
  display: flex;
  flex-direction: column;
  margin: auto;
  align-content: center;
  color: #5e5e5e;
}

.exam-list-box {
  width: 100%;
  height: 300px;
  background-color: #7ea4cd;
}

.exam-list-item {

}
</style>
