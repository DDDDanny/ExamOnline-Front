import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class Paper {
  // 查询获取试卷列表接口
  async getPapersApi(querySet: object, currentPage: number, pageSize:number): Promise<Result> {
    const { data } = await axios.get('/paper', {
      params: { ...querySet, currentPage, pageSize }
    })
    return data
  }

  // 发布试卷接口
  async paperPublishApi(id: string): Promise<Result> {
    const { data } = await axios.post('/paperPublish', { id })
    return data
  }

  // 取消发布试卷接口
  async paperCancelPublishApi(id: string): Promise<Result> {
    const { data } = await axios.delete('/paperPublish', { data: { id } })
    return data
  }

  // 新增试卷接口
  async createPaperApi(paperInfo: object): Promise<Result> {
    const { data } = await axios.post('/paper', { ...paperInfo })
    return data
  }

  // 删除试卷接口
  async delPaperApi(paperId: string): Promise<Result> {
    const { data } = await axios.delete('/paper/' + paperId)
    return data
  }

  // 编辑试卷接口
  async editPaperApi(paperInfo: any): Promise<Result> {
    const { data } = await axios.put('/paper/' + paperInfo['id'], { ...paperInfo })
    return data
  }

  // 根据试卷ID获取模块信息接口
  async getPaperModuleApi(paperId: string): Promise<Result> {
    const { data } = await axios.get('/paperModule/' + paperId)
    return data
  }

  // 创建试卷模块接口
  async createPaperModuleApi(moduleInfo: object): Promise<Result> {
    const { data } = await axios.post('/paperModule', { ...moduleInfo })
    return data
  }

  // 删除试卷模块接口
  async delPaperModuleApi(moduleId: string, paperId: string): Promise<Result> {
    const { data } = await axios.delete('/paperModule', { data: { id: moduleId, paper_id: paperId } })
    return data
  }

  // 更新试卷模块顺序接口
  async paperModuleSortApi(modules: any): Promise<Result> {
    const { data } = await axios.put('/paperModuleSort', { modules })
    return data
  }

  // 更新试卷模块信息接口
  async editPaperModuleApi(moduleInfo: any): Promise<Result> {
    const { data } = await axios.put('/paperModule/' + moduleInfo['id'], { ...moduleInfo })
    return data
  }
}

export default new Paper()
