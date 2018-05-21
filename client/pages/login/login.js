var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var {
  // modal, openDataLogin
  session
} = require('../../services/index')

var loginService = require('../../services/loginService')
var app = getApp()

Page({
  data: {
    wxLogin: false,
    lang: app.systemInfo && app.systemInfo.language ? app.systemInfo.language : 'zh_CN'
  },

  /**
     * wx login
     * param e { type:"getuserinfo",
     *           detail: { encryptoData, iv, signature, rawData
     *                     userInfo: { nickName, gender, language, city, province, country, avatarUrl }}
     */

  login (e) {
    console.log(e)

    var that = this
    that.setData({
      wxLogin: true
    })
    loginService.openDataLogin(e.detail)
      .then(userinfo => {
        console.log(userinfo)
        that.setData({ wxLogin: false, userInfo: userinfo })
      }).catch(err => {
        console.log(err)
        that.setData({ wxLogin: false })
      })
  },

  doRequest () {
    if (!session.get()) return

    var that = this
    that.setData({ wxLogin: true })
    qcloud.request({
      url: config.service.requestUrl,
      success (result) {
        app.userInfo = result.data.data
        that.setData({
          userInfo: result.data.data,
          wxLogin: false
        })
      },
      fail (error) {
        console.log(error)
        that.setData({ wxLogin: false })
      }
    })
  },

  onLoad: function (options) {
    this.doRequest()
  }

})
