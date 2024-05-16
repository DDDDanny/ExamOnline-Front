import { ref } from 'vue'
import { defineStore } from 'pinia';


// 考试-成绩单详情
export const useExamResultDetailStore = defineStore('examResultDetail', () => {
  const examInfo: any = ref(null)
  // 来源路由
  const sourceUrl: any = ref('/examResult')

  // set考试信息，使用localStorage来持久化数据
  const setExamInfo = (item: any, url: string) => {
    localStorage.setItem('STORE_EXAM_INFO', JSON.stringify(item))
    localStorage.setItem('STORE_SOURCE_URL', url)
  }

  // 获取数据
  const getExamInfo = () => {
    examInfo.value = JSON.parse(localStorage.getItem('STORE_EXAM_INFO')!)
    sourceUrl.value = localStorage.getItem('STORE_SOURCE_URL')
  }

  return { setExamInfo, getExamInfo, examInfo, sourceUrl }
})
