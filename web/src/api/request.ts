import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios'

import { ResultEnum } from '#/enum'
import type { Result } from '#/api'

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截
axiosInstance.interceptors.request.use(
  config => {
    config.headers.Authorization = 'Bearer Token'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) throw new Error('API请求失败')

    const {  data, message,code } = res.data
    // 业务请求成功
    const hasSuccess = data && Reflect.has(res.data, 'code') && code === ResultEnum.SUCCESS
    if (hasSuccess) {
      return data
    }

    // 业务请求错误
    throw new Error(message || 'API请求失败')
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {}

    const errMsg = response?.data?.message || message || '系统错误'
    // toast.error(errMsg, {
    //   position: 'top-center'
    // })

    const status = response?.status
    if (status === 401) {
    }
    return Promise.reject(error)
  }
)

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' })
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  }
}
export default new APIClient()
