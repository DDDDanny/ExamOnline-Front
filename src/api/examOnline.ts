import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class ExamOnline {
  // 根据学生ID，查询获取考试列表接口（未开始的考试）
  async getExamsByStuIdApi(studentId: string): Promise<Result> {
    const { data } = await axios.get('/examOnline', {
      params: { studentId }
    })
    return data
  }
}

export default new ExamOnline()
