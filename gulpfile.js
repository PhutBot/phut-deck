const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('rollup');
const rollupTypescript = require('@rollup/plugin-typescript');
const commonJs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { Stream } = require('stream');
const fs = require('fs');
const path = require('path')

function walk(filePath, action) {
    return new Promise((res, rej) => {
        try {
            if (!fs.statSync(filePath).isDirectory()) {
                action(false, filePath);
                res();
            } else {
                const list = [];
                const paths = fs.readdirSync(filePath);
                for (let item of paths) {
                    list.push(walk(path.join(filePath, item), action));
                }
                Promise.all(list)
                    .then(() => {
                        action(true, filePath);
                        res();
                    }).catch(rej);
            }
        } catch (err) {
            rej(err);
        }
    });
}

function del() {
    const transform = new Stream.Transform({ objectMode: true });
    transform._transform = (file, enc, cb) => {
        if (fs.statSync(file.path).isFile()) {
            fs.promises.rm(file.path)
                .then(cb)
                .catch(cb);
        } else {
            walk(file.path, (isDir, filePath) => isDir ? fs.rmdirSync(filePath) : fs.rmSync(filePath))
                .then(cb)
                .catch(cb);
        }
    };
    return transform;
}

const backProject = ts.createProject('tsconfig.json');
gulp.task('backend/typescript', function () {
    return gulp.src('./src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(backProject()).js
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('frontend/typescript', function () {
    return rollup
        .rollup({
            input: './components/components.ts',
            plugins: [
                commonJs(),
                nodeResolve(),
                rollupTypescript({
                    module: 'esnext',
                    moduleResolution: 'node',
                    declaration: false
                })
            ]
        })
        .then(bundle => {
            return bundle.write({
                file: './dist/www/js/components.js',
                format: 'umd',
                name: 'library',
                sourcemap: true
            });
        });
});

gulp.task('frontend/copy', function() {
    return gulp.src([ './www/**/*', '!./www/**/*.ts'])
        .pipe(gulp.dest('./dist/www'));

});

gulp.task('clean', function() {
    return gulp.src([ './dist/*' ])
        .pipe(del());
});

gulp.task('backend', gulp.parallel('backend/typescript'));
gulp.task('frontend', gulp.parallel('frontend/copy', 'frontend/typescript'));
gulp.task('build', gulp.parallel('backend', 'frontend'))
gulp.task('default', gulp.series('clean', 'build'));

gulp.task('watch', function(cb) {
    gulp.watch(['./components/**/*.ts'], gulp.series('frontend/typescript'));
    gulp.watch(['./www/**/*'], gulp.series('frontend/copy'));
    cb();
    // sudo sh -c "echo fs.inotify.max_user_watches=8192 >> /etc/sysctl.conf"
    // sudo sysctl -p
    // find /proc/*/fd -user "$USER" -lname anon_inode:inotify -printf '%hinfo/%f\n' 2>/dev/null | xargs cat | grep -c '^inotify'
});