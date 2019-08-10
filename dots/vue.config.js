var path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../dots-backend/public'),
  devServer: {
    proxy: {
      // proxyTable 설정
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
