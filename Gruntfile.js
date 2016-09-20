module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        ts: {
            default: {
                src: ['**/*.ts', "!node_modules/**"],
                out: 'hitchhiker-concat.js',
                options: {
                    module: 'commonjs'
                }
            }
        },
        watch: {
            files: 'src/**/*.ts',
            tasks: ['ts']
        },
    });
 
    grunt.registerTask('default', ['watch']);
}