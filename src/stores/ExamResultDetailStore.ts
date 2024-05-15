import { ref } from 'vue'
import { defineStore } from 'pinia';


// 考试-成绩单详情
export const useExamResultDetailStore = defineStore('examResultDetail', () => {
  const examInfo: any = ref(null)
  // 来源路由
  const sourceUrl: any = ref('/examResult')

  function getExamInfo(item: any, url: string) {
    examInfo.value = item
    sourceUrl.value = url
  }

  return { examInfo, sourceUrl, getExamInfo }
})
