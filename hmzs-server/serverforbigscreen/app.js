const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')
const cors = require('koa2-cors')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')

const app = new Koa()
// 容许跨域
app.use(cors())
// 解决刷新白屏问题
app.use(historyApiFallback())
// 使用 koa-static 中间件提供静态文件服务
app.use(koaStatic(path.join(__dirname, 'public')))

// 启动服务器
app.listen(8089, () => {
  console.log('Server is running on port 8089')
})