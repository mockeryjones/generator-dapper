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
          'app/bower_components/jquery/jquery.min.js',
          'app/bower_components/angular/angular.min.js',
          'app/bower_components/angular-route/angular-route.min.js',
          'app/bower_components/lodash/dist/lodash.min.js',
          'app/bower_components/moment/min/moment.min.js',
          'app/bower_components/async/lib/async.js',
          'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
          'app/bower_components/qs/index.js',
          'app/bower_components/d3/d3.min.js',
          'app/bower_components/vega/vega.min.js',
          'app/bower_components/pikaday/pikaday.js',
          'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
          'app/bower_components/handsontable/dist/jquery.handsontable.full.js',
          'app/bower_components/jquery-mousewheel/jquery.mousewheel.js',
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
          'app/bower_components/scruffy/dist/js/scruffy.js',
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
          'bower_components/pikaday/css/pikaday.css',
          'bower_components/handsontable/dist/jquery.handsontable.full.css',
        ],
        dest: 'dist/css/'
      },
      css: {
        src: 'app/styles/main.css',
        dest: 'dist/css/main.css'
      },
    },

    nexus: {
      options: {
        url: 'http://nexus.yb0t.cc',
        username: process.env.NEXUS_BUILDER_USER,
        password: process.env.NEXUS_BUILDER_PASS,
        base_path: 'content/repositories'
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
      snapshot: {
        files: '<%= nexus.files %>',
        options: {
          repository: 'yb-public-snapshots',
          // Changing this to false seems to have issues pushing the actual archive to Nexus
          curl: true,
          publish: [{
            id: 'com.yieldbot.ui-app:<%= pkg.name %>:tar.gz',
            version: '<%= pkg.version %>.SNAPSHOT',
            path: 'target/'
          }]
        }
      },
      release: {
        files: '<%= nexus.files %>',
        options: {
          repository: 'yb-public-releases',
          // Changing this to false seems to have issues pushing the actual archive to Nexus
          curl: true,
          publish: [{
            id: 'com.yieldbot.ui-app:<%= pkg.name %>:tar.gz',
            version: '<%= pkg.version %>',
            path: 'target/'
          }]
        }
      }
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
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-html', 'dist-js']);

  // Artifact snapshot task.
  grunt.registerTask('snapshot', ['dist', 'nexus:snapshot:publish']);

  // Artifact release task.
  grunt.registerTask('release', ['dist', 'nexus:release:publish']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);

};