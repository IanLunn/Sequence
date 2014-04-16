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

    copy: {
      main: {
        files: [
          {src: ['src/sequence.js'], dest: 'scripts/sequence.js'},
          {src: ['bower_components/hammerjs/hammer.min.js'], dest: 'scripts/third-party/hammer.min.js'},
        ]
      }
    },

    jsdoc: {
			dist : {
				src: ['src/**/*.js'],
				options: {
					destination: 'doc'
				}
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

    /*
     * Get each theme's SCSS file and process it
     * SRC:  themes/<theme-name>/scss/sequence-js-theme.<theme-name>.scss
     * DEST: themes/<theme-name>/css/sequence-js-theme.<theme-name>.css
     */
    sass: {

      options: {
        style: 'expanded'
      },

      main: {
        expand: true,
        flatten: true,
        src: ['scss/styles.scss'],
        dest: 'css/',
        ext: '.css',
        extDot: 'first',
        rename: function(dest, src) {
          return dest + src.replace("scss", "css");
        }
      },

      themes: {
        expand: true,
        cwd: 'themes/',
        src: ['**/*.scss'],
        dest: 'themes/',
        ext: '.css',
        extDot: 'first',
        rename: function(dest, src) {
          return dest + src.replace("scss", "css");
        }
      },

      premium_themes: {
        expand: true,
        cwd: 'premium-themes/',
        src: ['**/*.scss'],
        dest: 'premium-themes/',
        ext: '.css',
        extDot: 'first',
        rename: function(dest, src) {
          return dest + src.replace("scss", "css");
        }
      }
    },

    /*
     * Auto prefix each themes CSS file
     */
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 7', 'ie 8', 'ie 9']
      },

      main: {
        src: 'css/styles.css'
      },

      themes: {
        src: 'themes/*/css/*.css'
      },

      premium_themes: {
        src: 'premium-themes/*/css/*.css'
      },
    },

    /*
     * Minify each themes CSS file
     */
    cssmin: {

      main: {
        expand: true,
        cwd: 'css/',
        src: ['styles.css', '!styles.min.css'],
        dest: 'css/',
        ext: '.min.css'
      },

      themes: {
        expand: true,
        cwd: 'themes/',
        src: ['*/css/*.css', '!*/css/*.min.css'],
        dest: 'themes/',
        ext: '.min.css'
      },

      premium_themes: {
        expand: true,
        cwd: 'premium-themes/',
        src: ['*/css/*.css', '!*/css/*.min.css'],
        dest: 'premium-themes/',
        ext: '.min.css'
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
			},

      themes: {
        files: [{
          expand: true,
          cwd: 'themes/',
          src: ['*/scripts/*.js', '!*/scripts/*.min.js'],
          dest: 'themes/',
          rename: function(dest, src) {
            return dest + src.replace(".js", ".min.js");
          }
        }]
      },

      premium_themes: {
        files: [{
          expand: true,
          cwd: 'premium-themes/',
          src: ['*/scripts/*.js', '!*/scripts/*.min.js'],
          dest: 'premium-themes/',
          rename: function(dest, src) {
            return dest + src.replace(".js", ".min.js");
          }
        }]
      }
		},

    watch: {
      options: {
        nospawn: true,
        livereload: true
      },

      // Uglify sequence.js
      main_js: {
        files: ['src/sequence.js'],
        tasks: ['uglify:main', 'copy:main'],
        options: {
          spawn: false
        }
      },

      // Process SASS, autoprefix, and minify main CSS
      main_css: {
        files: ['scss/*.scss'],
        tasks: ['sass:main', 'autoprefixer:main', 'cssmin:main'],
        options: {
          spawn: false
        }
      },

      // Uglify free themes
      themes_js: {
        files: ['themes/*/scripts/*.js'],
        tasks: ['uglify:themes'],
        options: {
          spawn: false
        }
      },

      // Process SASS, autoprefix, and minify theme CSS
      themes_css: {
        files: ['themes/*/scss/*.scss'],
        tasks: ['sass:themes', 'autoprefixer:themes', 'cssmin:themes'],
        options: {
          spawn: false
        }
      },

      // Uglify premium themes
      premium_themes_js: {
        files: ['premium-themes/*/scripts/*.js'],
        tasks: ['uglify:premium_themes'],
        options: {
          spawn: false
        }
      },

      // Process SASS, autoprefix, and minify premium theme CSS
      premium_themes_css: {
        files: ['premium-themes/*/scss/*.scss'],
        tasks: ['sass:premium_themes', 'autoprefixer:premium_themes', 'cssmin:premium_themes'],
        options: {
          spawn: false
        }
      },

      // Refresh the page when .html pages are changed
      html: {
        files: ['*.html', 'themes/*/*.html', 'premium-themes/*/*.html'],
        options: {
          spawn: false
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

    // Compile themes into zip files for distribution (used internally)
    package_sequence_themes: {
      themes: {
        options: {
          type: 'free'
        },
        expand: true,
        cwd: 'themes',
        src: ['*'],
        dest: 'packaged-themes/free/'
      },

      premium_themes: {
        options: {
          type: 'premium'
        },
        expand: true,
        cwd: 'premium-themes',
        src: ['*'],
        dest: 'packaged-themes/premium/'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Watch for local development
  grunt.registerTask('default', [
    'connect:livereload',
    'open',
    'watch'
  ]);

  // Manual compile
  grunt.registerTask('run', [
    'version:js',
    'version:json',
    'copy:main',
    'sass',
    'autoprefixer',
    'cssmin',
    'uglify'
  ]);

  // Setup documentation
  grunt.registerTask('doc', [
    'jsdoc'
  ]);

  // Compile themes into zip files for distribution (used internally)
  grunt.registerTask('package-themes', [
    'package_sequence_themes'
  ]);
};
