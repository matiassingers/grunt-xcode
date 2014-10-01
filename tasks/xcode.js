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
var chalk = require('chalk');

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        formatted = formatted.replace(
            RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
    }
    return formatted;
};

function safelyWrap(string){
  return JSON.stringify(string);
}

module.exports = function(grunt) {
  function executeCommand(command){
    grunt.verbose.writeln('Running command: {0}'.format(command));
    return exec(command, {maxBuffer: 1000*1024})
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
      configuration: '',
      workspace: '',
      scheme: '',
      allTargets: true,
      target: '',
      archivePath: '',
      exportFormat: 'IPA',
      exportPath: process.cwd(),
      exportFilename: 'export.ipa',
      exportProvisioningProfile: '',
      exportSigningIdentity: '',
      exportInstallerIdentity: '',
      arch: '',
      sdk: ''
    });

    if(!options.project && !options.workspace){
      throw new Error('`options.project` or `options.workspace` is required');
    }

    if(options.workspace && !options.scheme){
      throw new Error('`options.scheme` is required when building a workspace');
    }

    if(!options.archivePath){
      var temporaryDirectory = new temporary.Dir();
      options.archivePath = temporaryDirectory.path;
    }

    runCleanCommand()
      .then(runArchiveCommand)
      .then(runExportCommand)
      .finally(cleanUp);

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
    function runArchiveCommand(){
      if(!options.export) {
        return Promise.resolve();
      }

      var command = ['xcodebuild archive'];
      command.push('-archivePath', safelyWrap(options.archivePath));

      if(options.project) command.push('-project', safelyWrap(options.project));
      if(options.configuration) command.push('-configuration', safelyWrap(options.configuration));
      if(options.workspace) command.push('-workspace', safelyWrap(options.workspace));
      if(options.scheme) command.push('-scheme', safelyWrap(options.scheme));

      if(options.arch) command.push('-arch', safelyWrap(options.arch));
      if(options.sdk) command.push('-sdk', safelyWrap(options.sdk));

      if(options.target){
        command.push('-target', safelyWrap(options.target));
      } else if(options.allTargets && !options.scheme) {
        command.push('-alltargets');
      }

      return executeCommand(command.join(' '))
        .then(function(){
          grunt.verbose.ok('`xcodebuild archive` was successful');
        });
    }
    function runExportCommand(){
      if(!options.export) {
        return Promise.resolve();
      }

      var command = ['xcodebuild'];
      command.push('-exportArchive');
      command.push('-archivePath "{0}.xcarchive"'.format(options.archivePath));
      command.push('-exportPath "{0}/{1}"'.format(options.exportPath, options.exportFilename));

      command.push('-exportFormat', options.exportFormat);

      if(options.exportProvisioningProfile) command.push('-exportProvisioningProfile', safelyWrap(options.exportProvisioningProfile));
      if(options.exportSigningIdentity) command.push('-exportSigningIdentity', safelyWrap(options.exportSigningIdentity));
      if(options.exportInstallerIdentity) command.push('-exportInstallerIdentity', safelyWrap(options.exportInstallerIdentity));
      if(!options.exportSigningIdentity) command.push('-exportWithOriginalSigningIdentity');

      executeCommand(command.join(' '))
        .then(function(){
          grunt.verbose.ok('`xcodebuild export` was successful');
        });
    }
    function cleanUp(){
      if(temporaryDirectory){
        temporaryDirectory.rmdir();
      }

      if(options.export){
        grunt.log.ok('Built and exported product to: {0}/{1}'.format(options.exportPath, options.exportFilename));
      }

      done();
    }
  });
};
