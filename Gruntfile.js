/*
 * grunt-xcode
 * https://github.com/matiassingers/grunt-xcode
 *
 * Copyright (c) 2014 Matias Singers
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    xcode: {
      default: {
        options: {
          project: './xcode/test.xcodeproj',
          scheme: 'Test'
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['xcode']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
