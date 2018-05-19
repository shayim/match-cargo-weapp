function StackError (type, message, inner) {
  Error.call(this)
  this.type = type
  this.message = message
  this.inner = inner
}

StackError.prototype = Object.create(Error.prototype)
StackError.prototype.constructor = StackError

module.exports = {
  StackError,

  LOGIN_ERROR_TYPE: {

    WX_LOGIN_CODE_ERROR: 'WX_LOGIN_CODE_ERROR',
    WX_GET_USER_INFO_ERROR: 'WX_GET_USER_INFO_ERROR',

    LOGIN_URL_NOT_FOUND: 'LOGIN_URL_NOT_FOUND',
    LOGIN_SKEY_USERINFO_NOT_RECEIVED: 'LOGIN_SKEY_USERINFO_NOT_RECEIVED',

    REQUEST_MISSING_AUTH_SKEY: 499,

    ERR_LOGIN_TIMEOUT: 'ERR_LOGIN_TIMEOUT',
    ERR_LOGIN_FAILED: 'ERR_LOGIN_FAILED',
    ERR_LOGIN_SESSION_NOT_RECEIVED: 'ERR_LOGIN_MISSING_SESSION',

    ERR_SESSION_INVALID: 'ERR_SESSION_INVALID',
    ERR_CHECK_LOGIN_FAILED: 'ERR_CHECK_LOGIN_FAILED'
  }
}
