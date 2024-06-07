<template>
  <div class="teacher-main-box">
    <div class="common-module-header-box">
      <el-icon><Users /></el-icon>
      <span style="margin-left: 10px">教师管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">教师姓名: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入教师姓名" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">激活状态: </span>
        <el-select v-model="queryInfo.is_active" placeholder="请选择激活状态" style="width: 240px" clearable>
          <el-option key="1" label="已激活" :value="true"/>
          <el-option key="2" label="未激活" :value="false"/>
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
      <el-button color="#42b883" style="color: #fff">
        <Upload class="common-btn-icon-style"/>
        批量上传
      </el-button>
      <el-button color="#42b883" style="color: #fff">
        <Zap class="common-btn-icon-style"/>
        批量激活
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {Users, Plus, Search, Upload, Zap} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  name: null,
  student_id: null,
  is_deleted: false,
  is_active: null
})
</script>

<style scoped lang="scss">
.teacher-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
