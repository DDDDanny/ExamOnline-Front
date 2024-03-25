<template>
  <div class="error-archive-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <BookHeart/>
      </el-icon>
      <span style="margin-left: 10px">错题集</span>
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
      <div class="module-query-item">
        <span class="module-query-item-title">试题难度: </span>
        <el-select v-model="queryInfo.status" placeholder="请选择题目难度" style="width: 240px" clearable>
          <el-option key="1" label="简单" value="E"/>
          <el-option key="2" label="中等" value="M"/>
          <el-option key="3" label="困难" value="H"/>
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
import {BookHeart, Search} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: null,
  is_deleted: false,
})
</script>

<style scoped lang="scss">
.error-archive-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
