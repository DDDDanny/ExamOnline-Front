import axios from '../utils/request'
import {Result} from "./response.interface.ts";


export class Menu {
  async getMenuApi(role: string): Promise<Result> {
    const { data } = await axios.get('/menu', { params: { is_show: role } })
    return data
  }
}

export default new Menu()
