import axios from '../utils/request'
import { Result } from "./response.interface.ts";


export class UserLogin {
  // 学生用户登录接口
  async studentLoginApi(studentInfo: any): Promise<Result> {
    const { data } = await axios.post('/studentLogin', studentInfo)
    return data
  }

  // 教师用户登录接口
  async teacherLoginApi(teacherInfo: any): Promise<Result> {
    const { data } = await axios.post('/teacherLogin', teacherInfo)
    return data
  }

  // 教师用户修改密码接口
  async teacherChangePasswordApi(userId: string, pwdInfo: any): Promise<Result> {
    const { data } = await axios.put('/teacherChangePassword/' + userId, pwdInfo)
    return data
  }

  // 学生用户修改密码接口
  async studentChangePasswordApi(userId: string, pwdInfo: any): Promise<Result> {
    const { data } = await axios.put('/studentChangePassword/' + userId, pwdInfo)
    return data
  }
}

export default new UserLogin()
