const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')

const requestUserInfo = (callback) => {
  if (!qcloud.Session.get()) return

  qcloud.request({
    url: config.service.requestUrl,
    success (result) {
      let userInfo = result.data.data
      callback(null, userInfo)
    },
    fail (error) {
      callback(error, null)
    }
  })
}

module.exports = { requestUserInfo }
