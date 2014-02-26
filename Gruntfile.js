module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //TODO - make this dynamic
        sass: {
          dist: {
            files: {
              'themes/apple-style/css/sequencejs-theme.apple-style.css': 'themes/apple-style/scss/*.scss',
              'themes/basic-crossfade/css/sequencejs-theme.basic-crossfade.css': 'themes/basic-crossfade/scss/*.scss',
              'themes/basic-slide/css/sequencejs-theme.basic-slide.css': 'themes/basic-slide/scss/*.scss',
              'themes/documentation-demo/css/sequencejs-theme.documentation-demo.css': 'themes/documentation-demo/scss/*.scss',
              'themes/modern-slide-in/css/sequencejs-theme.modern-slide-in.css': 'themes/modern-slide-in/scss/*.scss',
              'themes/sliding-horizontal-parallax/css/sequencejs-theme.sliding-horizontal-parallax.css': 'themes/sliding-horizontal-parallax/scss/*.scss',
              'themes/theme-template/css/sequencejs-theme.theme-template.css': 'themes/theme-template/scss/*.scss'
            }
          }
        },

        uglify: {
          options: {
            preserveComments: 'some'
          },
          my_target: {
            files: {
              'scripts/jquery.sequence-min.js':
                ['scripts/jquery.sequence.js']
            }
          }
        },

        watch: {
          options: {
            livereload: true,
          },
          
          scripts: {
            files: ['scripts/jquery.sequence.js'],
            tasks: ['uglify'],
            options: {
              spawn: false
            }
          },

          css: {
            files: ['themes/**/*.scss'],
            tasks: ['sass'],
            options: {
              spawn: false
            }
          }
        },

        connect: {
          server: {
            options: {
              port: 8000,
              base: './'
            }
          }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['connect', 'watch']); //watch for local development
    grunt.registerTask('run', ['sass', 'uglify']);

};