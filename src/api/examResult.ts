import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class ExamResult {
  // 查询获取考试结果接口
  async getExamResultApi(querySet: object): Promise<Result> {
    const { data } = await axios.get('/examResult', { params: { ...querySet } })
    return data
  }

  // 创建考试结果接口（新增考试-考生关联关系）
  async createExamResultApi(exam_id: string, student_ids: string[]): Promise<Result> {
    const { data } = await axios.post('/examResult', { exam_id, student_ids })
    return data
  }

  // 更新考试结果API
  async updateExamResultApi(examResultId: string, updateData: any): Promise<Result> {
    const { data } = await axios.put(
      `/examResult/${examResultId}`,
      { ...updateData }
    )
    return data
  }

  // 创建考试结果详情API
  async createExamResultDetailApi(detailData: {}): Promise<Result> {
    const { data } = await axios.post('/examResultDetail', { ...detailData })
    return  data
  }
}

export default new ExamResult()
