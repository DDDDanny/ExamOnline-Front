import axios from '../utils/request'


export class Question {
  // 查询获取试题列表
  async getQuestionsApi(querySet: object, currentPage: number, pageSize:number) {
    const { data } = await axios.get('/question', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 删除试题接口
  async delQuestionApi(questionId: string) {
    const { data } = await axios.delete('/question/' + questionId)
    return data
  }
}

export default new Question()
