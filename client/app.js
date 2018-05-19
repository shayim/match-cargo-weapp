var { systemInfo, userService } = require('./services/index')

App({
  onLaunch (params) {
    console.log(params.scene)

    this.systemInfo = systemInfo.get()

    userService.validateUser().then(result => { this.userInfo = userService.getUserInfo() })
    userService.getUserScopes().then(result => { this.userAuthScopes = result })
  },
  onShow (params) {

  },

  userAuthScopes: null,
  userInfo: null,
  systemInfo: null
})
