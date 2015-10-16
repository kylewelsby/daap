[![Build Status](https://travis-ci.org/kylewelsby/daap.svg)](https://travis-ci.org/kylewelsby/daap)
[![CodeClimate](https://img.shields.io/codeclimate/github/kylewelsby/dapp.svg)]
# DAAP

Encoder and Decoder for Digital Audio Access Protocol. This library can be used
to decode `application/x-dmap-tagged` requests commonly used with iTunes AirPlay.

    npm install node-daap

## Useage

```
var http = require("http");
var daap = require("daap");

http.createServer(function(req, res){
  if(req.getHeader('Content-Type') === "application/x-dmap-tagged"){
    var data = daap.decode(req.content);
    // { "minm": "Song for Someone", asar: "U2", ... }
  }
}).listen(8000)
```

## License

See [license](./LICENSE)
