'use strict';

module.exports = function (grunt) {

    // Load NPM Tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-babel');

    // Load Custom Tasks
    grunt.loadTasks('tasks');

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                process: function (src, filepath) {
                    if (filepath.substr(filepath.length - 2) === 'js') {
                        return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    } else {
                        return src;
                    }
                }
            },
            angular: {
                src: ['bower_components/angular/angular.min.js',
                      'bower_components/angular-resource/angular-resource.min.js',
                      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
                      'bower_components/angular-animate/angular-animate.min.js',
                      'bower_components/angular-bootstrap/ui-bootstrap.js',
                      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                      'bower_components/ngprogress/build/ngProgress.min.js',
                      'bower_components/angular-gettext/dist/angular-gettext.min.js',
                      'bower_components/angular-naturalsort/dist/naturalSortVersionDates.min.js',
                      'bower_components/angular-qrcode/qrcode.js'],
                dest: 'public/js/angularjs-all.js'
            },
            main: {
                src: ['src/js/app.js',
                      'src/js/controllers/*.js',
                      'src/js/directives/*.js',
                      'src/js/services/*.js',
                      'src/js/filters.js',
                      'src/js/config.js',
                      'src/js/init.js',
                      'src/js/translations.js'],
                dest: 'public/js/main.js'
            },
            vendors: {
                src: ['bower_components/amstockchart/amcharts/amcharts.js',
                      'bower_components/amstockchart/amcharts/serial.js',
                      'bower_components/amstockchart/amcharts/amstock.js',
                      'bower_components/momentjs/min/moment.min.js',
                      'bower_components/leaflet/dist/leaflet.js',
                      'bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
                      'bower_components/sigma/sigma.min.js',
                      'bower_components/sigma/plugins/*.min.js',
                      'bower_components/underscore/underscore-min.js',
                      'bower_components/qrcode-generator/js/qrcode.js',
                      'bower_components/zeroclipboard/ZeroClipboard.min.js'],
                dest: 'public/js/vendors.js'
            },
            css: {
                src: ['bower_components/amstockchart/amcharts/style.css',
                      'bower_components/bootstrap/dist/css/bootstrap.css',
                      'bower_components/font-awesome/css/font-awesome.css',
                      'bower_components/leaflet/dist/leaflet.css',
                      'bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css',
                      'src/css/**/*.css'],
                dest: 'public/css/main.css'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'public/js/main.js': 'public/js/main.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
                mangle: false
            },
            angular: {
                src: 'public/js/angularjs-all.js',
                dest: 'public/js/angularjs-all.min.js'
            },
            main: {
                src: 'public/js/main.js',
                dest: 'public/js/main.min.js'
            },
            vendors: {
                src: 'public/js/vendors.js',
                dest: 'public/js/vendors.min.js'
            }
        },
        cssmin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/css',
                    ext: '.min.css'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['api/**/*.js',
                  'app.js',
                  'benchmark.js',
                  'benchmarks/**/*.js',
                  'cache.js',
                  'Gruntfile.js',
                  'lib/**/*.js',
                  'public/src/js/**/*.js',
                  'redis.js',
                  'sockets/**/*.js',
                  'tasks/**/*.js',
                  'test/**/*.js',
                  'utils**/*.js']
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false,
                    noFail: false,
                    timeout: '250s'
                },
                src: ['test']
            }
        },
        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        src: 'README.md',
                        dest: '.',
                        ext: '.html'
                    }
                ]
            }
        },
        watch: {
            main: {
                files: ['src/js/**/*.js'],
                tasks: ['concat:main', 'babel', 'uglify:main'],
            },
            css: {
                files: ['src/css/**/*.css'],
                tasks: ['concat:css', 'cssmin'],
            },
            html: {
                files: ['src/views/**/*.html', 'src/index.html'],
                tasks: ['copy:html'],
            },
            assets: {
                files: ['img/**/*', 'sound/**/*', 'swf/**/*', 'fonts/**/*'],
                tasks: ['copy:assets']
            }
        },
        copy: {
            vedors: {
                files: [
                    {
                        // Copy AmCharts images to public/img/amcharts.
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/amstockchart/amcharts/images',
                        src: ['*.*'],
                        dest: 'public/img/amcharts'
                    },
                    {
                        // Copy Bootstrap fonts to public/fonts.
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'public'
                    },
                    {
                        // Copy Font-awesome fonts to public/fonts.
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/font-awesome',
                        src: ['fonts/*.*'],
                        dest: 'public'
                    }
                ]
            },
            html: {
                files: [
                    {
                        // Copy HTML files
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        src: ['index.html', 'views/**/*.html'],
                        dest: 'public'
                    }
                ]
            },
            assets: {
                files: [
                    {
                        // Copy HTML files
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        src: ['img/**/*', 'sound/**/*', 'swf/**/*'],
                        dest: 'public'
                    }
                ]
            }
        },
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': ['src/views/*.html', 'src/views/**/*.html']
                }
            },
        },
        nggettext_compile: {
            all: {
                options: {
                    module: 'lisk_explorer'
                },
                files: {
                    'src/js/translations.js': ['po/*.po']
                }
            },
        }
    });

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // Default task(s).
    grunt.registerTask('default', ['watch']);

    // Register tasks for travis.
    grunt.registerTask('travis', ['jshint', 'mochaTest']);

    // Compile task (concat + minify).
    grunt.registerTask('compile', ['nggettext_extract', 'nggettext_compile', 'concat', 'babel', 'uglify', 'cssmin', 'copy:vedors', 'copy:html', 'copy:assets']);

    // Copy ZeroClipboard.swf to public/swf.
    grunt.file.copy('bower_components/zeroclipboard/ZeroClipboard.swf', 'public/swf/ZeroClipboard.swf');

    // Copy Leaflet images to public/img/leaflet.
    grunt.file.copy('bower_components/leaflet/dist/images/layers.png', 'public/img/leaflet/layers.png');
    grunt.file.copy('bower_components/leaflet/dist/images/layers-2x.png', 'public/img/leaflet/layers-2x.png');
    grunt.file.copy('bower_components/leaflet/dist/images/marker-icon.png', 'public/img/leaflet/marker-icon.png');
    grunt.file.copy('bower_components/leaflet/dist/images/marker-icon-2x.png', 'public/img/leaflet/marker-icon-2x.png');
    grunt.file.copy('bower_components/leaflet/dist/images/marker-shadow.png', 'public/img/leaflet/marker-shadow.png');
};
