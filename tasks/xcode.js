/*
 * grunt-xcode
 * https://github.com/matiassingers/grunt-xcode
 *
 * Copyright (c) 2013 Matias Singers
 * Licensed under the MIT license.
 */
'use strict';

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        formatted = formatted.replace(
            RegExp('\\{' + i + '\\}', 'g'), arguments[i]);
    }
    return formatted;
};

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
    grunt.verbose.writeln('Checking if {0} gem is installed'.format(gem));
    var child = exec('gem list {0} -i'.format(gem), function(error, stdout, stderr){
      if (error !== null) {
        grunt.verbose.error('{0} gem is not installed, prompting for install'.format(gem));
        return promptInstall();
      }

      grunt.verbose.writeln('{0} is installed, continuing task...'.format(gem));
      cb();
    });

    // Prompt the user for the installation of the gem in case it isn't installed yet
    function promptInstall(){
      if(options.gemInstall){
        grunt.verbose.writeln('options.gemInstall is true, so forcing the installation of {0}'.format(gem));
        return executeCommand('gem install {0}'.format(gem), true);
      }

      var confirmOptions = {
        type: 'confirm', 
        name: 'install', 
        message: 'The {0} gem is required for grunt-xcode to work, do you wish to install it?'.format(gem), 
        default: true
      }

      inquirer.prompt(confirmOptions, function(answers){
        if(!answers.install){
          grunt.log.error('You need to install the {0} gem for this Grunt task to work.'.format(gem));
          return cb(false);
        }

        executeCommand('gem install ' + gem);
      });
    };

    // Execute the supplied command, optionally as root
    function executeCommand(cmd, root){
      var cmd = root ? 'sudo ' + cmd : cmd;
      grunt.verbose.writeln('Executing: ' + cmd);

      exec(cmd, function(error, stdout, stderr){
        if(error !== null){
          grunt.log.errorlns('The following error occured: ' + stderr);
          return cb(false);
        } else if(stderr.indexOf('have write permissions') !== -1){
          grunt.log.errorlns('It seems that you don\'t have write permissions for this directory. Please type your root password below:');
          return executeCommand(cmd, true);
        }
        
        grunt.verbose.writeln(stdout);
        cb();
      });
    };

  });
};
