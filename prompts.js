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
      { name: 'pc-web', value: 'pc-web' },
      { name: 'mo-web', value: 'mo-web' }
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
    name: 'chooseRouterMode',
    // 该项目唯一安装的依赖 chalk; 目的是使用控制台输出 chalk.yellow('xxx') xxx 文字有颜色
    // ? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
    message: `是否使用history路由 ${chalk.yellow(`(需要适当的服务器设置，以便在生产环境中进行索引回退！)`)}`,
    description: `Using History API, the URLs don't need  '#' character.`
  },
  {
    type: 'confirm',
    name: 'chooseTs',
    // 该项目唯一安装的依赖 chalk; 目的是使用控制台输出 chalk.yellow('xxx') xxx 文字有颜色
    message: '是否引入ts语法',
    description: `${chalk.green(`(编译时语法提示！)`)}`
  }
]