<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">xxx试卷预览</span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <div class="case-list-main">
      <div id="paperTitle" class="paper-title-info">
        <span style="font-size: 25px;font-weight: bolder;">xxx</span>
        <span style="font-size: 18px;color: #5e5e5e;margin-top: 15px">YYY</span>
        <span style="font-size: 18px;color: #5e5e5e;margin-top: 20px">考试时间：YYYY - YYYY</span>
      </div>
      <div class="paper-module-box">
        <div class="module-info-box">
          <span>选择题（总分 60 分）</span>
        </div>
        <div id="caseItems" class="paper-case-list">
          <span>1. 牛顿第三定律指出：两个物体之间的相互作用力大小相等，方向相反。牛顿第三定律指出：两个物体之间的相互作用力大小相等，方向相反。牛顿第三定律指出：两个物体之间的相互作用力大小相等，方向相反。</span>
          <el-radio-group v-model="radio" style="margin-top: 20px">
            <el-radio value="A">A. 相等</el-radio>
            <el-radio value="B">B. 不相等</el-radio>
            <el-radio value="C">C. 不知道</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {ChevronLeft} from "lucide-vue-next";

const goBack = () => {
  console.log('Go Back!')
}

const radio = ref('')
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

.case-list-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.paper-title-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.paper-case-list {
  width: 94%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(154, 154, 154, 0.5);
  border-radius: 10px;
  padding: 20px 30px;
  color: #5e5e5e;
}

.paper-module-box {
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .module-info-box {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background: #0077e5;
    color: #fff;
    font-size: 13px;
  }
}
</style>
