<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon><BookMarked /></el-icon>
      <span style="margin-left: 10px">试题管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试题标题: </span>
        <el-input v-model="queryInfo.topic" placeholder="请输入试题标题" style="width: 220px" clearable />
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题类型: </span>
        <el-select v-model="queryInfo.type" placeholder="请选择题目类型" style="width: 240px" clearable>
          <el-option key="1" label="选择题" value="Select" />
          <el-option key="2" label="判断题" value="Judge" />
        </el-select>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题状态: </span>
        <el-select v-model="queryInfo.status" placeholder="请选择题目状态" style="width: 240px" clearable>
          <el-option key="1" label="有效" :value="1" />
          <el-option key="2" label="无效" :value="0" />
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
      <el-button type="primary">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button type="danger">
        <Trash2 class="common-btn-icon-style" />
        批量删除
      </el-button>
    </div>
    <div class="questions-main-table-box" style="">
      <el-table
        border
        stripe
        size="small"
        :data="tableData"
        class="common-table-base-style"
        header-cell-class-name="table-header-row-style"
      >
        <el-table-column fixed type="index" align="center" width="60" label="序号" />
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
      <div class="questions-main-pagination-box">
        <el-pagination
          small
          background
          :total="55"
          class="mt-4"
          style="margin-top: 20px"
          :default-page-size="50"
          layout="total, prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { BookMarked, Plus, Trash2, Search } from "lucide-vue-next";

const queryInfo = reactive({
  topic: '',
  type: '',
  status: '',
})

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
.questions-main-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}
.questions-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>
