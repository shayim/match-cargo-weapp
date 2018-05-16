var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var { modal, userService } = require('../../services/index')
var app = getApp()

Page({
  data: {
    wxLogin: false,
    lang: app.systemInfo.language
  },

  /**
     * wx login
     * param e { type:"getuserinfo",
     *           detail: { encryptoData, iv, signature, rawData
     *                     userInfo: { nickName, gender, language, city, province, country, avatarUrl }}
     */
  doLogin (e) {
    var that = this
    that.setData({
      wxLogin: true
    })
    qcloud.openDataLogin({
      userInfoData: e.detail,
      success (result) {
        userService.saveUserInfo(result)

        that.setData({
          userInfo: result,
          wxLogin: false
        })
      },
      fail (error) {
        modal.showModal('登录失败', error.message)
        that.setData({ wxLogin: false })
      }
    })
  },

  doRequest () {
    if (!qcloud.Session.get()) return

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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
