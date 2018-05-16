var constants = require('./constants')
var session = require('./session')
var StackError = require('./stackError')

var noop = function noop () { }
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  loginUrl: null
}

var getCodeResult = function getCode (callback) {
  wx.login({
    success: function (codeResult) {
      callback(null, codeResult.code)
    },
    fail: function (codeError) {
      var error = new StackError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败', codeError)
      callback(error, null)
    }
  })
}

var openDataLogin = function openDataLogin (options) {
  options = Object.assign({}, defaultOptions, options)

  console.log('openDataLogin', options.userInfoData)

  if (!options.loginUrl) {
    options.fail(new StackError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'))
    return
  }

  var doLogin = () => getCodeResult(function (error, code) {
    if (error) {
      options.fail(error)
      return
    }

    console.log('code', code)
    var userInfo = options.userInfoData.userInfo
    console.log('userInfo', userInfo)

    // 构造请求头，包含 code、encryptedData 和 iv
    var header = {
      [constants.WX_HEADER_CODE]: code,
      [constants.WX_HEADER_ENCRYPTED_DATA]: options.userInfoData.encryptedData,
      [constants.WX_HEADER_IV]: options.userInfoData.iv
    }

    // console.log(header)

    // 请求服务器登录地址，获得会话信息
    wx.request({
      url: options.loginUrl,
      header: header,
      method: options.method,
      data: options.data,
      success: function (result) {
        /*
                              result : {
                                  data: {
                                      code: 0,
                                      data: {skey, userInfo }
                                  },
                                  header: {},
                                  statusCode: 200,
                                  errMsg: "request:ok"
                              }
                          */

        var data = result.data

        console.log('login data', data)

        // 成功地响应会话信息
        if (data && data.code === 0 && data.data.skey) {
          var res = data.data
          if (res.userinfo) {
            session.set(res.skey)
            options.success(res.userinfo)
          } else {
            var errorMessage = `登录失败(code:1, data.error:${data.error} ,data.message:${data.message ? data.message : '未知错误'})`

            var unKnownError = new StackError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, errorMessage)
            options.fail(unKnownError)
          }

          // 没有正确响应会话信息
        } else {
          var noSessionError = new Error(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data))
          options.fail(noSessionError)
        }
      },

      // 响应错误
      fail: function (loginResponseError) {
        var error = new StackError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常', loginResponseError)
        options.fail(error)
      }
    })
  })

  doLogin()
}

var setLoginUrl = function (loginUrl) {
  defaultOptions.loginUrl = loginUrl
}

module.exports = { openDataLogin, setLoginUrl }
