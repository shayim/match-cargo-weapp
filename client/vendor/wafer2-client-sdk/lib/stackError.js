function StackError (type, message, inner) {
  Error.call(this)
  this.type = type
  this.message = message
  this.inner = inner
}

StackError.prototype = Object.create(Error.prototype)
StackError.prototype.constructor = StackError

module.exports = StackError
