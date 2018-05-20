var loginUrl = require('../config').service.loginUrl
var session = require('./session')
const userService = require('./userService')
var { LOGIN_CONTANTS } = require('./openDataLogin')
var { StackError, ERROR_TYPE } = require('./stackError')

var app = getApp()

var getWxLoginResult = function getLoginCode (callback) {
  wx.login({
    success: function (codeResult) {
      wx.getUserInfo({
        lang: app.systemInfo.language,
        success: function (userResult) {
          callback(null, {
            code: codeResult.code,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
            userInfo: userResult.userInfo
          })
        },

        fail: function (userError) {
          var error = new StackError(ERROR_TYPE.WX_GET_USER_INFO, '获取微信用户信息失败', userError)
          callback(error, null)
        }
      })
    },

    fail: function (codeError) {
      var error = new StackError(ERROR_TYPE.WX_LOGIN_CODE, '获取微信临时登录凭证失败', codeError)
      callback(error, null)
    }
  })
}

var noop = function noop () { }
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  url: loginUrl
}

var login = function login (options) {
  options = Object.assign({}, defaultOptions, options)

  if (!options.url) {
    options.fail(new StackError(ERROR_TYPE.SETTING_LOGIN_URL, '未设置登录地址'))
    return
  }

  var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError)
      return
    }

    console.log(wxLoginResult)

    var userInfo = wxLoginResult.userInfo

    var { code, encryptedData, iv } = wxLoginResult

    if ([code, encryptedData, iv].some(v => !v)) {
      options.fail(new StackError(ERROR_TYPE.WX_GET_USER_INFO, '缺失登陆凭证或加密数据'))
      return
    }

    var header = {
      [LOGIN_CONTANTS.WX_HEADER_CODE]: code,
      [LOGIN_CONTANTS.WX_HEADER_ENCRYPTED_DATA]: encryptedData,
      [LOGIN_CONTANTS.WX_HEADER_IV]: iv

    }

    wx.request({
      url: options.loginUrl,
      header: header,
      method: options.method,
      data: options.data,
      success: function (result) {
        // result: {
        //     data: {
        //         code: 0,
        //             data: { skey, userInfo }
        //     },
        //     header: { },
        //     statusCode: 200,
        //         errMsg: "request:ok"
        // }

        let { data: {code, data: { skey, userinfo }}, status, errMsg } = result

        // 成功地响应会话信息
        if (code === 0 && skey && userinfo) {
          userService.saveUserInfo(userinfo)
          session.set(skey)
          options.success(userInfo)
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

module.exports = {
  login: login
}
