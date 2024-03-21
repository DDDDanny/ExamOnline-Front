<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon><BookCheck/></el-icon>
      <span style="margin-left: 10px">公共题库管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试题标题: </span>
        <el-input v-model="queryInfo.topic" placeholder="请输入试题标题" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题类型: </span>
        <el-select v-model="queryInfo.type" placeholder="请选择题目类型" style="width: 240px" clearable>
          <el-option key="1" label="选择题" value="select"/>
          <el-option key="2" label="判断题" value="judge"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {BookCheck, Search} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: true,
  is_deleted: false,
  created_user: null,
})
</script>

<style scoped lang="scss">
.questions-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>