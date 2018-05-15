var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var { systemInfo } = require('./pages/helpers/index')
var { userInfo } = require('./pages/helpers/index')

App({

  onLaunch () {
    qcloud.setLoginUrl(config.service.loginUrl)
    this.systemInfo = systemInfo.get()
    wx.checkSession({
      success: function () {
        userInfo.requestUserInfo((err, userInfo) => { if (!err) this.userInfo = userInfo })
      },
      fail: function () {
        qcloud.Session.clear()
      }
    })
  },

  userInfo: null,
  systemInfo: null
})
