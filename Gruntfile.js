module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typings');

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
            tasks: ['typescript']
        },
        typings: {
            install: {}
        }
    });
    grunt.registerTask('typings:install', ['typings'])
    grunt.registerTask('fullbuild', ['typings', 'typescript'])
    grunt.registerTask('default', ['watch']);
}
