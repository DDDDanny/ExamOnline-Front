import axios from '../utils/request'
import { Result } from "./response.interface.ts";


export class UserLogin {
  async studentLoginApi(studentInfo: any): Promise<Result> {
    const { data } = await axios.post('/studentLogin', studentInfo)
    return data
  }

  async teacherLoginApi(teacherInfo: any): Promise<Result> {
    const { data } = await axios.post('/teacherLogin', teacherInfo)
    return data
  }
}

export default new UserLogin()
