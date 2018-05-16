const {userService} = require('../../services/index')
const app = getApp()
Page({
  data: {

  },

  addApplicant () {
    console.log(app.userAuthScopes)
  },

  addInsured () {

  },

  addCargo () {

  },

  addConveyance () {

  },

  addVoyage () {

  },

  onLoad () {
    userService.validateUser().then(result => {
      if (!result) {
        wx.navigateTo({url: '../login/login'})
      }
    })
  }
})
