// var constants = require('./constants')
// var utils = require('./utils')

var { login } = require('./login')
const userService = require('./userService')
const session = require('./session')
const { StackError, ERROR_TYPE } = require('./stackError')
const REQUEST_CONSTANTS = {
  WX_HEADER_SKEY: 'X-WX-Skey'
}

const noop = function noop () { }

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
  if (!options.url) {
    var message = '未设置网络请求链接'
    throw new StackError(ERROR_TYPE.SETTING_REQUEST_URL, message)
  }

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
  // var hasRetried = false

  userService.validateUser().then(result => {
    if (result) {
      console.log('hi')
      doRequest()
    } else {
      userService.getUserScopes().then(authSetting => {
        console.log('hi authSeeting')

        if (authSetting['scope.userInfo']) {
          requestWithAuthScope()
        } else {
          return new StackError(ERROR_TYPE.HAVENO_SCOPE_USERINFO, '用户未授权scope.userInfo')
        }
      })
    }
  })

  // 登录后再请求
  function requestWithAuthScope () {
    login({
      success: doRequest,
      fail: callFail
    })
  }

  // 实际进行请求的方法
  function doRequest () {
    var authHeader = buildAuthHeader(session.get())

    if (!authHeader) return new StackError(ERROR_TYPE.REQUEST_MISSING_AUTH_SKEY, '')

    wx.request(Object.assign({}, options, {
      header: Object.assign({}, originHeader, authHeader),

      success: function (response) {
        var data = response.data

        console.log('data', data)

        if (data && data.code === -1) {
          var error

          error = new StackError(ERROR_TYPE.REQUEST_RESPONSE_ERROR, data)

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
