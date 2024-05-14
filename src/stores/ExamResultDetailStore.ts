import { ref } from 'vue'
import { defineStore } from 'pinia';


// 考试-成绩单详情
export const useExamResultDetailStore = defineStore('examResultDetail', () => {
  const examInfo: any = ref(null)

  function getExamInfo(item: any) {
    examInfo.value = item
  }

  return { examInfo, getExamInfo }
})
