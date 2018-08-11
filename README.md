# animatex

#### A lightweight framework for custom animations.

_See this in use at [levi.codes/dynamics][demo]!_

## Notable Features

- Animator
  - Handles the animation loop.
  - Maintains a list of all currently running animation jobs.
  - Updates jobs as a separate step from drawing them.
- AnimationJob
  - An abstract class that defines an interface for updating, drawing, starting, and finishing 
    distinct jobs that are run by the animator.
  - The TransientAnimationJob sub-class supports jobs that will be automatically finished after a 
    certain duration.
  - The PersistentAnimationJob sub-class supports jobs that will run indefinitely and need to 
    manually stopped by the consumer.
- FrameLatencyProfiler
  - Used by the Animator to keep track of the min, max, and average animation frame durations.
  - Logs warnings when animation frames take too long.

## Acknowledgements / Technology Stack

The technologies used in this application include:

- [ES2015][es2015]
- [WebGL][webgl]
- [gulp.js][gulp]
- [Babel][babel]
- [Browserify][browserify]
- [SASS][sass]
- Numerous other packages that are available via [NPM][npm] (these are listed within the
  [`package.json`](./package.json) file)

## Developing / Running the Code

See [Getting Set Up](./docs/getting-set-up) or [Understanding the
Code](./docs/understanding-the-code) for more info.

## License

MIT

[demo]: http://levi.codes/space-debris

[es2015]: http://www.ecma-international.org/ecma-262/6.0/
[webgl]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
[node]: http://nodejs.org/
[babel]: https://babeljs.io/
[browserify]: http://browserify.org/
[gulp]: http://gulpjs.com/
[sass]: http://sass-lang.com/
[npm]: http://npmjs.org/
