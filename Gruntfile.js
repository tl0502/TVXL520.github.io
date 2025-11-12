module.exports = function(grunt) {

    // Load package and determine the asset base name (fallback to existing hux-blog)
    var pkg = grunt.file.readJSON('package.json');
    var assetName = pkg.name || 'tvxl-blog';
    // If the preferred less file doesn't exist but legacy hux file does, fallback to it
    if (!grunt.file.exists('less/' + assetName + '.less') && grunt.file.exists('less/hux-blog.less')) {
        assetName = 'hux-blog';
    }
    // If the preferred js source doesn't exist but a minified variant exists, use that for banner insertion
    var jsSource = null;
    if (grunt.file.exists('js/' + assetName + '.js')) {
        jsSource = 'js/' + assetName + '.js';
    } else if (grunt.file.exists('js/' + assetName + '.min.js')) {
        jsSource = 'js/' + assetName + '.min.js';
    } else if (grunt.file.exists('js/hux-blog.min.js')) {
        // fallback to legacy minified file
        jsSource = 'js/hux-blog.min.js';
        assetName = 'hux-blog';
    }

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        uglify: {
            main: {
                src: jsSource ? jsSource : 'js/' + assetName + '.js',
                dest: 'js/' + assetName + '.min.js'
            }
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: (function(){ var f={}; f['css/' + assetName + '.css'] = 'less/' + assetName + '.less'; return f; })()
            },
            minified: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: (function(){ var f={}; f['css/' + assetName + '.min.css'] = 'less/' + assetName + '.less'; return f; })()
            }
        },
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: (function(){ var arr=[]; arr.push('css/' + assetName + '.css'); arr.push('css/' + assetName + '.min.css'); arr.push('js/' + assetName + '.min.js'); return arr; })()
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/' + assetName + '.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                }
            },
        },
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less', 'usebanner']);

};
