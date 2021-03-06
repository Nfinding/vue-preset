// 允许一个向 package.json 注入额外的依赖或字段，并向项目中添加 template 中的文件。
// `-- template 模板文件，里面的文件会直接被拷贝到项目中（其中有使用 ejs 模板引擎）

/**
 * @param api : 一个 GeneratorAPI 实例
 * @param options: 可以先简单理解为 prompts 问题数组的用户输入 组合成的选项对象
 * @param rootOptions: 整个 preset.json 对象
 */
module.exports = (api, options, rootOptions) => {
  // options.project 可以访问上面问题数组的第一个对象的值，默认为: 'vue-web'
  console.log(`Your choice is ${options.project}`)
  console.log(`Your input is ${options.projectName}`)

  // 删除 vue-cli3 默认的 /src 和 /public 目录
  // api.render(files => {
  //   Object.keys(files)
  //     .filter(path => path.startsWith('src/') || path.startsWith('public/'))
  //     .forEach(path => delete files[path])
  // })

  // 1.判断控制台用户的输入
  if (options.project === 'vue-web') {  
    // render函数把该路径下的 ./template/vue-web 文件拷贝到默认的vue项目中。
    // 如果文件的路径和文件名称相同的则覆盖，否则是叠加
    api.render('./template/vue-web', { InputOptions:{ ...options} })
  }

  if (options.project === 'base-web') { 
    // 2.拷贝文件并传递变量。例如：InputOptions对象中的属性/变量会覆盖掉该./template/base-web路径下html,js,json等文件对应的属性/变量
    // 3.如果该./template/pc-web 路径下的内容为空，会使用vue-cli中提供的默认的模板
    // 4.如果该 render 没有执行，会使用 vue-cli 中提供的默认的模板
    api.render('./template/base-web', { InputOptions:{ ...options} })
  }

   // 安装 vuex
   if (options.vuex) {
    api.extendPackage({
      dependencies: {
        vuex: '^3.1.2'
      }
    });

     api.render({ './src/vuex/index.js': './template/vue-web/src/store/index.js'},{ InputOptions:{ ...options} });
  }
   // 安装 vue-router
   if (options.vueRouter) {
    api.extendPackage({
      dependencies: {
        "vue-router": "^3.1.5"
      }
    });
    api.render({ './src/router/index.js': './template/vue-web/src/router/index.js' },{ InputOptions:{ ...options} })
     
    if (options.historyRouter) {
      rootOptions.routerHistoryMode = true
    }
  }
  // 3.修改 `package.json` 里的字段
  api.extendPackage({
    // 4.添加第三库的依赖
    dependencies: {
      // 'normalize.css': '^8.0.1'
      "qs":"^6.8.0",
      "axios": "^0.19.2",
    },
    // 4.添加第三库的依赖
    devDependencies: {
      // 'normalize.css': '^8.0.1'
    },
    // 5.添加自定义的脚本
    scripts: {
      // 'dev': 'vue-cli-service serve'
    },
    config: {
      
    }
  })
}