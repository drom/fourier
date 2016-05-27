module.exports = function(grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            all: ['Gruntfile.js', 'lib/**/*.js']
        },
        mochaTest: {
            test: {
                options: {
                    mochaOptions: {
                        'inline-diffs': true
                    }
                },
                src: ['test/*.js']
            }
        },
        browserify: {
            browser: {
                src: ['./lib/browser.js'],
                dest: './fourier.js'
            },
            benchmark: {
                src: ['./bin/benchmark.js'],
                dest: './fourier-benchmark.js'
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    mochaOptions: ['--inline-diffs']
                }
            },
            coverageSpecial: {
                src: 'testSpecial',
                options: {
                    coverageFolder: 'coverageSpecial',
                    mochaOptions: {
                        'inline-diffs': true
                    }
                }
            },
            coveralls: {
                src: 'test', // the folder, not the files
                options: {
                    coverage: true,
                    mochaOptions: {
                        'inline-diffs': true
                    },
                    check: {
                        lines: 75,
                        statements: 75
                    },
                    // define where the cover task should consider the root of
                    // libraries that are covered by tests
                    root: './lib',
                    reportFormats: ['cobertura', 'lcovonly']
                }
            }
        },
        istanbul_check_coverage: {
            default: {
                options: {
                    // will check both coverage folders and merge the coverage
                    // results
                    mochaOptions: {
                        'inline-diffs': true
                    },
                    coverageFolder: 'coverage*',
                    check: {
                        lines: 80,
                        statements: 80
                    }
                }
            }
        },

        clean: {
            node: ['node_modules']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('mocha', ['mochaTest']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
    grunt.registerTask('default', ['eslint', 'mocha', 'browserify']);
};
