import axios from 'axios'
import { showToast } from 'vant'
import router from '../router';

const http = axios.create({
  baseURL: 'https:/v3pz.itndedu.com/v3pz',
  timeout: 100000,
  headers: { "terminal": "h5" }
})

//添加拦截器
// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('h5_token')
  //不需要添加token的api
  const whiteUrl = ['/login']
  if (token && !whiteUrl.some(url => config.url.includes(url))) {
    console.log('已添加token', token)
    config.headers['h-token'] = token
    console.log('已添加h-token')
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

http.interceptors.response.use(function (response) {
  const res = response.data
  if (res.code === -1) {
    showToast(res.message)
    return Promise.reject(res)
  }
  else if (res.code === -2) {
    showToast(res.message || 'token失效')
    localStorage.removeItem('h5_token')
    localStorage.removeItem('h5_userInfo')
    router.push('/login')
    return Promise.reject(res)
  }
  return response
},
  function (error) {
    return Promise.reject(error)
  })

export default http