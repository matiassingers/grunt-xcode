/*
 * grunt-xcode
 * https://github.com/matiassingers/grunt-xcode
 *
 * Copyright (c) 2014 Matias Singers
 * Licensed under the MIT license.
 */
'use strict';

var Promise = require('bluebird');
var exec = Promise.promisify(require('child_process').exec);
var temporary = require('temporary');

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        formatted = formatted.replace(
            RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
    }
    return formatted;
};

module.exports = function(grunt) {
  function executeCommand(command){
    grunt.verbose.writeln('Running command: {0}'.format(command));
    return exec(command)
      .catch(handleCommandError);
  }
  function handleCommandError(error){
    if (error){
      grunt.warn(error);
    }
  }

  grunt.registerMultiTask('xcode', 'Build and export Xcode projects with Grunt', function() {
    var done = this.async();

    var options = this.options({
      clean: true,
      export: true,
      project: '',
      scheme: '',
      archivePath: '',
      exportPath: process.cwd(),
      exportFilename: 'export.ipa'
    });

    if(!options.project){
      throw new Error('`options.project` is required');
    }

    if(!options.archivePath){
      var temporaryDirectory = new temporary.Dir();
      options.archivePath = temporaryDirectory.path;
    }

    function runCleanCommand(){
      if(!options.clean){
        return Promise.resolve();
      }

      var command = 'xcodebuild clean -project "{0}"'.format(options.project);
      return executeCommand(command)
        .then(function(){
          grunt.verbose.ok('`xcodebuild clean` was successful');
        });
    }
  });
};
