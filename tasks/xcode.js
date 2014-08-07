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

var q = require('q'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.registerMultiTask('xcode', 'Compile and build Xcode project with Grunt', function() {
    var done = this.async(),
        deferred = q.defer(),
        gem = 'shenzhen',
        options = this.options({
          gemInstall: false,
          workspace: '',
          project: '',
          configuration: '',
          scheme: '',
          clean: true,
          archive: true,
          destination: '',
          provision: '',
          embed: '',
          identity: '',
          sdk: ''
        });

    function buildCommand(){
      var cmd = 'ipa build';

      if(options.workspace) cmd += ' --workspace {0}'.format(options.workspace);
      if(options.project) cmd += ' --project {0}'.format(options.project);
      if(options.configuration) cmd += ' --configuration {0}'.format(options.configuration);
      if(options.scheme) cmd += ' --scheme {0}'.format(options.scheme);
      if(!options.clean) cmd += ' --no-clean';
      if(!options.archive) cmd += ' --no-archive';
      if(options.destination) cmd += ' --destination {0}'.format(options.destination);
      if(options.provision) cmd += ' --provision {0}'.format(options.provision);
      if(options.embed) cmd += ' --embed {0}'.format(options.embed);
      if(options.identity) cmd += ' --identity {0}'.format(options.identity);
      if(options.sdk) cmd += ' --sdk {0}'.format(options.sdk);

      return cmd;
    }

    function init(){
      gemCheck();

      return deferred.promise;
    }

    function onInitComplete(message){
      if(message){
        grunt.verbose.writeln(message);
      }

      var cmd = buildCommand();
      grunt.verbose.writeln('Executing the build command: {0}'.format(cmd));
      exec(cmd, function(error, stdout, stderr){
        if(error){
          grunt.log.errorlns(error);
          done(false);
        }

        if(stderr){
          grunt.log.errorlns(stderr);
          done(false);
        }

        if(stdout.indexOf('successfully built') !== -1){
          grunt.verbose.writeln(stdout);
          grunt.verbose.writeln('The build succeeded and the file was saved');
          done();
        }
      });
    }

    function onInitError(message, severity){
      // Takes 'warn' and 'fatal'
      if(severity){
        grunt.fail[severity](message);
      } else if(message){
        grunt.log.errorlns(message);
      }
      done(false);
    }

    // TODO: don't pass the same promise around
    init().then(onInitComplete, onInitError);

    // Check if required gem is installed
    function gemCheck(){
      grunt.verbose.writeln('Checking if {0} gem is installed'.format(gem));
      exec('gem list {0} -i'.format(gem), function(error, stdout, stderr){
        if (error !== null) {
          grunt.verbose.error('{0} gem is not installed, prompting for install'.format(gem));
          return promptInstall();
        }

        grunt.verbose.writeln('{0} is installed, continuing task...'.format(gem));
        // Go to the next step here ...
        deferred.resolve();
      });
    }

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
      };

      inquirer.prompt(confirmOptions, function(answers){
        if(!answers.install){
          return deferred.reject('You need to install the {0} gem for this Grunt task to work.'.format(gem), 'fatal');
        }

        executeCommand('gem install ' + gem);
      });
    }

    // Execute the supplied command, optionally as root
    function executeCommand(cmd, root){
      cmd = root ? 'sudo ' + cmd : cmd;
      grunt.verbose.writeln('Executing: ' + cmd);

      exec(cmd, function(error, stdout, stderr){
        if(stderr.indexOf('have write permissions') !== -1){
          grunt.log.errorlns('It seems that you don\'t have write permissions for this directory. Executing as root, you may be required to type your root password below:');
          return executeCommand(cmd, true);
        } else if(stderr.indexOf('multipart-post (~> 1.2.0)') !== -1){
          grunt.log.errorlns('An error occured with a Ruby dependency, trying to resolve the issue');
          return exec('gem install multipart-post -v 1.2.0', function(error, stdout, stderr){
            if(!error){
              return executeCommand(cmd, true);
            }
          });
        } else if(error !== null){
          return deferred.reject(stderr, 'fatal');
        }
        
        // Next step here ...
        deferred.resolve(stdout);
      });
    }

  });
};
