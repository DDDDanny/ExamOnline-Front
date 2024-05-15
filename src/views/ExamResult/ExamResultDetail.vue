<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">{{ examInfo['title'] }} -- 考试成绩单 </span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">学生姓名: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入学生姓名" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">考试分数: </span>
        <el-input v-model="queryInfo.result_mark" placeholder="请输入考试分数" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" >
          <Search class="common-btn-icon-style"/>查 询</el-button>
      </div>
    </div>
    <div class="exam-result-detail-table-box">
      <el-table
          border
          stripe
          size="small"
          :data="tableData"
          show-overflow-tooltip
          class="common-table-base-style"
          header-cell-class-name="table-header-row-style"
      >
        <el-table-column fixed type="index" align="center" width="60" label="序号"/>
        <el-table-column fixed prop="student_id" label="学号" align="center" width="200"/>
        <el-table-column fixed prop="name" label="学生姓名" align="center" width="180"/>
        <el-table-column fixed prop="result_mark" label="总得分" align="center" width="120"/>
        <el-table-column prop="start_time" label="考试开始时间" align="center" width="180"/>
        <el-table-column prop="end_time" label="考试结束时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="260" :resizable="false">
          <template #default>
            <el-button link size="small" type="primary" :icon="Award">查看成绩</el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="success" :icon="CloudDownload">下载成绩单</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <div class="exam-result-detail-main-pagination-box">
        <el-pagination
            small
            background
            :total="tablePageTotal"
            class="mt-4"
            style="margin-top: 20px"
            :default-page-size="pageSize"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import router from "../../router";
import {storeToRefs} from 'pinia'
import { useExamResultDetailStore } from "../../stores/ExamResultDetailStore.ts";
import {Award, ChevronLeft, CloudDownload, Search} from "lucide-vue-next";

// 从Store中获取考试信息
const examResultDetail = useExamResultDetailStore()
const { examInfo, sourceUrl } = storeToRefs(examResultDetail)

// 返回至考试结果页面
const goBack = () => {
  router.replace(sourceUrl.value)
}

// 查询条件
const queryInfo = reactive({
  name: null,
  result_mark: null
})

// 存储表格数据
const tableData: any = ref([{}])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)

// 处理分页时当前页的变更事件
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

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

:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}

.exam-result-detail-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}

.exam-result-detail-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}
</style>