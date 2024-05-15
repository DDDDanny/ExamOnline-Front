import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class ExamResult {
  // 查询获取考试结果接口
  async getExamResultApi(querySet: object): Promise<Result> {
    const { data } = await axios.get('/examResult', { params: { ...querySet } })
    return data
  }
}

export default new ExamResult()
