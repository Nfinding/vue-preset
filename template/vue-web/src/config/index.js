// 配置信息
export const VUE_APP_ENV = process.env.VUE_APP_ENV

export const isProduction = VUE_APP_ENV === 'production' || VUE_APP_ENV === 'rc'

const BASE_URL_MAP = {
  local: 'devspa.jiliguala.com',
  develop: 'devspa.jiliguala.com',
  rc: 'rcspa.jiliguala.com',
  production: 'spa.jiliguala.com',
}

export const BASE_URL = BASE_URL_MAP[ VUE_APP_ENV || 'develop' ]