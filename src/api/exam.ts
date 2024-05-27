import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class Exam {
  // 查询获取考试列表接口
  async getExamsApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/exam', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 取消发布考试接口
  async publishExamApi(id: string): Promise<Result> {
    const { data } = await axios.post('/examPublish/' + id)
    return data
  }

  // 发布考试接口
  async cancelPublishExamApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/examPublish/' + id)
    return data
  }

  // 删除考试信息接口
  async deleteExamApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/exam/' + id)
    return data
  }

  // 创建考试信息接口
  async createExamApi(examInfo: object): Promise<Result> {
    const { data } = await axios.post('/exam', { ...examInfo })
    return data
  }

  // 编辑考试信息接口
  async editExamApi(examInfo: any): Promise<Result> {
    const { data } = await axios.put('/exam/' + examInfo['id'], { ...examInfo })
    return data
  }

  // 获取考试计划数据
  async getExamScheduleApi(querySet: any): Promise<Result> {
    const { data } = await axios.get('/examSchedule', { params: { ...querySet }})
    return data
  }
}

export default new Exam()
