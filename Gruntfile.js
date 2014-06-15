module.exports = function (grunt) {
    require('load-grunt-config')(grunt);
    require('time-grunt')(grunt);
    var config = grunt.file.readJSON('config.json');
    grunt.config.init({
        app: {
            path: 'app'
        },
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            release: {
                expand: true,
                cwd: '<%=app.path%>',
                src: [
                    '**/*',
                    '!template/**'
                ],
                dest: '.tmp'
            }
        },
        clean: {
            release: ['release'],
            tmp: ['.tmp']
        },
        ect: {
            options: {
                variables: config.ect,
                ext: '.ect'
            },
            dev: {
                expand: true,
                cwd: '<%=app.path%>/template',
                src: [
                    '**/*.ect',
                    '!**/_*.ect'
                ],
                dest: '<%=app.path%>',
                ext: '.html'
            }
        },
        sass: {
            dev: {
                options: {
                    includePaths: require('node-bourbon').includePaths,
                    imagePath: '<%=app.path%>/images',
                    outputStyle: 'nested'
                },
                expand: true,
                cwd: '<%=app.path%>/sass',
                src: [
                    '**/*.scss'
                ],
                dest: '<%=app.path%>/css',
                ext: '.css'
            },
            release: {
                options: {
                    includePaths: require('node-bourbon').includePaths,
                    imagePath: '<%=app.path%>/images',
                    outputStyle: 'compressed'
                },
                expand: true,
                cwd: '<%=app.path%>/sass',
                src: [
                    '**/*.scss'
                ],
                dest: '<%=app.path%>/css',
                ext: '.css'
            }
        },
        compass: {
            dev: {
                options: {
                    basePath: '<%=app.path%>',
                    config: './config.rb',
                    environment: 'development'
                }
            },
            release: {
                options: {
                    basePath: '<%=app.path%>',
                    config: './config.rb',
                    environment: 'production'
                }
            }
        },
        autoprefixer: {
            dev: {
                expand: true,
                flatten: true,
                cwd: '<%=app.path%>/css',
                src: '**/*.css',
                dest: '<%=app.path%>/css'
            },
            release: {
                expand: true,
                flatten: true,
                cwd: '.tmp/css',
                src: '**/*.css',
                dest: '.tmp/css'
            },
            options: {
                browsers: ['last 3 version','ie >= 8']
            }
        },
        csso: {
            release: {
                expand: true,
                cwd: 'release',
                src: ['**/*.css'],
                dest: 'release',
                ext: '.css'
            }
        },
        useminPrepare: {
            html: [
                '.tmp/**/*.html'
            ],
            options: {
                dest: 'release'
            }
        },
        usemin: {
            html: [
                '.tmp/**/*.html'
            ],
            options: {
                dest: '.tmp'
            }
        },

        concat: {
            options: {
                force: true
            }
        },
        glue: {
            icons: {
                src:"<%=app.path%>/images/sprites",
                dest: './',
                options: "--margin=3 --scss --img=<%=app.path%>/images/sprites --css=<%=app.path%>/sass/sprites --project"
            }
        },
        uglify: {
            options: {
                force: true
            }
        },
        cssmin: {
            options: {
                force: true
            }
        },
        imagemin: {
            release: {
                files: [{
                    expand: true,
                    cwd: '<%=app.path%>/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'release/images'
                }],
                options: {
                    optimizationLevel: 7,
                    progressive: true,
                    interlaced: true,
                    pngquant: true
                }
            }
        },
        htmlmin: {
            release: {
                expand: true,
                cwd: '.tmp',
                src: [
                    '**/*.html'
                ],
                dest: 'release',
                options: {
                    removeComments: false,
                    removeCommentsFromCDATA: false,
                    removeCDATASectionsFromCDATA: false,
                    collapseWhitespace: false,
                    removeRedundantAttributes: false,
                    removeOptionalTags: false
                }
            }
        },
        prettify: {
            dev: {
                expand: true,
                cwd: '<%=app.path%>',
                ext: '.html',
                src: ['**/*.html'],
                dest: '<%=app.path%>'
            },
            options: config.jsbeautify
        },
        htmllint: {
            html: [
                '<%=app.path%>/**/*.html'
            ]
        },
        csslint: {
            options: config.csslint,
            dev: {
                src: ['<%=app.path%>/**/*.css']
            }
        },
        jshint: {
            dev: [
                '<%=app.path%>/{,*/}*.js',
                '!<%=app.path%>/lib/**'
            ],
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            }
        },
        bowerInstall: {
            html: {
                src: [
                    '<%=app.path%>/**/*.html'
                ]
            }
        },
        connect: {
            dev: {
                options: {
                    hostname: 'localhost',
                    livereload: true,
                    open: false,
                    base: '<%=app.path%>'
                }
            }
        },
        watch: {
            html: {
                files: ['<%=app.path%>/**/*.html'],
                tasks: ['htmllint']
            },
            ect: {
                files: ['<%=app.path%>/template/**/*.ect'],
                tasks: ['ect','prettify']
            },
            script: {
                files: ['<%=app.path%>/js/**/*.js'],
                tasks: ['jshint:dev']
            },
            style: {
                files: ['<%=app.path%>/sass/**/*.scss'],
                tasks: ['sass:dev','autoprefixer:dev','csslint']
            },
            bower: {
                files: ['bower_components/**/*'],
                tasks: ['bowerInstall']
            },
            options: {
                livereload: true
            }
        }
    });
    grunt.registerTask('rebuild', [
        'ect',
        'sass:dev',
        'autoprefixer:dev',
        'bowerInstall'
    ]);
	grunt.registerTask('release', [
        'clean',
        'ect',
        'bowerInstall',
        'copy',
        'sass:release',
        'autoprefixer:release',
        'useminPrepare',
		'concat',
        'uglify',
        'cssmin',
        'imagemin',
        'csso',
        'usemin',
        'htmlmin',
        'clean:tmp'
	]);
	grunt.registerTask('default', [
		'connect',
		'watch'
	]);
};
