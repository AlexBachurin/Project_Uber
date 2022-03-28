const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

// Static server
//задача для сервера
gulp.task('server', function () {

    browserSync({
        server: {
            baseDir: "dist" //директория главного файла
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});
//задача для стилей
gulp.task('styles', function () {
    //путь куда переходить и какие файлы использовать
    return gulp.src("src/sass/**/*.+(scss|sass)")
        //используем компилятор sass с данным файлом и сжимаем его
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        //переименовывем файл в .min.css
        .pipe(rename({ suffix: '.min', prefix: '' }))
        //подставляем префиксы для последних версий браузеров
        .pipe(autoprefixer())
        .pipe(cleanCSS({ compatibility: 'ie8' })) //очищаем
        .pipe(gulp.dest("dist/css")) //отправляем откомпилированный код по указанному адресу
        .pipe(browserSync.stream()); //обновляем страницу при обновлении файлов sass/scss
});
//создаем задачу для слежки за изменениями
gulp.task('watch', function () {
    //следить за изменениями данного файла и запустить задачу
    //в функции parallel
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    //также следим за изменениями html файлов и обновляем browserSync при изменении
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"));
});

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task('icons', function () {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"));
});

gulp.task('mailer', function () {
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest("dist/mailer"));
});

gulp.task('images', function () {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});
//создаем еще одну задачу для запуска одновременно остальных задач
gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'mailer', 'html', 'images'));