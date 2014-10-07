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
      test: {
        options: {
          project: 'test/grunt-xcode/grunt-xcode.xcodeproj',
          scheme: 'grunt-xcode',
          exportPath: 'test'
        }
      }
    },
    nodeunit: {
      tasks: ['test/test.js']
    },
    clean: {
      test: ['test/export.ipa']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "test" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'xcode', 'nodeunit', 'clean']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
