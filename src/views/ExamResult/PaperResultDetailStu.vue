<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">{{ examTitle }} - 成绩预览</span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <common-result-view
        :paper-info="paperInfo"
        :exam-result-answers="examResultAnswers"
        :is-collect="true"
        @update-data="getExamResultQuestionsInfo"
    />
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronLeft } from "lucide-vue-next";
import { getCookie } from "../../utils/cookie.ts";
import CommonResultView from "../../components/CommonResultView.vue";
import { ExamResult, Paper } from "../../api";
import { ElMessage } from "element-plus";

// 获取用户ID
const studentId = JSON.parse(getCookie('UserInfo')).userId

// 试卷信息
const paperInfo = ref({})
// 考试标题
const examTitle = ref('')

// ExamResultId
const examResultId = router.currentRoute.value.params.id

// 获取考试结果概览以及试卷信息
const getExamResultInfo = () => {
  ExamResult.getExamResultByIdApi(examResultId).then((response: any) => {
    if (response.code !== 200) {
      ElMessage.error(response.message)
      return
    }
    examTitle.value = response.data.exam_info.title
    const paperId: string = response.data.exam_info.paper_id
    // 获取试卷信息
    Paper.getPaperInfoApi(paperId).then((res: any) => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      paperInfo.value = res.data
    })
  })
}

// 获取考试答案
const examResultAnswers = ref([])
// 获取考试结果试题详情
const getExamResultQuestionsInfo = () => {
  ExamResult.getExamResultDetailApi(examResultId, studentId).then((response: any) => {
    if (response.code !== 200) {
      ElMessage.error(response.message)
      return
    }
    examResultAnswers.value = response.data
  })
}

// 处理页面返回
const goBack = () => {
  const sourceUrl = localStorage.getItem('RESULT_DETAILS_SOURCE_URL_STU')
  router.replace(sourceUrl)
}

onMounted(() => {
  getExamResultInfo()
  getExamResultQuestionsInfo()
})

onBeforeUnmount(() => {
  // 销毁
  localStorage.removeItem('RESULT_DETAILS_SOURCE_URL_STU')
})
</script>

<style scoped lang="scss">
@import "../../style.scss";

.exam-result-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.page-header-wording {
  color:#5e5e5e;
  font-size: 14px;
}
</style>
