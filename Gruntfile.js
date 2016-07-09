module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist'],
    uglify: {
      my_target: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/popup-directive.min.js': ['src/popup-directive.js']
        }
      }
    },
    copy: {
        main: {
            files: [{
                expand: true,
                cwd: 'src/',
                src: ['popup-directive.js'],
                dest: 'dist/'
            }]
        }
    }
  });

  grunt.registerTask('build', ['clean', 'uglify', 'copy']);

};