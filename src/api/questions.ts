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
}

export default new Question()
