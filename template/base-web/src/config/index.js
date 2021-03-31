// 配置信息
export const VUE_APP_ENV = process.env.VUE_APP_ENV

export const isProduction = VUE_APP_ENV === 'production' || VUE_APP_ENV === 'rc'
