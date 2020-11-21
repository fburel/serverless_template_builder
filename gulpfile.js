var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var run = require('gulp-run');


gulp.task('default', function () {
    nodemon({
        script: './bin/www',
        ext: 'js',
        env : {
            PORT:3000,
            RUN_MODE:"debug",
        },
        ignore: ['./node_modules/**']
    })
        .on('restart', function(){
            console.log('Restarting');
        });
});
