import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class Paper {
  // 查询获取试卷列表接口
  async getPapersApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/paper', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 发布试卷接口
  async paperPublishApi(id: string): Promise<Result> {
    const { data } = await axios.post('/paperPublish', { id })
    return data
  }

  // 取消发布试卷接口
  async paperCancelPublishApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/paperPublish', { data: { id } })
    return data
  }

  // 新增试卷接口
  async createPaperApi(paperInfo: object): Promise<Result> {
    const { data } = await axios.post('/paper', { ...paperInfo })
    return data
  }

  // 删除试卷接口
  async delPaperApi(paperId: string): Promise<Result> {
    const { data } = await axios.delete('/paper/' + paperId)
    return data
  }

  // 编辑试卷接口
  async editPaperApi(paperInfo: any): Promise<Result> {
    const { data } = await axios.put('/paper/' + paperInfo['id'], { ...paperInfo })
    return data
  }

  // 根据试卷ID获取模块信息接口
  async getPaperModuleApi(paperId: string): Promise<Result> {
    const { data } = await axios.get('/paperModule/' + paperId)
    return data
  }

  // 创建试卷模块接口
  async createPaperModuleApi(moduleInfo: object): Promise<Result> {
    const { data } = await axios.post('/paperModule', { ...moduleInfo })
    return data
  }

  // 删除试卷模块接口
  async delPaperModuleApi(moduleId: string, paperId: string): Promise<Result> {
    const { data } = await axios.delete('/paperModule', { data: { id: moduleId, paper_id: paperId } })
    return data
  }

  // 更新试卷模块顺序接口
  async paperModuleSortApi(modules: any): Promise<Result> {
    const { data } = await axios.put('/paperModuleSort', { modules })
    return data
  }

  // 更新试卷模块信息接口
  async editPaperModuleApi(moduleInfo: any): Promise<Result> {
    const { data } = await axios.put('/paperModule/' + moduleInfo['id'], { ...moduleInfo })
    return data
  }

  // 复制试卷信息接口
  async copyPaperApi(id: string, created_user: string): Promise<Result> {
    const { data } = await axios.post('/paperCopy', { id, created_user })
    return data
  }

  // 根据试卷ID获取关联的试题信息接口
  async getPaperQuestionsApi(paperId: string): Promise<Result> {
    const { data } = await axios.get('/paperQuestion/' + paperId)
    return data
  }

  // 取消关联试卷试题信息接口
  async deletePaperQuestionApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/paperQuestion/' + id)
    return data
  }

  // 关联试题接口
  async linkQuestionsApi(questions_info: []): Promise<Result> {
    const { data } = await axios.post('/paperQuestion', { questions_info })
    return data
  }

  // 关联试题排序接口
  async linkQuestionsSortApi(link_questions: []): Promise<Result> {
    const { data } = await axios.put('/paperQuestionsSort', { link_questions })
    return data
  }

  // 编辑已关联的试题接口
  async editPaperQuestionApi(question_info: any): Promise<Result> {
    const { data } = await axios.put('/paperQuestion/' + question_info['id'], { ...question_info })
    return data
  }

  // 获取试卷信息接口（用于选择器）
  async getPapersForSelectorApi(user_id: any): Promise<Result> {
    const { data } = await axios.get('/paperForSelector', { params: { user_id } })
    return data
  }

  // 获取完整试卷信息接口（用于查看预览试卷）
  async getCompletePaperApi(id: string): Promise<Result> {
    const { data } = await axios.get('/paperView/' + id)
    return data
  }
}

export default new Paper()
