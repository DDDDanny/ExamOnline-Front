import axios from '../utils/request'


export class UserLogin {
  async studentLogin(studentInfo: any) {
    const { data } = await axios.post('/studentLogin', studentInfo)
    return data
  }

  async teacherLogin(teacherInfo: any) {
    const { data } = await axios.post('/teacherLogin', teacherInfo)
    return data
  }
}

export default new UserLogin()
