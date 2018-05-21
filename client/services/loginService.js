const loginUrl = require('../config').service.loginUrl
const session = require('./session')
const userService = require('./userService')
const { StackError, ERROR_TYPE } = require('./stackError')

const LOGIN_CONTANTS = {
  WX_HEADER_CODE: 'X-WX-Code',
  WX_HEADER_ENCRYPTED_DATA: 'X-WX-Encrypted-Data',
  WX_HEADER_IV: 'X-WX-IV',
  WX_HEADER_ID: 'X-WX-Id'

}

const getWxCode = function () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (code) {
        resolve(code)
      },
      fail: function (err) {
        var error = new StackError(ERROR_TYPE.WX_LOGIN_CODE, '微信登录临时凭据错误', err)
        reject(error)
      }
    })
  })
}

const openDataLogin = function (userInfoData) {
  return new Promise((resolve, reject) => {
    if (!loginUrl) {
      reject(new StackError(ERROR_TYPE.SETTING_LOGIN_URL, '未设置登录地址'))
    }
    getWxCode().then(res => {
      let header = {
        [LOGIN_CONTANTS.WX_HEADER_CODE]: res.code,
        [LOGIN_CONTANTS.WX_HEADER_ENCRYPTED_DATA]: userInfoData.encryptedData,
        [LOGIN_CONTANTS.WX_HEADER_IV]: userInfoData.iv
      }
      wx.request({
        url: loginUrl,
        header: header,
        method: 'GET',
        success: function (result) {
          // result: {
          //   data: {
          //     code: 0,
          //       data: { skey, userInfo }
          //   },
          //   header: { },
          //   statusCode: 200,
          //     errMsg: "request:ok"
          // }

          if (result.data.code !== 0) {
            console.log('login result', result)
            reject(new StackError(ERROR_TYPE.LOGIN_RESPONSE_ERROR, JSON.stringify(result)))
          }

          var { data: { data: { skey, userinfo } } } = result

          // success route
          if (skey && userinfo) {
            session.set(skey)
            userService.saveUserInfo(userinfo)
            resolve(userinfo)
          } else {
            reject(new StackError(ERROR_TYPE.LOGIN_RESPONSE_ERROR_ERROR, JSON.stringify(result)))
          }
        },

        // 响应错误
        fail: function (error) {
          reject(new StackError(ERROR_TYPE.LOGIN_FAILED, '登录失败，服务器错误', error))
        }
      })
    })
  })
}
module.exports = { openDataLogin, LOGIN_CONTANTS }
