const gulp        = require('gulp');
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require("gulp-rename");

// Static server
//задача для сервера
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src" //директория главного файла
        }
    });
});
//задача для стилей
gulp.task('styles', function() {
    //путь куда переходить и какие файлы использовать
    return gulp.src('src/sass/*.+(scss|sass)') //конструкция для использование обоих препроцессоров
            //используем компилятор sass с данным файлом и сжимаем его
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            //переименовывем файл в .min.css
            .pipe(rename({
                prefix: "",
                suffix: ".min"
              }))
            //подставляем префиксы для последних версий браузеров
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cleanCSS({compatibility: 'ie8'})) //очищаем
            .pipe(gulp.dest("src/css")) //отправляем откомпилированный код по указанному адресу
            .pipe(browserSync.stream()); //обновляем страницу при обновлении файлов sass/scss
});

//создаем задачу для слежки за изменениями
gulp.task('watch', function() {
    //следить за изменениями данного файла и запустить задачу
    //в функции parallel
    gulp.watch('src/sass/*.+(scss|sass)', gulp.parallel('styles'));
    //также следим за изменениями html файлов и обновляем browserSync при изменении
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

//создаем еще одну задачу для запуска одновременно остальных задач
gulp.task('default', gulp.parallel('watch', 'server', 'styles'));


