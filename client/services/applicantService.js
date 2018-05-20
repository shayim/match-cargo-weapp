const url = require('../config').service.host + '/applicant'
const {request} = require('./request')

var getAll = function () {
  request({
    url: url,
    success: function (res) {
      console.log(res)
    }})
}

var get = function (id) {

}

var add = function (applicant) {

}

var update = function (id, applicant) {

}

var remove = function (id) {

}

module.exports = { getAll, get, add, update, remove }
