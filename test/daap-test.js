var assert = require('chai').assert
var daap = require('../index')

describe('DAAP', function () {
  'use strict'
  it('encodes and decodes string', function () {
    var data = {
      asal: 'Thriller',
      asar: 'Michael Jackson',
      asbr: '192', // bitrate
      asbt: '140', // BPM
      ascm: 'Most popular Michael Jackson song of all time',
      asco: true,
      ascp: 'Michael Jackson, Quincy Jones',
      asda: '1445428778', // added date
      asdb: false,
      asdc: '01',
      asdn: '01',
      asgn: 'R&B',
      assr: '44100',
      astc: '07',
      astm: '294000',
      astn: '02',
      asul: 'https://en.wikipedia.org/wiki/Billie_Jean',
      asyr: '1983',
      minm: 'Billie Jean'
    }
    var encodedList = []
    Object.keys(data).forEach(function (key) {
      encodedList.push(daap.encode(key, data[key]))
    })

    var daapInfo = daap.encodeList('mlit', encodedList)
    var decodedInfo = daap.decode(daapInfo)
    Object.keys(data).forEach(function (key, index) {
      assert.equal(decodedInfo[key], data[key], 'decoded value ' + key)
    })
  })
})
