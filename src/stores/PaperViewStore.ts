import { ref } from 'vue'
import { defineStore } from 'pinia';


// 试卷预览
export const usePaperViewStore = defineStore('paperView', () => {
  const paperInfo: any = ref(null)
  // 来源路由
  const sourceUrl: any = ref('/personalPapers')

  // set试卷信息，使用localStorage来持久化数据
  const setPaperInfo = (item: any, url: string) => {
    localStorage.setItem('STORE_PAPER_INFO', JSON.stringify(item))
    localStorage.setItem('STORE_PAPER_VIEW_SOURCE_URL', url)
  }

  // 获取数据
  const getPaperInfo = () => {
    paperInfo.value = JSON.parse(localStorage.getItem('STORE_PAPER_INFO')!)
    sourceUrl.value = localStorage.getItem('STORE_PAPER_VIEW_SOURCE_URL')
  }

  return { setPaperInfo, getPaperInfo, paperInfo, sourceUrl }
})
