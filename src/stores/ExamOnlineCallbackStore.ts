import { ref } from 'vue'
import { defineStore } from 'pinia';

// 考试完成后回调数据
export const useExamOnlineCallbackStore = defineStore('examOnlineCallback', () => {
  const scoreViewDialogVisible = ref(false)

  function changeDialogVisible() {
    scoreViewDialogVisible.value = !scoreViewDialogVisible.value
  }

  const scoreInfo = ref({
    score: 0, start_time: null, end_time: null,
    actual_total: 0, percentage: 0, pass_mark: 0
  })

  return { scoreViewDialogVisible, changeDialogVisible, scoreInfo }
})
