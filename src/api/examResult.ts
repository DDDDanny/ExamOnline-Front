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

  // 查询考试结果接口（学生端）
  async getStudentExamsResultApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/examResultStu', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 通过ID获取考试结果信息
  async getExamResultByIdApi(id:string): Promise<Result> {
    const { data } = await axios.get(`/examResult/${id}`)
    return data
  }

  // 根据考试结果ID获取详情信息
  async getExamResultDetailApi(id:string, student_id?: string): Promise<Result> {
    const { data } = await axios.get(`/examResultDetail/${id}`, { params: { student_id } })
    return data
  }

  // 生成成绩单接口
  async generateExamResultExcelApi(id: string): Promise<Result> {
    const { data } = await axios.post(`/generateExamResultExcel`, { exam_id: id })
    return data
  }
}

export default new ExamResult()
