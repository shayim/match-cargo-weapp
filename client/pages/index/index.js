const {userService} = require('../../services/index')

Page({
  data: {

  },

  addApplicant () {

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
