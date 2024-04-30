import axios from '../utils/request'
import { Result } from "./response.interface.ts";


export class User {
  // 获取学生信息列表接口
  async getStudentsApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/student', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 批量激活接口
  async batchActiveStudentsApi(ids: string[]): Promise<Result> {
    const { data } = await axios.post('/studentBatchActivation', { ids })
    return data
  }

  // 删除学生接口
  async deleteStudentApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/student/' + id)
    return data
  }
}

export default new User()
