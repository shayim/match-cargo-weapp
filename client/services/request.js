var constants = require('./constants')
var utils = require('./utils')
var loginLib = require('./login')

const REQUEST_CONSTANTS = {
  WX_HEADER_SKEY: 'X-WX-Skey'
}
const session = require('./session')
const {StackError, LOGIN_ERROR_TYPE} = require('./stackError')
const noop = function noop () {}
const buildAuthHeader = function buildAuthHeader (session) {
  var header = {}
  if (session) {
    header[REQUEST_CONSTANTS.WX_HEADER_SKEY] = session
    return session
  } else {
    return null
  }
}

function request (options) {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型'
    throw new StackError(constants.ERR_INVALID_PARAMS, message)
  }

  var requireLogin = options.login
  var success = options.success || noop
  var fail = options.fail || noop
  var complete = options.complete || noop
  var originHeader = options.header || {}

  // 成功回调
  var callSuccess = function () {
    success.apply(null, arguments)
    complete.apply(null, arguments)
  }

  // 失败回调
  var callFail = function (error) {
    fail(null, error)
    complete(null, error)
  }

  // 是否已经进行过重试
  var hasRetried = false

  if (requireLogin) {
    doRequestWithLogin()
  } else {
    doRequest()
  }

  // 登录后再请求
  function doRequestWithLogin () {
    loginLib.login({
      success: doRequest,
      fail: callFail
    })
  }

  // 实际进行请求的方法
  function doRequest () {
    var authHeader = buildAuthHeader(session.get())

    if (!authHeader) return new StackError(LOGIN_ERROR_TYPE.REQUEST_MISSING_AUTH_SKEY, '')

    wx.request(utils.extend({}, options, {
      header: utils.extend({}, originHeader, authHeader),

      success: function (response) {
        var data = response.data

        console.log('data', data)

        var error, message
        if (data && data.code === -1) {
          session.clear()
          // 如果是登录态无效，并且还没重试过，会尝试登录后刷新凭据重新请求
          if (!hasRetried) {
            hasRetried = true
            doRequestWithLogin()
            return
          }

          message = '登录态已过期'
          error = new StackError(data.error, message)

          callFail(error)
        } else {
          callSuccess.apply(null, arguments)
        }
      },

      fail: callFail,
      complete: noop
    }))
  };
};

module.exports = {
  request: request
}
