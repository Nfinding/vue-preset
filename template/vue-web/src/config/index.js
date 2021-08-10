// 配置信息
export const VUE_APP_ENV = process.env.VUE_APP_ENV

export const isProduction = VUE_APP_ENV === 'production' || VUE_APP_ENV === 'rc'

const BASE_URL_MAP = {
  local: 'https://dev.jiliguala.com',
  develop: 'https://dev.jiliguala.com',
  fat: 'https://fat.jiliguala.com',
  rc: 'https://rc.jiliguala.com',
  production: 'https://jiliguala.com',
}

export const BASE_URL = BASE_URL_MAP[ VUE_APP_ENV || 'develop' ]