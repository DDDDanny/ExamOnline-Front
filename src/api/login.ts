import axios from '../utils/request'


export class UserLogin {
  async studentLoginApi(studentInfo: any) {
    const { data } = await axios.post('/studentLogin', studentInfo)
    return data
  }

  async teacherLoginApi(teacherInfo: any) {
    const { data } = await axios.post('/teacherLogin', teacherInfo)
    return data
  }
}

export default new UserLogin()
