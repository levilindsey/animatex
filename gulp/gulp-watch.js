import gulp from 'gulp';
import config from './config';

gulp.task('watch', config.buildTasks, () => {
  gulp.watch(config.scriptsSrc, ['scripts']);
});
