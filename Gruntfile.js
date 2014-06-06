module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: [ 'lib/{,*/}*.js']
      },
      all: [
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/client/.jshintrc'
        },
        src: ['test/client/spec/{,*/}*.js']
      }
    },
    sass: {
      dist: {
        files: {
          'app/styles/main.css': 'app/styles/main.scss'
        }
      }
    },
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
          'app/scripts/concat.js'
          ]
        }]
      }
    },

    ngmin: {
      dist: {
        files: [{
          expand: true,
          // cwd: '.tmp/concat/scripts',
          cwd: 'app/scripts',
          src: 'concat.js',
          dest: 'app/scripts'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'app/scripts/scripts.js': [
            'app/scripts/concat.js'
          ]
        }
      }
    },

    concat: {
      dist: {
        files: {
          'app/scripts/concat.js' : [
            "app/scripts/app.js",
            "app/scripts/controllers/navbar.js",
            "app/scripts/controllers/profile.js",
            "app/scripts/controllers/groups.js",
            "app/scripts/controllers/kiwis.js",
            "app/scripts/controllers/special.js",
            "app/scripts/controllers/publicGroup.js",
            "app/scripts/directives/multiYaxisGraph.js",
            "app/scripts/directives/dragdrop.js",
            "app/scripts/services/auth.js",
            "app/scripts/services/alert.js",
            "app/scripts/lib/detectmobilebrowser.js",
            "app/scripts/services/NumberParser.js",
            "app/scripts/directives/ui-bootstrap-carousel-tpls.js",
            "app/scripts/services/Kiwi.js",
            "app/scripts/services/Group.js",
            "app/scripts/services/Profile.js",
            "app/scripts/controllers/main.js"
          ]
        }
      }
    }

  });


  grunt.registerTask('build', [
    'concat',
    'ngmin',
    'uglify',
    'clean:dist',
    'sass'
    ]);

};