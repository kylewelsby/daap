var assert = require("chai").assert;
var daap = require("../index");

describe("DAAP", function(){
  "use strict";
  it("encodes and decodes string", function(){
    var name = daap.encode("minm", "Track Name");
    var artist = daap.encode("asar", "Artist");
    var daapInfo = daap.encodeList("mlit", name, artist);
    assert.equal(daap.decode(daapInfo).minm, "Track Name");
    assert.equal(daap.decode(daapInfo).asar, "Artist");
  });
});
