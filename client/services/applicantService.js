const url = require('../config').service.host + '/applicant'
const request = require('./request')

var getAll = function () {
  return request.get(url)
}

var get = function (id) {
  return request.get(url + `/${id}`)
}

var add = function (applicant) {
  return request.post(url, applicant)
}

var update = function (applicant) {
  return request.put(url + `/${applicant.id}`, applicant)
}

var remove = function (id) {
  return request.delete(url + `/${id}`)
}

module.exports = { getAll, get, add, update, remove }
