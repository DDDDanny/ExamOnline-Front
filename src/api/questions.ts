import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class Question {
  // 查询获取试题列表
  async getQuestionsApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/question', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 创建试题接口
  async createQuestionApi(questionInfo: object): Promise<Result> {
    const { data } = await axios.post('/question', { ...questionInfo })
    return data
  }

  // 删除试题接口
  async delQuestionApi(questionId: string): Promise<Result> {
    const { data } = await axios.delete('/question/' + questionId)
    return data
  }

  // 编辑试题接口
  async editQuestionApi(questionInfo: any): Promise<Result> {
    const { data } = await axios.put('/question/' + questionInfo['id'], { ...questionInfo })
    return data
  }

  // 试题收藏接口
  async collectQuestionApi(collector: string, question_id: string): Promise<Result> {
    const { data } = await axios.post('/qFavorite', { collector, question_id })
    return data
  }

  // 取消收藏接口
  async cancelCollectQuestionApi(collector: string, question_id: string): Promise<Result> {
    const { data } = await axios.delete('/qFavorite', { data: {collector, question_id} })
    return data
  }

  // 根据收藏者ID获取收藏的试题列表
  async getCollectQuestionsApi(collector: string, querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/qFavorite/' + collector, {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 根据收藏者ID获取错题集列表
  async getErrorArchiveApi(collector: string, querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/errorArchive/' + collector, {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 取消收藏（删除）错题集的试题
  async delErrorArchiveQuestionApi(collector: string, question_id: string): Promise<Result> {
    const { data } = await axios.delete('/errorArchive', { data: {collector, question_id} })
    return data
  }

  // 获取试题信息（用于试卷关联题库）
  async getQuestionsWarehouseForPaper(user_id: string): Promise<Result> {
    const { data } = await axios.get('/questionWarehouse', { params: { user_id } })
    return data
  }
}

export default new Question()
