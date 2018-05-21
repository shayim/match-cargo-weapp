const userService = require('./userService')
const session = require('./session')
const {
  StackError,
  ERROR_TYPE
} = require('./stackError')
const REQUEST_CONSTANTS = {
  WX_HEADER_SKEY: 'X-WX-Skey'
}

const buildAuthHeader = function buildAuthHeader (session) {
  var header = {}
  if (session) {
    header[REQUEST_CONSTANTS.WX_HEADER_SKEY] = session
    return header
  } else {
    return null
  }
}

const wxRequest = function (url, data, header, method = 'GET', dataType = 'json', responseType = 'text') {
  return new Promise((resolve, reject) => {
    let headers = header || {}
    userService.hasValidSession().then(valid => {
      if (!valid) {
        reject(new StackError(ERROR_TYPE.REQUEST_MISSING_SESSION_KEY, 'missing skey or session outdated'))
      }
    })
    headers = Object.assign(headers, buildAuthHeader(session.get()))

    wx.request({
      url,
      data,
      header: headers,
      method,
      dataType,
      responseType,
      success: (res) => resolve(res),
      fail: err => reject(err)
    })
  })
}

const get = function (url, query, header) {
  return wxRequest(url, query, header)
}

const post = function (url, data, header) {
  return wxRequest(url, data, header, 'POST')
}

const put = function (url, data, header) {
  return wxRequest(url, data, header, 'PUT')
}

const remove = function (url, header) {
  return wxRequest(url, null, header, 'DELETE')
}

module.exports = {
  get: get,
  post: post,
  put: put,
  delete: remove
}
