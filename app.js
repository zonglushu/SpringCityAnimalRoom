// 微信小程序的 app.js


App({
  onLaunch:function (options) {
    wx.cloud.init({
      env: 'lovers-2ghufp1ec04bc518', // 替换为你的云开发环境 ID
      traceUser: true,
    });
    
  },
  onShow:function (options) {
  }
})