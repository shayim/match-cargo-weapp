var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var { systemInfo, userService } = require('./services/index')

App({
  onLaunch () {
    qcloud.setLoginUrl(config.service.loginUrl)

    this.systemInfo = systemInfo.get()
    userService.validateUser().then(result => { this.userInfo = userService.getUserInfo() })
  },

  userInfo: null,
  systemInfo: null
})
