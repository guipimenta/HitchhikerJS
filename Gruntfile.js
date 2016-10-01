module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-typings');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typings: {
            install: {}
        },
        typescript: {
            base: {
                src: ['./src/**/*.ts'],
                dest: 'build/',
                options: {
                    module: 'commonjs',
                    target: 'ES5'
                }
            }
        },
        watch: {
            files: 'src/**/*.ts',
            tasks: ['typescript', 'concat']
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['build/modules/models/session.js',
                    'build/modules/core/configuration.js',
                    'build/modules/core/storage.js',
                    'build/modules/core/publishers.js',
                    'build/modules/core/highjacker.js',
                    'build/modules/bootstrap/bootstrap.js'],
              dest: 'dist/hitchhiker.js',
            },
          }
    });
    grunt.registerTask('build:full', ['typings', 'typescript', 'concat']);
    grunt.registerTask('default', ['watch', 'concat']);
}
