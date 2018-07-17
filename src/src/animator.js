import {FrameLatencyProfiler} from './frame-latency-profiler';
import {PersistentAnimationJob} from './persistent-animation-job';
import {TransientAnimationJob} from './transient-animation-job';

const _DELTA_TIME_UPPER_THRESHOLD = 200;
const _FRAME_DURATION_WARNING_THRESHOLD = 1000 / 30;
const _FRAME_LATENCY_LOG_PERIOD = 5000;
const _LATENCY_LOG_LABEL = 'Animation frame period';

/**
 * This class handles the animation loop.
 *
 * This class's responsibilities include:
 * - updating modules for the current frame,
 * - drawing renderables for the current frame,
 * - starting and stopping transient animation jobs,
 * - capping time step durations at a max threshold.
 */
class Animator {
  constructor() {
    this._jobs = [];
    this._previousTime = null;
    this._isPaused = true;
    this._requestAnimationFrameId = null;
    this._totalUnpausedRunTime = 0;
    this._lastUnpauseTime = null;
    this._latencyProfiler = new FrameLatencyProfiler(_FRAME_LATENCY_LOG_PERIOD,
        _FRAME_DURATION_WARNING_THRESHOLD, _LATENCY_LOG_LABEL);
  }

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  startJob(job) {
    // Is this a restart?
    if (!job.isComplete) {
      console.debug(`Restarting AnimationJob: ${job.constructor.name}`);

      if (job instanceof PersistentAnimationJob) {
        job.reset();
      } else {
        job.finish(true);
        job.start(window.performance.now());
      }
    } else {
      console.debug(`Starting AnimationJob: ${job.constructor.name}`);

      job.start(this._previousTime);
      this._jobs.push(job);
    }

    this._startAnimationLoop();
  }

  /**
   * Cancels the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  cancelJob(job) {
    console.debug(`Cancelling AnimationJob: ${job.constructor.name}`);
    job.finish(true);
  }

  /**
   * Cancels all running AnimationJobs.
   */
  cancelAll() {
    while (this._jobs.length) {
      this.cancelJob(this._jobs[0]);
    }
  }

  /** @returns {DOMHighResTimeStamp} */
  get currentTime() {
    return this._previousTime;
  }

  /** @returns {boolean} */
  get isPaused() {
    return this._isPaused;
  }

  pause() {
    this._stopAnimationLoop();
    console.debug('Animator paused');
  }

  unpause() {
    this._startAnimationLoop();
    console.debug('Animator unpaused');
  }

  /**
   * This is the animation loop that drives all of the animation.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @private
   */
  _animationLoop(currentTime) {
    // When pausing and restarting, it's possible for the previous time to be slightly inconsistent
    // with the animationFrame time.
    if (currentTime < this._previousTime) {
      this._previousTime = currentTime - 1;
    }

    let deltaTime = currentTime - this._previousTime;
    this._previousTime = currentTime;

    this._latencyProfiler.recordFrameLatency(deltaTime);

    // Large delays between frames can cause lead to instability in the system, so this caps them to
    // a max threshold.
    deltaTime = deltaTime > _DELTA_TIME_UPPER_THRESHOLD ?
        _DELTA_TIME_UPPER_THRESHOLD : deltaTime;

    if (!this._isPaused) {
      this._requestAnimationFrameId =
          window.requestAnimationFrame(currentTime => this._animationLoop(currentTime));
      this._updateJobs(currentTime, deltaTime);
      this._drawJobs();
    }
  }

  /**
   * Updates all of the active AnimationJobs.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   * @private
   */
  _updateJobs(currentTime, deltaTime) {
    for (let i = 0, count = this._jobs.length; i < count; i++) {
      let job = this._jobs[i];

      // Remove jobs from the list after they are complete.
      if (job.isComplete) {
        this._removeJob(job, i);
        i--;
        count--;
        continue;
      }

      // Check whether the job is transient and has reached its end.
      if (job instanceof TransientAnimationJob && job.endTime < currentTime) {
        job.finish(false);
      } else {
        job.update(currentTime, deltaTime);
      }
    }
  }

  /**
   * Removes the given job from the collection of active, animating jobs.
   *
   * @param {AnimationJob} job
   * @param {number} [index=-1]
   * @private
   */
  _removeJob(job, index = -1) {
    console.debug(`Removing AnimationJob: ${job.constructor.name}`);

    if (index >= 0) {
      this._jobs.splice(index, 1);
    } else {
      const count = this._jobs.length;
      for (index = 0; index < count; index++) {
        if (this._jobs[index] === job) {
          this._jobs.splice(index, 1);
          break;
        }
      }
    }

    // Stop the animation loop when there are no more jobs to animate.
    if (this._jobs.length === 0) {
      this._stopAnimationLoop();
    }
  }

  /**
   * Draws all of the active AnimationJobs.
   *
   * @private
   */
  _drawJobs() {
    for (let i = 0, count = this._jobs.length; i < count; i++) {
      this._jobs[i].draw();
    }
  }

  /**
   * Starts the animation loop if it is not already running.
   *
   * This method is idempotent.
   *
   * @private
   */
  _startAnimationLoop() {
    if (this._isPaused) {
      this._lastUnpauseTime = window.performance.now();
    }
    this._isPaused = false;

    // Only actually start the loop if it isn't already running and the page has focus.
    if (!this._requestAnimationFrameId && !document.hidden) {
      this._latencyProfiler.start();
      this._previousTime = window.performance.now();
      this._requestAnimationFrameId =
          window.requestAnimationFrame(time => this._animationLoop(time));
    }
  }

  /**
   * Stops the animation loop.
   *
   * @private
   */
  _stopAnimationLoop() {
    if (!this._isPaused) {
      this._totalUnpausedRunTime += this._timeSinceLastPaused;
    }
    this._isPaused = true;
    window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._requestAnimationFrameId = null;
    this._latencyProfiler.stop();
  }

  /**
   * Creates a promise that will resolve on the next animation loop.
   *
   * @returns {Promise}
   */
  resolveOnNextFrame() {
    return new Promise(window.requestAnimationFrame);
  }

  /**
   * Gets the total amount of time the animator has been running while not paused.
   *
   * @returns {DOMHighResTimeStamp}
   */
  get totalRunTime() {
    return this._isPaused
        ? this._totalUnpausedRunTime
        : this._totalUnpausedRunTime + this._timeSinceLastPaused;
  }

  /**
   * @returns {DOMHighResTimeStamp}
   */
  get _timeSinceLastPaused() {
    return window.performance.now() - this._lastUnpauseTime;
  }
}

const animator = new Animator();

export {animator};

/**
 * @typedef {number} DOMHighResTimeStamp A number of milliseconds, accurate to one thousandth of a
 * millisecond.
 */

