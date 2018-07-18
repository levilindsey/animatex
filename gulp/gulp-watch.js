import gulp from 'gulp';
import config from './gulp-config';

gulp.task('watch', config.buildTasks, () => {
  gulp.watch(config.scriptsSrc, ['scripts']);
});
