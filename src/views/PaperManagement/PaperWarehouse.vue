<template>
  <div class="papers-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <ScrollText/>
      </el-icon>
      <span style="margin-left: 10px">试卷管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试卷标题: </span>
        <el-input v-model="queryInfo.title" placeholder="请输入试题标题" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">发布类型: </span>
        <el-select v-model="queryInfo.is_published" placeholder="请选择发布类型" style="width: 240px" clearable>
          <el-option key="1" label="已发布" :value="true"/>
          <el-option key="2" label="未发布" :value="false"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {Plus, Search, ScrollText} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  title: null,
  is_published: null,
  is_deleted: false,
})
</script>

<style scoped lang="scss">
.papers-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>