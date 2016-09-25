module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typings');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
        typings: {
            install: {}
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['build/**/*.js'],
              dest: 'dist/hitchhiker.js',
            },
          }
    });
    grunt.registerTask('typings:install', ['typings'])
    grunt.registerTask('build:full', ['typings', 'typescript'])
    grunt.registerTask('default', ['watch', 'concat']);
    grunt.registerTask("hj:concat", ['concat']);
}
