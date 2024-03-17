import axios from '../utils/request'


export class Question {
  async getQuestions(querySet: object, currentPage: number, pageSize:number) {
    const { data } = await axios.get('/question', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }
}

export default new Question()
