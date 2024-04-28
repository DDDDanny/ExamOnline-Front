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
}

export default new User()
