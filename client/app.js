var { systemInfo, userService } = require('./services/index')

App({
  onLaunch () {
    this.systemInfo = systemInfo.get()

    userService.validateUser().then(result => { this.userInfo = userService.getUserInfo() })
    userService.getUserScopes().then(result => { this.userAuthScopes = result })
  },
  userAuthScopes: null,
  userInfo: null,
  systemInfo: null
})
