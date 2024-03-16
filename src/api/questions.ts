import axios from '../utils/request'


export class Question {
  async getQuestions(querySet: object) {
    const { data } = await axios.get('/question', { params: { ...querySet } })
    return data
  }
}

export default new Question()
