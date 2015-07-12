'use strict';

var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 8000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  require('time-grunt')(grunt);

	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies',
		config: 'package.json',
		pattern: ['grunt-*']
	});

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['src/sequence.js']
    },

    copy: {
      main: {
        files: [
          {src: ['src/sequence.js'], dest: 'scripts/sequence.js'},
          {src: ['bower_components/hammerjs/hammer.min.js'], dest: 'scripts/hammer.min.js'},
          {src: ['bower_components/imagesloaded/imagesloaded.pkgd.min.js'], dest: 'scripts/imagesloaded.pkgd.min.js'},
          {src: ['bower_components/respond/dest/respond.min.js'], dest: 'scripts/respond.min.js'}
        ]
      }
    },

    version: {
			js: {
				options: {
					prefix: '@version\\s*'
				},
				src: ['src/**/*.js']
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

    /*
     * Auto prefix CSS file
     */
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 7', 'ie 8', 'ie 9']
      },

      main: {
        src: ['css/styles.css']
      }
    },

    /*
     * Minify CSS
     */
    cssmin: {

      main: {
        expand: true,
        cwd: 'css/',
        src: ['styles.css', '!styles.min.css'],
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
        options: {
          mangle: false,
          sourceMap: true,
          sourceMapName: 'scripts/sequence.min.map'
        },
				files: {
					'scripts/sequence.min.js': ['src/sequence.js']
				}
			}
		},

    connect: {
			options: {
				port: SERVER_PORT,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					base: '/',
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder(connect, '')
						];
					}
				}
			}
		},

		open: {
			server: {
				path: 'http://localhost:' + SERVER_PORT
			}
		},

    watch: {
      options: {
        nospawn: true,
        livereload: true
      },

      versions: {
        files: ['package.json'],
        tasks: ['version'],
        options: {
          spawn: false
        }
      },

      // Uglify sequence.js
      js_sequence: {
        files: ['src/sequence.js'],
        tasks: ['uglify', 'copy'],
        options: {
          spawn: false
        }
      },

      js: {
        files: ['scripts/*.js'],
        options: {
          spawn: false
        }
      },

      jshint: {
        files: ['src/sequence.js'],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      },

      // Process SASS, autoprefix, and minify main CSS
      scss: {
        files: ['scss/*.scss'],
        tasks: ['sass:main', 'autoprefixer', 'cssmin'],
        options: {
          spawn: false
        }
      },

      // Refresh the page when .html pages are changed
      html: {
        files: ['*.html', 'tests/**/*.html'],
        options: {
          spawn: false
        }
      }
    },

    karma: {
      single: {
        configFile: 'tests/karma.conf.js',
        singleRun: true
      },

      watch: {
        configFile: 'tests/karma.conf.js',
        singleRun: false,
        autoWatch: true
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Watch for local development
  grunt.registerTask('serve', 'start the server and watch files', [
    'connect:livereload',
    'open',
    'watch'
  ]);

  // Manual compile
  grunt.registerTask('default', [
    'version',
    'copy',
    'sass',
    'autoprefixer',
    'cssmin',
    'uglify'
  ]);

  // Single use test - will run jshint and karma once
  grunt.registerTask('test', 'run tests', [
    'jshint',
    'karma:single'
  ]);

  grunt.registerTask('test-watch', 'start a server to watch test files and run tests when they are updated', [
    'karma:watch'
  ]);
};
