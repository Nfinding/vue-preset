import qs from 'qs'
import { BASE_URL } from '../config'
import store from '../store'

class HttpRequest {
  constructor(baseURL = '') {
    //axios默认配置
    this.defaultConfig = {
      baseURL: baseURL, // API根路径
      headers: {
        // 每次请求带上token
        common: {
          Authorization: `Basic ${store.state.token}` || ''
        },
        post: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      },
      timeout: 10 * 1000 // 请求超时时间:10s后请求失败
    }
    this.pending = new Map() // 存储每次请求的cancel函数
  }
  /**
   *
   * 创建Axios实例
   * @param {Object} options 用户传进来的配置
   * @return {Axios} 返回axios实例
   * @memberof HttpRequest
   */
  static createAxiosInstance (options) {
    const axiosInstance = axios.create()
    // 将默认配置和用户设置的配置进行合并
    const newOptions = this.mergeOptions(this.getDefaultConfig(), options)
    // 调用拦截器
    this.interceptors(axiosInstance)
    // 返回实例
    return axiosInstance(newOptions)
  }

  /**
   * 合并配置
   *
   * @param {Object} defaultOpt 已有配置
   * @param {Object} source 传入的配置
   * @return {Object} 返回新配置
   * @memberof HttpRequest
   */
  static mergeOptions (defaultOpt, source) {
    if (typeof source !== 'object' || source == null) {
      return defaultOpt
    }
    return Object.assign(defaultOpt, source)
  }

  /**
   * cancelKey管理器
   * @param isUniqueUrl 来判断当前是“请求取消”「取消的是相同的请求，参数不一样」还是“请求拦截”「拦截的是完全一样的请求」
   * @return {Object} 返回一个对象，对象暴露两个方法，一个可以获取本次请求的key，一个是设置本次请求的key
   * @memberof HttpRequest
   */
  static cancelKeyManager () {
    const expose = {}
    expose.setKey = function setKey (config, isUniqueUrl = false) {
      const { method, url, params, data } = config
      expose.key = `${method}&${url}`
      // 主要针对用户频繁切换分类、请求下一页的情况，拦截已经发出去的请求
      if (!isUniqueUrl) {
        return
      }
      // 主要针对同一个请求，比如请求验证码、提交表单，主要用来取消当前请求，等上一次请求完事再发送
      expose.key = method === 'get' ? `${expose.key}&${qs.stringify(params)}` : `${expose.key}&${qs.stringify(data)}`
    }
    expose.getKey = function getKey () {
      return expose.key
    }
    return expose
  }

  /**
   * 拦截器
   *
   * @param {Axios} instance
   * @memberof HttpRequest
   */
  interceptors (instance) {
    // 添加请求拦截器
    instance.interceptors.request.use((config) => {
      // 对请求进行拦截
      // 如果post请求格式是application/x-www-form-urlencoded，则序列化数据
      if (
        config.headers.post['Content-Type'].startsWith('application/x-www-form-urlencoded') &&
          config.method === 'post'
      ) {
        config.data = qs.stringify(config.data)
      }
      // 处理请求拦截和请求取消两种情况, 默认情况是请求取消,即取消已经发出去的请求
      // 传入第二个参数为false为拦截本次请求，等上一次请求响应后再发送
      config = this.handleRequestCancel(config)
      // 根据后台的要求可以返回格式化的json
      config.url = `${config.url}?pretty`
      return config
    }, (error) => {
      // 对请求错误做些什么
      errorHandle(error)
      return Promise.reject(error)
    })

    // 响应拦截器
    instance.interceptors.response.use((res) => {
      // 获取本次请求的key
      const manager = this.cancelKeyManager()
      const key = manager.getKey()
      // 清除pending中保存的key,来表明这个请求已经响应
      this.removeRequest(key, false)
      // axios正常响应
      if (res.status === 200) {
        return Promise.resolve(res.data)
      }
      return Promise.reject(res)
    }, (error) => {
      // 对响应错误做点什么
      errorHandle(error)
      return Promise.reject(error)
    })
  }

  /**
   *处理请求拦截和请求取消
   *
   * @param {object} config axios配置对象
   * @param {boolean} [isCancel=true] 标识是请求取消还是拦截请求
   * @return {object} 返回axios配置对象
   * @memberof HttpRequest
   */
   handleRequestCancel (config, isCancel = true) {
    // 设置本次请求的key
    const { setKey, getKey } = this.cancelKeyManager()
    setKey(config, true)
    const key = getKey()
    const CancelToken = axios.CancelToken
    // 取消已经发出去的请求
    if (isCancel) {
      this.removeRequest(key, true)
      // 设置本次请求的cancelToken
      config.cancelToken = new CancelToken(c => {
        this.pending.set(key,c)
      })
    } else {
      // 拦截本次请求
      config.cancelToken = new CancelToken(c => {
        // 将本次的cancel函数传进去
        this.removeRequest(key, true, c)
      })
    }
    return config
  }
  /**
   * 移除请求
   *
   * @param {string} key 标识请求的key
   * @param {boolean} [isRequest=false] 标识当前函数在请求拦截器调用还是响应拦截器调用
   * @param {function} c cancel函数
   * @memberof HttpRequest
   */
   removeRequest (key, isRequest = false, c) {
    // 请求前先判断当前请求是否在pending中，如果存在有两种情况：
    // 1. 上次请求还未响应，本次的请求被判为重复请求，则调用cancel方法拦截本次重复请求或者取消上一个请求
    // 2. 上次请求已经响应，在response中被调用，清除key
    if (this.pending.has(key)) {
      if (isRequest) {
        const msg = '您的操作过于频繁,请您稍后再试'
        const cancelToken = this.pending.get(key)
        c ? c(msg) : cancelToken(msg)
      } else {
        // 上一次请求在成功响应后调用cancel函数删除key
        this.pending.delete(key)
      }
    }
  }

  /**
   * axios统一错误处理主要针对HTTP状态码错误
   * @param {Object} err
   */
  static errorHandle (err) {
    // 判断服务器是否响应了
    if (err.response) {
      switch (err.response.status) {
        // 用户无权限访问接口
        case 401:
          console.warn('请您先登录~')
          //TODO
          break
        // 请求的资源不存在
        case 404:
          // 处理404
          console.warn('您请求的资源不存在呢~')
          //TODO
          break
        // 服务器500错误
        case 500:
          console.warn('服务器异常,请稍后再试哦~')
          break
      }
    } else if (
      err.message.includes('timeout') ||
      !window.navigator.onLine
    ) {
      //可添加对应网络异常code 添加在判断条件中
      // 处理超时和断网
      console.warn('网络已断开，请查看你的网络连接~')
    } else {
      //TODO 进行其他处理
      console.warn(err.stack)
    }
  }


}
class Request {
  static request(url, data = null, method = 'GET', config) {
    let parseData = method === 'GET' ? { params: data } : { data }
    return HttpRequest.createAxiosInstance({
      url,
      method,
      ...parseData,
      ...config
    })
  }

  static get(path, data = null, config = {}) {
    return this.request(path, data, 'GET', config)
  }

  static post(path, data = {}, config = {}) {
    return this.request(path, data, 'POST', config)
  }

  static put(path, data = {}, config = {}) {
    return this.request(path, data, 'PUT', config)
  }

  static delete(path, data = {}, config = {}) {
    return this.request(path, data, 'DELETE', config)
  }
}
export default Request