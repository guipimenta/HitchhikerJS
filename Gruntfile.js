module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['./src/**/*.ts'],
                dest: 'build/hitchhiker-concat.js',
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
    });
 
    grunt.registerTask('default', ['watch']);
}