import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class HomePage {
  // 获取考试统计数据
  async getExamStatisticsApi(role: string, user_id: string): Promise<Result> {
    const { data } = await axios.get('/examStatistic', {
      params: { role, user_id }
    })
    return data
  }
}

export default new HomePage()
