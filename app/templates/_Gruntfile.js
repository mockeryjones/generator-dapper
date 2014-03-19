/* jshint node: true */

module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: ['/*!',
             ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
             ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
             ' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>',
             ' */\n\n',
            ].join('\n'),
    jsLintable: [
      'app/scripts/**/*.js',
      'Gruntfile.js',
    ],

    // Task configuration.
    clean: {
      dist: ['dist'],
      target: ['target'],
    },

    jscs: {
      dev: {
        src: ['<%= jsLintable %>'],
      },
      report: {
        src: ['<%= jsLintable %>'],
        options: {
          reporter: 'checkstyle',
          reporterOutput: 'reports/jscs-checkstyle-results.xml',
        }
      },
    },

    jshint: {
      options: {
        jshintrc: true,
      },
      dev: {
        src: ['<%= jsLintable %>'],
        options: {
          reporter: require('jshint-stylish'),
        },
      },
      report: {
        src: ['<%= jsLintable %>'],
        options: {
          reporter: 'jslint',
          reporterOutput: 'reports/jshint-lint-results.xml',
        }
      },
    },

    concat: {
      vendor: {
        options: {
          banner: '/*! Yieldbot 3rd party */',
          stripBanners: false,
        },
        src: [
          // TODO consider sourcemap or if we'll uglify this too and then don't use min form
          'bower_components/jquery/jquery.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/angular-route/angular-route.min.js',
          'bower_components/lodash/dist/lodash.min.js',
          'bower_components/moment/min/moment.min.js',
          'bower_components/async/lib/async.js',
          'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/qs/index.js',
          'bower_components/d3/d3.min.js',
          'bower_components/vega/vega.min.js',
          'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        ],
        dest: 'dist/js/vendor.js'
      },
      core: {
        options: {
          banner: '<%= banner %>',
          stripBanners: false,
        },
        src: [
          // TODO see if this ordering is correct
          // TODO see if we can complain if a file is missing better (tests?)
          'app/scripts/app.js',
          'bower_components/scruffy/dist/js/scruffy.js',
          'app/scripts/controllers/**/*.js',
          'app/scripts/services/**/*.js',
          'app/scripts/directives/**/*.js',
          'app/scripts/filters/**/*.js',
        ],
        dest: 'dist/js/<%= _.dasherize(pkg.name) %>.js'
      },
    },

    copy: {
      html: {
        expand: true,
        cwd: 'app/templates',
        src: [
          '**/*.html',
        ],
        dest: 'dist/html'
      },
      index: {
        src: 'app/index.html',
        dest: 'dist/index.html'
      },
      vendorcss: {
        expand: true,
        cwd: 'app',
        src: [
          
        ],
        dest: 'dist/css/'
      },
      css: {
        src: 'app/styles/main.css',
        dest: 'dist/css/main.css'
      },
    },

    compress: {
      dist: {
        options: {
          archive: 'target/dist.tar.gz',
        },
        files: [
          {
            expand: true,
            src: ['dist/**/*']
          },
          {
            src: ['bower.json', 'README.md']
          },
        ],
      },
    },

    watch: {
      options: {
        spawn: true,
      },
      js: {
        files: [
          'app/bower_components/scruffy/dist/js/scruffy.js',
          'app/scripts/**/*.js',
          'Gruntfile.js',
        ],
        tasks: ['concat:core']
      },
      css: {
        files: [
          'app/styles/**/*.css',
        ],
        tasks: ['dist-css']
      },
      html: {
        files: [
          'app/index.html',
          'app/templates/**/*.html',
        ],
        tasks: ['dist-html']
      },
    },

  });

  // These plugins provide necessary tasks.
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Test task.
  grunt.registerTask('test', ['jshint', 'jscs']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['copy:vendorcss', 'copy:css']);

  // HTML distribution task.
  grunt.registerTask('dist-html', ['copy:html', 'copy:index']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-html', 'dist-js', 'compress:dist']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);

};