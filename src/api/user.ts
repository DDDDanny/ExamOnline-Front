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

  // 批量激活学生接口
  async batchActiveStudentsApi(ids: string[]): Promise<Result> {
    const { data } = await axios.post('/studentBatchActivation', { ids })
    return data
  }

  // 新增学生信息接口
  async createStudentApi(studentInfo: any): Promise<Result> {
    const { data } = await axios.post('/student', { ...studentInfo })
    return data
  }

  // 编辑学生信息接口
  async editStudentApi(studentInfo: any): Promise<Result> {
    const { data } = await axios.put('/student/' + studentInfo['id'], { ...studentInfo })
    return data
  }

  // 删除学生信息接口
  async deleteStudentApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/student/' + id)
    return data
  }

  // 获取教师信息列表接口
  async getTeachersApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/teacher', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 删除教师信息接口
  async deleteTeacherApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/teacher/' + id)
    return data
  }

  // 新增教师信息接口
  async createTeacherApi(teacherInfo: any): Promise<Result> {
    const { data } = await axios.post('/teacher', { ...teacherInfo })
    return data
  }

  // 编辑教师信息接口
  async editTeacherApi(teacherInfo: any): Promise<Result> {
    const { data } = await axios.put('/teacher/' + teacherInfo['id'], { ...teacherInfo })
    return data
  }
}

export default new User()
