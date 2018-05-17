var config = require('../config')
var SESSION_KEY = 'weapp_session_' + config.WX_SESSION_MAGIC_ID

var session = {
  get: function () {
    return wx.getStorageSync(SESSION_KEY) || null
  },

  set: function (session) {
    wx.setStorageSync(SESSION_KEY, session)
  },

  clear: function () {
    wx.removeStorageSync(SESSION_KEY)
  }
}

module.exports = session
