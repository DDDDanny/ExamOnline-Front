<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">{{ examInfo['title'] }} - 考试成绩单</span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">学号: </span>
        <el-input v-model="queryInfo.student_id" placeholder="请输入学号" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">学生姓名: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入学生姓名" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">考试分数: </span>
        <el-input v-model="queryInfo.result_mark" placeholder="请输入考试分数" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="getExamResultData">
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
        <el-table-column fixed type="index" align="center" width="60" label="排名"/>
        <el-table-column fixed prop="student_id" label="学号" align="center" width="200"/>
        <el-table-column fixed prop="name" label="学生姓名" align="center" width="180"/>
        <el-table-column fixed prop="result_mark" label="总分" align="center" width="120"/>
        <el-table-column prop="status" label="作答状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['status'] === '未参加'" type="info">
              <el-icon><X /></el-icon>
              {{ scope['row']['status'] }}
            </el-tag>
            <el-tag size="small" v-else-if="scope['row']['status'] === '正常'" type="success">
              <el-icon><Check /></el-icon>
              {{ scope['row']['status'] }}
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><ShieldAlert /></el-icon>
              {{ scope['row']['status'] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="作答开始时间" align="center" width="180">
          <template #default="scope">
            {{ scope['row']['start_time'] ? scope['row']['start_time'] : '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="作答结束时间" align="center" width="180">
          <template #default="scope">
            {{ scope['row']['end_time'] ? scope['row']['end_time'] : '--' }}
          </template>
        </el-table-column>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="160" :resizable="false">
          <template #default="scope">
            <el-button
                link
                v-if="scope['row']['status'] === '正常'"
                size="small"
                type="primary"
                :icon="FileSymlink"
                @click="goPaperResultDetail(scope.row.id)"
            >
              查看成绩详情
            </el-button>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="/src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import router from "../../router";
import { ExamResult } from "../../api";
import {ElMessage} from "element-plus";
import {storeToRefs} from 'pinia'
import { useExamResultDetailStore } from "../../stores/ExamResultDetailStore.ts";
import { Check, ChevronLeft, FileSymlink, Search, ShieldAlert, X} from "lucide-vue-next";

// 从Store中获取考试信息
const examResultDetail = useExamResultDetailStore()
const { examInfo, sourceUrl } = storeToRefs(examResultDetail)
examResultDetail.getExamInfo()

// 返回至考试结果页面
const goBack = () => {
  router.replace(sourceUrl.value)
}

// 查询条件
const queryInfo = reactive({
  exam_id: examInfo.value['id'],
  student_id: null,
  name: null,
  result_mark: null
})

// 存储表格数据
const tableData: any = ref([])
const total: any = ref(0)

// 获取表格数据
const getExamResultData = () => {
  ExamResult.getExamResultApi(queryInfo).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any = []
      response.data.data.map((item: any) => {
        tempData.push({
          id: item['id'],
          student_id: item['student_info']['student_id'],
          name: item['student_info']['name'],
          result_mark: item['result_mark'],
          start_time: item['start_time'],
          end_time: item['end_time'],
          status: !item['start_time'] ? '未参加' : item['ending_status'] ? '正常' : '退出异常',
        })
      })
      tableData.value = tempData
      total.value = response.data.total
    }
  })
}

onMounted(() => {
  getExamResultData()
})

// 进入成绩详情页面
const goPaperResultDetail = (recordId) => {
  router.replace(`/paperResultTeacher/${ recordId }`)
  localStorage.setItem('RESULT_DETAILS_SOURCE_URL_TEACHER', router.currentRoute.value.path)
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.exam-result-detail-main {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.page-header-wording {
  color:#5e5e5e;
  font-size: 14px;
}

.exam-result-detail-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
}
</style>