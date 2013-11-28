/*
 * grunt-xcode
 * https://github.com/matiassingers/grunt-xcode
 *
 * Copyright (c) 2013 Matias Singers
 * Licensed under the MIT license.
 */
'use strict';

var inquirer = require('inquirer'),
    exec = require('child_process').exec;

module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('xcode', 'Compile and build Xcode project with Grunt', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var cb = this.async(),
        gem = 'shenzhen',
        options = this.options({
          gemInstall: false
        });

    // Check if required gem is installed
    grunt.verbose.writeln('Checking if ' + gem + ' gem is installed');
    var child = exec('gem list ' + gem + ' -i', function(error, stdout, stderr){
      if (error == null) {
        grunt.verbose.error(gem + ' gem is not installed, prompting for install');
        return promptInstall();
      }
      grunt.verbose.writeln(gem + ' is installed, continuing task...');
      cb();
    });

    // Prompt the user for the installation of the gem in case it isn't installed yet
    function promptInstall(){
      if(options.gemInstall){
        grunt.verbose.writeln('options.gemInstall is true, so forcing the installation of ' + gem);
        return executeCommand('gem install ' + gem, true);
      }

      var confirmOptions = {
        type: 'confirm', 
        name: 'install', 
        message: 'The ' + gem + ' gem is required for grunt-xcode to work, do you wish to install it?', 
        default: true
      }

      inquirer.prompt(confirmOptions, function(answers){
        if(answers.install){
          return executeCommand('gem install ' + gem);
        }

        grunt.log.error('You need to install the ' + gem + ' gem for this Grunt task to work.');
        cb(false);
      });
    };

    // Execute the supplied command, optionally as root
    function executeCommand(cmd, root){
      var cmd = root ? 'sudo ' + cmd : cmd;
      grunt.verbose.writeln('Executing: ' + cmd);

      exec(cmd, function(error, stdout, stderr){
        if(error === null){
          grunt.verbose.writeln(stdout);
          return cb();
        } else if(stderr.indexOf('have write permissions') !== -1){
          grunt.log.errorlns('It seems that you don\'t have write permissions for this directory. Please type your root password below:');
          return executeCommand(cmd, true);
        }

        grunt.log.errorlns('The following error occured: ' + stderr);
        cb(false);
      });
    };

  });
};
