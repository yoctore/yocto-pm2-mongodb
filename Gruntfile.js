'use strict';

module.exports = function (grunt) {
  // init config
  grunt.initConfig({
    // default package
    pkg       : grunt.file.readJSON('package.json'),
    yoctohint : {
      all : [ 'Gruntfile.js', 'app.js', 'lib/*.js' ]
    }
  });

  grunt.loadNpmTasks('yocto-hint');

  // register tasks
  grunt.registerTask('hint', 'yoctohint');
  grunt.registerTask('default', 'hint');
};
