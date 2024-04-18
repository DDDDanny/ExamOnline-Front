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
}

export default new Exam()
