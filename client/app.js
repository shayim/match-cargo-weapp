var { systemInfo, userService } = require('./services/index')

App({
  onLaunch (params) {
    console.log(params.scene)

    this.systemInfo = systemInfo.get()

    userService.hasValidSession().then(result => {
      this.userInfo = userService.getUserInfo()
    })
  },
  onShow (params) {

  },

  userInfo: null,
  systemInfo: null
})
