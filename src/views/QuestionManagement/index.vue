<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon><BookMarked /></el-icon>
      <span style="margin-left: 10px">试题管理</span>
    </div>
    <div class="common-module-query-box"></div>
    <div class="common-module-opts-box">
      <el-button type="primary">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button type="danger">
        <Trash2 class="common-btn-icon-style" />
        批量删除
      </el-button>
    </div>
    <div>
      <el-table
          border
          stripe
          :data="tableData"
          highlight-current-row
          class="common-table-base-style"
          header-cell-class-name="table-header-row-style"
      >
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookMarked, Plus, Trash2 } from "lucide-vue-next";

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style scoped lang="scss">
.questions-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.table-header-row-style) {
  background-color: #A8ABB2 !important;;
  color: #ffffff !important;;
}
</style>
