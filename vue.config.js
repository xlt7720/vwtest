console.log('正在打包' + process.env.VUE_APP_ENV + '环境')
const vuxLoader = require('vux-loader')

module.exports = {
    publicPath: process.env.VUE_APP_path || '/',
    outputDir: './../dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: () => {},
    runtimeCompiler: true,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,

    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },

    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,

    // webpack-dev-server 相关配置
    devServer: {
        disableHostCheck: true, // 禁用webpack热重载检查 解决热更新失效问题
        open: process.platform === 'darwin',
        host: '127.0.0.1',
        port: 8087,
        https: false,
        hotOnly: false,
        proxy: 'http://wap-pre-api.lvshou.net'
    },
    // 第三方插件配置
    pluginOptions: {
    },
    // vux相关配置， 使用vux-ui
    configureWebpack: config => {
      vuxLoader.merge(config, {
            options: {},
            plugins: ['vux-ui']
        })
    }, 
}