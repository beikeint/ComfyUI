module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE || 'http://localhost:5050',
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      css: {
        sourceMap: true
      },
      postcss: {
        sourceMap: true
      }
    }
  }
};
