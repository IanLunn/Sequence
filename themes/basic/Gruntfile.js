module.exports = function(grunt) {

  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    config: 'package.json',
    pattern: ['grunt-*']
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        files: [
          {src: ['bower_components/hammerjs/hammer.min.js'], dest: 'scripts/third-party/hammer.min.js'},
          {src: ['bower_components/imagesloaded/imagesloaded.pkgd.min.js'], dest: 'scripts/third-party/imagesloaded.pkgd.min.js'},
        ]
      }
    },

    version: {
      js: {
        options: {
          prefix: 'Version:\\s*'
        },
        src: ['scripts/**/*.js', '!scripts/**/*.min.js']
      },
      css: {
        options: {
          prefix: 'Version:\\s*'
        },
        src: ['scss/*.scss', 'css/*.css', 'css/*.min.css']
      },
      json: {
        options: {
          prefix: '"version":\\s"*'
        },
        src: ['bower.json']
      }
    },

    sass: {
      options: {
        style: 'expanded'
      },

      main: {
        expand: true,
        flatten: true,
        src: ['scss/*.scss'],
        dest: 'css/',
        ext: '.css',
        extDot: 'last',
        rename: function(dest, src) {
          return dest + src.replace("scss", "css");
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
        'last 2 version',
        'ie 7',
        'ie 8',
        'ie 9']
      },

      main: {
        src: 'css/*.css'
      }
    },

    cssmin: {
      main: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css',
        extDot: 'last'
      }
    },

    uglify: {

      options: {
        preserveComments: 'some'
      },

      main: {
        files: [{
          expand: true,
          cwd: 'scripts/',
          src: ['*.js', '!sequence.js', '!*.min.js'],
          dest: 'scripts/',
          rename: function(dest, src) {
            return dest + src.replace(".js", ".min.js");
          }
        }]
      },
    },

    // Watch JS, CSS, and HTML for changes, and run tasks accordingly
    watch: {

      // Watch JS
      js: {
        files: ['scripts/**/*.js', '!**/*.min.js', '!third-party/**/*.js'],
        tasks: ['uglify', 'copy', 'version:js'],
        options: {
          spawn: false,
        }
      },

      json: {
        files: ['package.json'],
        tasks: ['version'],
        options: {
          spawn: false,
        }
      },

      scss: {
        files: ['**/*.scss'],
        tasks: ['sass', 'autoprefixer', 'cssmin', 'version:css'],
        options: {
          spawn: false,
        }
      },

      // Watch CSS
      css: {
        files: ['**/*.css', '!**/*.min.css'],
        tasks: ['autoprefixer', 'cssmin', 'version:css'],
        options: {
          spawn: false,
        }
      },

      // Watch HTML
      html: {
        files: ['*.html'],
        options: {
          spawn: false,
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('build', ['copy', 'sass', 'uglify', 'cssmin', 'autoprefixer', 'version']);

};
