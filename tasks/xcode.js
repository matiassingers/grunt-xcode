/*
 * grunt-xcode
 * https://github.com/matiassingers/grunt-xcode
 *
 * Copyright (c) 2014 Matias Singers
 * Licensed under the MIT license.
 */
'use strict';

var Promise = require('bluebird');
var which = require('which');
var temporary = require('temporary');
var chalk = require('chalk');
var exec = require('child_process').exec;

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
  function executeCommand(args, silent){
    var command = 'xcodebuild ' + args.join(' ');
    grunt.verbose.writeln('Command:', chalk.yellow(command));

    return new Promise(function(resolve, reject){
      // poor man's progress indicator
      if(!silent){
        var progress = setInterval(function(){
          grunt.log.write(chalk.green('.'));
        }, 1000);
      }

      // See Sindre Sorhus' grunt-shell - https://github.com/sindresorhus/grunt-shell/blob/master/tasks/shell.js
      var cmd = exec(command, {maxBuffer: 1000*1024}, function(error){
        clearInterval(progress);
        grunt.log.write(' \n');

        if(error) {
          grunt.warn(error);

          reject(error);
        }

        resolve();
      });

      var captureOutput = function (child, output) {
        if (grunt.option('color') === false) {
          child.on('data', function (data) {
            output.write(chalk.stripColor(data));
          });
        } else {
          child.pipe(output);
        }
      };

      if (grunt.option('verbose')) {
        captureOutput(cmd.stdout, process.stdout);
      }

      if (grunt.option('verbose')) {
        captureOutput(cmd.stderr, process.stderr);
      }
    });
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

    which('xcodebuild', function(err, path){
      if(err || !path){
        throw new Error('`xcodebuild` command is required for grunt-xcode to work, please install Xcode Tools from developer.apple.com');
      }
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

      var command = ['clean'];
      if(options.project) command.push('-project', safelyWrap(options.project));

      return executeCommand(command, true)
        .then(function(){
          grunt.verbose.ok('`xcodebuild clean` was successful');
        });
    }
    function runArchiveCommand(){
      if(!options.export) {
        return Promise.resolve();
      }

      var command = ['archive'];
      command.push('-archivePath', safelyWrap(options.archivePath));

      if(options.project) command.push('-project', safelyWrap(options.project));
      if(options.configuration) command.push('-configuration', safelyWrap(options.configuration));
      if(options.workspace) command.push('-workspace', safelyWrap(options.workspace));
      if(options.scheme) command.push('-scheme', safelyWrap(options.scheme));

      if(options.arch) command.push('-arch', safelyWrap(options.arch));
      if(options.sdk) command.push('-sdk', safelyWrap(options.sdk));

      if(!options.exportSigningIdentity) command.push('CODE_SIGN_IDENTITY=""', 'CODE_SIGN_ENTITLEMENTS=""', 'CODE_SIGNING_REQUIRED=NO');

      if(options.target){
        command.push('-target', safelyWrap(options.target));
      } else if(options.allTargets && !options.scheme) {
        command.push('-alltargets');
      }

      grunt.log.write('Archiving: ');
      return executeCommand(command)
        .then(function(){
          grunt.verbose.ok('`xcodebuild archive` was successful');
        });
    }
    function runExportCommand(){
      if(!options.export) {
        return Promise.resolve();
      }

      var command = ['-exportArchive'];
      command.push('-archivePath "{0}.xcarchive"'.format(options.archivePath));
      command.push('-exportPath "{0}/{1}"'.format(options.exportPath, options.exportFilename));

      command.push('-exportFormat', options.exportFormat);

      if(options.exportProvisioningProfile) command.push('-exportProvisioningProfile', safelyWrap(options.exportProvisioningProfile));
      if(options.exportSigningIdentity) command.push('-exportSigningIdentity', safelyWrap(options.exportSigningIdentity));
      if(options.exportInstallerIdentity) command.push('-exportInstallerIdentity', safelyWrap(options.exportInstallerIdentity));
      if(!options.exportSigningIdentity) command.push('-exportWithOriginalSigningIdentity');

      grunt.log.write('Exporting: ');
      return executeCommand(command)
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
