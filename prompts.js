// 内建插件对话，进行安装时提示用户的操作流程
let chalk = require('chalk')
/**
 * 本质上是一个对话配置文件
 */
module.exports = [
  {
    type: 'list', // 即类型为 选择项
    name: 'project', // 名称，作为下面 generator.js导出 函数 options 的键
    message: '请选择你要生成的项目类型', // 提示语
    choices: [
      { name: 'vue-web', value: 'vue-web' },
      { name: 'base-web', value: 'base-web' },
    ],
    default: 'vue-web',
  },
  {
    type: 'input', // 类型为 输入项
    name: 'projectName', // 名称，作为下面 generator.js导出 函数 options 的键
    message: '请输入项目的名称', // 提示语
    default: 'vue-web'
  },
  {
    type: 'confirm',
    name: 'vuex',
    message: ` ${chalk.yellow(`(是否引入vuex?)`)}`,
    description:  `${chalk.green(`(数据管理仓库！)`)}`
  },
  {
    type: 'confirm',
    name: 'vueRouter',
    // 该项目唯一安装的依赖 chalk; 目的是使用控制台输出 chalk.yellow('xxx') xxx 文字有颜色
    // ? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
    message: `是否使用路由 ${chalk.yellow(`(需要适当的服务器设置，以便在生产环境中进行索引回退！)`)}`,
  },
  {
    when: prev => prev.vueRouter,
    type: 'confirm',
    name: 'historyRouter',
    message: '是否引入history路由',
    description: `Using History API, the URLs don't need  '#' character.`
  }
]