import { ref } from 'vue'
import { defineStore } from 'pinia';

// 试卷关联试题Drawer
export const useLinkQuestionStore = defineStore('linkQuestions', () => {
  const drawerVisible = ref(false)

  function changeDrawerVisible() {
    drawerVisible.value = !drawerVisible.value
  }

  return { drawerVisible, changeDrawerVisible }
})

// 试卷关联试题-题库Drawer
export const useQuestionsWarehouseStore = defineStore('questionWarehouse', () => {
  const drawerVisibleQW = ref(false)

  function changeDrawerVisible() {
    drawerVisibleQW.value = !drawerVisibleQW.value
  }

  return { drawerVisibleQW, changeDrawerVisible }
})
