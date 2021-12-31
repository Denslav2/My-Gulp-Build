/*Подключам плагины к сборке*/
const gulp = require('gulp');
const serverSync = require('browser-sync').create();
const less = require('gulp-less');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');//Для подержки старіх версий браузеров
const del = require('del');
const babel = require('gulp-babel');
const concat = require('gulp-concat');//Обьеденение файлов
const uglify = require('gulp-uglify');//Минификация JS
const imagemin = require ('gulp-imagemin');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');//карта css файла

/*Настраиваем пути к файлам разработки и конечным файлам*/
const paths = {

    html: { 
        src: 'src/**/*.html',//Путь к файлу разработки  
        dest: 'dist/' //Путь к конечному файлу
    },
    styles: {
        //src: 'src/styles/**/*.less',//Путь к файлу разработки (Раскометировать для работЫ)  
        src: 'src/styles/**/*.scss',//Путь к файлу разработки  
        dest: 'dist/css/' //Путь к конечному файлу
    },
    scripts: {
        src: 'src/scripts/**/*.js', //Путь к файлу разработки 
        dest: 'dist/js/' //Путь к конечному файлу
    },
    image: {
        src: 'src/img/*', //Путь к файлу разработки 
        dest: 'dist/img/' //Путь к конечному файлу
    }
}

/*Функция очистки каталога dist*/
function clean(){
    return del (['dist'])
}

//Функция обработки HTML
function html(){
    return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
}

/*Функция компиляции less в css*/
function stylesLess() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 8 versions']
      }))
    .pipe(cleanCss())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
};

/*Функция компиляции sass в css*/
function stylesSass() {
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 8 versions']
      }))
    .pipe(cleanCss())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
};

//Функция обработки JS файлов
function scripts(){
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
}

//Функция сжатия изображений
function imgMin(){
    return gulp.src(paths.image.src)
    .pipe(imagemin(
        {
            verbose: true
        }
    ))
    .pipe(newer(paths.image.dest))
    .pipe(gulp.dest(paths.image.dest))
}

/*Функция отслеживания изменений в файлах*/
function watch(){
    gulp.watch(paths.html.src, html).on('all', serverSync.reload);
    gulp.watch(paths.styles.src, stylesSass).on('all', serverSync.reload);
    gulp.watch(paths.scripts.src, scripts).on('all', serverSync.reload);
    gulp.watch(paths.image.src, imgMin).on('all', serverSync.reload);
} 

//Сервер
const server = function(){
    serverSync.init({
        server: {
            baseDir: 'dist/'
        }
    })
}

/*Последовательное выполнение заданий*/
const build = gulp.series(clean, gulp.parallel(html, stylesSass, scripts, imgMin), gulp.parallel(watch,server));


exports.clean = clean
exports.html = html
exports.stylesLess = stylesLess
exports.stylesSass = stylesSass
exports.scripts = scripts
exports.imgMin = imgMin
exports.watch = watch
exports.build = build
exports.default = build