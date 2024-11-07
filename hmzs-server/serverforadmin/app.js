const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')

const app = new Koa()

// 前端history模式 如果后端不做任何处理 页面刷新的时候 白屏问题
// 通过中间件 强制每一个路径自动转发到index.html

app.use(historyApiFallback())
// 使用 koa-static 中间件提供静态文件服务
app.use(koaStatic(path.join(__dirname, 'public')))

// 启动服务器
app.listen(8086, () => {
  console.log('Server is running on port 8086')
})