const app = getApp()

Page({
  data: {

  },

  addApplicant () {
    if (this.checkUserInfo()) {
      console.log(app.userInfo)
    }
  },

  addInsured () {
    if (this.checkUserInfo()) {

    }
  },

  addCargo () {
    if (this.checkUserInfo()) {

    }
  },

  addConveyance () {
    if (this.checkUserInfo()) {

    }
  },

  addVoyage () {
    if (this.checkUserInfo()) {

    }
  },

  checkUserInfo () {
    if (!app.userInfo) {
      wx.navigateTo({ url: '../login/login' })
      return false
    }
    return true
  },

  onLoad () {}
})
