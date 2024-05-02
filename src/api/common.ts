import axios from '../utils/request'
import { Result } from "./response.interface.ts";


export class Common {
  // 下载上传学生模版文件接口
  async downloadFileApi(filename: string): Promise<Result> {
    return await axios.get('/download/' + filename, {responseType: 'blob'})
  }
}

export default new Common()


