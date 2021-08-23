var gulp         = require('gulp'),
    gulpSass     = require('gulp-sass')(require('sass')),
    watch        = require('gulp-watch'),
    uglifycss    = require('gulp-uglifycss'),
    autoprefixer = require('gulp-autoprefixer'),
    minify       = require('gulp-minify'),
    concat       = require('gulp-concat'),
    bro          = require('gulp-bro'),
	fileinclude = require('gulp-file-include'),
    browserSync  = require('browser-sync').create();
	// TO DO: add sourcemaps

const paths = {
	scripts: {
		src: './',
		dest: './dist/'
	}
};

function includeHTML(){
	return gulp.src([
	  '*.html',
	  ])
	  .pipe(gulp.dest(paths.scripts.dest));
}

function sass(done) {
	gulp.src('./sass/**/*.scss')
		.pipe(gulpSass().on('error', gulpSass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(uglifycss({
			"uglyComments": true
		}))
		.pipe(gulp.dest('./dist/'));
	done();
};

function js (done) {
	gulp.src('js/*.js')
		.pipe(bro())
		.pipe(minify({
			ext:{
				min:'.min.js',
			},
			noSource: true,
		}))
		.pipe(gulp.dest('./dist'));
	done();
}

function browser(done) {
	browserSync.init({
		/**
		 * Set custom proxy server url
		 */
		server: {
            baseDir: "./"
        }
	});

	gulp.watch('sass/**/*.scss', sass).on('change', browserSync.reload);
	gulp.watch('js/**/*.js', js).on('change', browserSync.reload);
	gulp.watch('*.html', js).on('change', browserSync.reload);
}

function watchFiles() {
    gulp.watch('sass/**/*.scss', sass);
    gulp.watch('js/**/*.js', js);
}

gulp.task("sass", sass);

gulp.task("js", js);

gulp.task("includeHTML", includeHTML);

gulp.task("browser", browser);

gulp.task("default", gulp.parallel(sass,js,watchFiles,browser));

gulp.task('run', gulp.parallel(sass,js));

gulp.task('watch', gulp.parallel(watchFiles));