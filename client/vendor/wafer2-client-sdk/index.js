var constants = require('./lib/constants')
var login = require('./lib/login')
var request = require('./lib/request')
var Tunnel = require('./lib/tunnel')

var exports = module.exports = {
  login: login.login,
  LoginError: login.LoginError,

  request: request.request,
  RequestError: request.RequestError,

  Tunnel: Tunnel

}

// 导出错误类型码
Object.keys(constants).forEach(function (key) {
  if (key.indexOf('ERR_') === 0) {
    exports[key] = constants[key]
  }
})
