'use strict'

var types = require('./content-types.json')

function getContentType (itemType) {
  return types.filter(function (item) {
    return item.code === itemType
  })[0]
}

function getULongAt (arr, offs) {
  return (arr[offs + 0] << 56) +
  (arr[offs + 1] << 48) +
  (arr[offs + 2] << 34) +
  (arr[offs + 3] << 24) +
  (arr[offs + 4] << 16) +
  (arr[offs + 5] << 8) +
  arr[offs + 6] >>> 0
}
function getUIntAt (arr, offs) {
  return (arr[offs + 0] << 24) +
  (arr[offs + 1] << 16) +
  (arr[offs + 2] << 8) +
  arr[offs + 3] >>> 0
}

function decode (buffer, fullNames) {
  var output, itemType, itemLength, contentType, data, parsedData, outputKey
  if (!fullNames) {
    fullNames = false
  }
  output = {}

  for (var i = 8; i < buffer.length;) {
    itemType = buffer.slice(i, i + 4).toString()
    outputKey = itemType.toString()
    itemLength = buffer.slice(i + 4, i + 8).readUInt32BE(0)
    contentType = getContentType(itemType)
    if (contentType) {
      parsedData = null

      if (itemLength !== 0) {
        data = buffer.slice(i + 8, i + 8 + itemLength)
        parsedData = null

        try {
          if (contentType.type === 'byte') {
            parsedData = data.readUInt8(0)
          } else if (contentType.type === 'date') {
            parsedData = data.readIntBE(0, 4)
          } else if (contentType.type === 'short') {
            parsedData = data.readUInt16BE(0)
          } else if (contentType.type === 'int') {
            parsedData = data.readUInt32BE(0)
          } else if (contentType.type === 'long') {
            parsedData = data.readIntBE(0, 8)
          } else {
            parsedData = data.toString()
          }
        } catch (e) {
          console.log('error on %s', itemType)
          console.error(e)
        }
      }
      if (fullNames) {
        outputKey = contentType.name
      }
      if (parsedData !== null) {
        output[outputKey] = parsedData
      }
    } else {
      console.error('Node-DAPP: Unexpected ContentType: %s', itemType)
    }

    i += 8 + itemLength
  }
  return output
}

function encode (field, value) {
  value = value.toString()
  var contentType = getContentType(field)
  var buf = new Buffer(field.length + value.length + 4)

  buf.write(field, 0, field.length)
  buf.writeUInt32BE(value.length, field.length)

  var valueOffset = field.length + 4
  if (contentType.type === 'byte') {
    buf.writeUInt8(value, valueOffset)
  } else if (contentType.type === 'short') {
    buf.writeUInt16BE(value, valueOffset)
  } else if (contentType.type === 'int') {
    buf.writeUInt32BE(value, valueOffset)
  } else if (contentType.type === 'long') {
    buf.writeIntBE(value, valueOffset, 8)
  } else if (contentType.type === 'date') {
    buf.writeIntBE(value, valueOffset, 4)
  } else {
    buf.write(value, valueOffset, value.length)
  }
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
  buf.write(field, 0, field.length)
  buf.writeUInt32BE(value.length, field.length)
  return Buffer.concat([buf, value])
}

module.exports.encodeList = encodeList
module.exports.encode = encode
module.exports.decode = decode
