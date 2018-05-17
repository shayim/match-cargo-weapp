const session = require('./session')
const userInfoStoreKey = 'WX_USERINFO'

const validateUser = function () {
  return new Promise(function (resolve, reject) {
    if (!session.get()) return resolve(false)

    wx.checkSession({
      success: function () {
        return resolve(true)
      },
      fail: function () {
        session.clear()
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

const getUserScopes = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        resolve(res.authSetting)
      }
    })
  })
}

module.exports = { validateUser, getUserInfo, saveUserInfo, getUserScopes }
