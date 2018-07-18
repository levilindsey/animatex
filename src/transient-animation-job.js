import {_util} from './util';

import {AnimationJob} from './animation-job';

/**
 * A TransientAnimationJob is temporary and has a definite beginning and end.
 *
 * @abstract
 */
class TransientAnimationJob extends AnimationJob {
  /**
   * @param {number} duration
   * @param {number} delay
   * @param {Function|String} easingFunction
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  constructor(duration, delay, easingFunction, onComplete) {
    super(onComplete);

    // TransientAnimationJob is an abstract class. It should not be instantiated directly.
    if (new.target === TransientAnimationJob) {
      throw new TypeError('Cannot construct TransientAnimationJob instances directly');
    }

    this._duration = duration;
    this._delay = delay;
    this._easingFunction = typeof easingFunction === 'function'
        ? easingFunction
        : _util.easingFunctions[easingFunction];
  }

  /**
   * @returns {number}
   */
  get endTime() {
    return this._startTime + this._duration + this._delay;
  }
}

export {TransientAnimationJob};
