const config = require('../config').service
const session = require('./session')
const userService = require('./userService')
const { StackError, ERROR_TYPE } = require('./stackError')

const noop = function noop () { }
const defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  url: config.loginUrl
}

const LOGIN_CONTANTS = {
  WX_HEADER_CODE: 'X-WX-Code',
  WX_HEADER_ENCRYPTED_DATA: 'X-WX-Encrypted-Data',
  WX_HEADER_IV: 'X-WX-IV',
  WX_HEADER_ID: 'X-WX-Id'

}

var getCodeResult = function getCode (callback) {
  wx.login({
    success: function (codeResult) {
      callback(null, codeResult.code)
    },
    fail: function (codeError) {
      var error = new StackError(ERROR_TYPE.WX_LOGIN_CODE, '微信登录临时凭据错误', codeError)
      callback(error, null)
    }
  })
}

var openDataLogin = function openDataLogin (options) {
  options = Object.assign({}, defaultOptions, options)

  if (!options.url) {
    options.fail(new StackError(ERROR_TYPE.SETTING_LOGIN_URL, '未设置登录地址, 请在Config中设置'))
    return
  }

  var doLogin = () => getCodeResult(function (error, code) {
    if (error) {
      options.fail(error)
      return
    }

    // code from wx.login , userInfoData from opendata type button
    console.log('code', code)
    console.log('userInfoData', options.userInfoData)

    var header = {
      [LOGIN_CONTANTS.WX_HEADER_CODE]: code,
      [LOGIN_CONTANTS.WX_HEADER_ENCRYPTED_DATA]: options.userInfoData.encryptedData,
      [LOGIN_CONTANTS.WX_HEADER_IV]: options.userInfoData.iv
    }

    // console.log(header)

    wx.request({
      url: options.url,
      header: header,
      method: options.method,
      data: options.data,
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

        console.log('login result', result)

        var { data: {code, data: { skey, userinfo }}, status, errMsg } = result

        // success route
        if (code === 0 && skey && userinfo) {
          session.set(skey)
          userService.saveUserInfo(userinfo)
          options.success(userinfo)
        } else {
          var errorMessage = `登录失败(code:${code}, skey:${skey}, userInfo:${userinfo}, status:${status}, errMsg:${errMsg}`
          var loginError = new StackError(ERROR_TYPE.LOGIN_SKEY_USERINFO_NOT_RECEIVED, errorMessage)
          options.fail(loginError)
        }
      },

      // 响应错误
      fail: function (loginServerError) {
        var error = new StackError(ERROR_TYPE.LOGIN_FAILED, '登录失败，服务器错误', loginServerError)
        options.fail(error)
      }
    })
  })

  doLogin()
}

module.exports = { openDataLogin, LOGIN_CONTANTS }
