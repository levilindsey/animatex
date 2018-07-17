import {AnimationJob} from './animation-job';

/**
 * A PersistentAnimationJob recurs or has an indefinite duration.
 *
 * @abstract
 */
class PersistentAnimationJob extends AnimationJob {
  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  constructor(onComplete) {
    super(onComplete);

    // PersistentAnimationJob is an abstract class. It should not be instantiated directly.
    if (new.target === PersistentAnimationJob) {
      throw new TypeError('Cannot construct PersistentAnimationJob instances directly');
    }
  }

  /**
   * @abstract
   */
  reset() {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }
}

export {PersistentAnimationJob};
