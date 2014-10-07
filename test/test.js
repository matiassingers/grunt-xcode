'use strict';
var grunt = require('grunt');
var fs = require('fs');

exports.xcode = {
  build: function (test) {
    test.expect(2);

    test.ok(grunt.file.exists('test/export.ipa'), 'should have exported correct .ipa file');

    // floor the numbers, the last couple of bytes varies too much
    var actualSize = Math.floor(fs.statSync('test/export.ipa').size / 100);
    var expectedSize = Math.floor(fs.statSync('test/expected/export.ipa').size / 100);
    test.equal(actualSize, expectedSize, 'should be about the same filesize');

    test.done();
  }
};
