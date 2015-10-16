[![Dependency Status](https://david-dm.org/kylewelsby/daap.svg)](https://david-dm.org/kylewelsby/daap)
[![Build Status](https://travis-ci.org/kylewelsby/daap.svg)](https://travis-ci.org/kylewelsby/daap)
[![CodeClimate](https://img.shields.io/codeclimate/github/kylewelsby/dapp.svg)](https://codeclimate.com/github/kylewelsby/daap)

# DAAP

Encoder and Decoder for Digital Audio Access Protocol. This library can be used
to decode `application/x-dmap-tagged` requests commonly used with iTunes AirPlay.

    npm install node-daap

## Useage

```
// Decode
var http = require("http");
var daap = require("node-daap");

http.createServer(function(req, res){
  if(req.getHeader('Content-Type') === "application/x-dmap-tagged"){
    var data = daap.decode(req.content);
    // { "minm": "Song for Someone", asar: "U2", ... }
  }
}).listen(8000)
```

```
// Encode
var daap = require("node-daap");
var name = daap.encode("minm", "Track Name");
var artist = daap.encode("asar", "Artist");
var daapInfo = daap.encodeList("mlit", name, artist);


var content = `SET_PARAMETER * RTSP/1.0
CSeq:2
User-Agent: AirPlay/190.9
Content-Type: application/x-dmap-tagged
Content-Length: ${daapInfo.length}

${daapInfo}`;

/**
SET_PARAMETER * RTSP/1.0
CSeq:2
User-Agent: AirPlay/190.9
Content-Type: application/x-dmap-tagged
Content-Length: 40

mlit minm
Track NameasarArtist
*/
```

## License

See [license](./LICENSE)
