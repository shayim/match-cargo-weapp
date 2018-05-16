const qcloud = require('../vendor/wafer2-client-sdk/index')
const userInfoStoreKey = 'WX_USERINFO'

const validateUser = function () {
  return new Promise(function (resolve, reject) {
    if (!qcloud.Session.get()) return resolve(false)

    wx.checkSession({
      success: function () {
        return resolve(true)
      },
      fail: function () {
        qcloud.Session.clear()
        return resolve(false)
      }

    })
  })
}
const getUserInfo = () => {
  if (!validateUser()) return null

  try {
    var userInfo = wx.getStorageSync(userInfoStoreKey)
    if (userInfo) {
      return userInfo
    } else {
      return null
    }
  } catch (e) {
    console.log('getUserInfoStore failed', e)
  }
}

const saveUserInfo = (userInfo) => {
  try {
    console.log('saving userInfo', userInfo)
    wx.setStorageSync(userInfoStoreKey, userInfo)
    return true
  } catch (e) {
    console.log('saveUserInfoStore failed', e)
    return false
  }
}

module.exports = { validateUser, getUserInfo, saveUserInfo }
