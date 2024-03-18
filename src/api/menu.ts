import axios from '../utils/request'


export class Menu {
  async getMenuApi(role: string) {
    const { data } = await axios.get('/menu', { params: { is_show: role } })
    return data
  }
}

export default new Menu()
