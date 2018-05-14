var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var {
  modal
} = require('../helpers/index');

Page({
  data: {
    wxLogin: false
  },

  doLogin(e) {
    var that = this;
    that.setData({
      wxLogin: true
    });
    qcloud.login({
      userInfo: e.detail.userInfo, // from client

      success(result) {
        that.setData({
          userInfo: result,
          wxLogin: false
        });
      },

      fail(error) {
        modal.showModal('登录失败', error);
        that.setData({wxLogin: false});
      }
    });
  },

  doRequest() {
    if(!qcloud.Session.get()) return;
    
    var that = this;
    that.setData({wxLogin:true});
    qcloud.request({
      url: config.service.requestUrl,
      success(result) {
        that.setData({
          userInfo: result.data.data, wxLogin:false
        })
      },
      fail(error) {
        that.setData({wxLogin:false});
      }
    });
  },

  onLoad: function (options) {
    this.doRequest();
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