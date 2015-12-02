'use strict'

var types = require('./content-types.json')

function getContentType (itemType) {
  return types.filter(function (item) {
    return item.code === itemType
  })[0]
}

function decode (buffer) {
  var output, itemType, itemLength
  output = {}

  for (var i = 8; i < buffer.length;) {
    itemType = buffer.slice(i, i + 4).toString()
    itemLength = buffer.slice(i + 4, i + 8).readUInt32BE(0)
    var contentType = getContentType(itemType)
    if (itemLength !== 0) {
      var data = buffer.slice(i + 8, i + 8 + itemLength)
      if (contentType.type === 'byte') {
        output[itemType] = data.toString() === 'true'
      } else {
        output[itemType] = data.toString()
      }
    } else {
      if (contentType.type === 'byte') {
        output[itemType] = false
      }
    }

    i += 8 + itemLength
  }
  return output
}

function encode (field, value) {
  value = value.toString()
  var buf = new Buffer(field.length + value.length + 4)
  buf.write(field, 0, field.length, 'ascii')
  buf.writeUInt32BE(value.length, field.length)
  buf.write(value, field.length + 4, value.length, 'ascii')
  return buf
}

function encodeList (field) {
  var values = Array.prototype.slice.call(arguments)
  values.shift()
  if (values[0] instanceof Array) {
    values = values[0]
  }
  var value = Buffer.concat(values)
  var buf = new Buffer(field.length + 4)
  buf.write(field, 0, field.length, 'ascii')
  buf.writeUInt32BE(value.length, field.length)
  return Buffer.concat([buf, value])
}

module.exports.encodeList = encodeList
module.exports.encode = encode
module.exports.decode = decode
