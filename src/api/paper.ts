import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class Paper {
  // 查询获取试卷列表
  async getPapersApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/paper', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }
}

export default new Paper()
