import axios from 'axios';

// 配置基础URL
axios.defaults.baseURL='http://127.0.0.1:8000/api'

// 配置拦截器
axios.interceptors.request.use(config => {
  if (!config.url!.includes('Login')) {
    const token = localStorage.getItem('TOKEN')
    // 在请求头中统一添加参数
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config;
}, error => {
  // 处理请求错误
  return Promise.reject(error);
})

export default axios
