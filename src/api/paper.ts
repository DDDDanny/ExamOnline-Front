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

  // 发布试卷
  async paperPublishApi(id: string): Promise<Result> {
    const { data } = await axios.post('/paperPublish', { id })
    return data
  }

  // 取消发布试卷
  async paperCancelPublishApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/paperPublish', { data: { id } })
    return data
  }

  // 新增试卷
  async createPaperApi(paperInfo: object): Promise<Result> {
    const { data } = await axios.post('/paper', { ...paperInfo })
    return data
  }
}

export default new Paper()
