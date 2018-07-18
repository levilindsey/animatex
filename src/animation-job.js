/**
 * An AnimationJob is used with the animator controller to update and re-draw something each frame.
 *
 * @abstract
 */
class AnimationJob {
  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  constructor(onComplete) {
    // AnimationJob is an abstract class. It should not be instantiated directly.
    if (new.target === AnimationJob) {
      throw new TypeError('Cannot construct AnimationJob instances directly');
    }

    this._startTime = 0;
    this._isComplete = true;
    this._onComplete = onComplete;
  }

  /**
   * Indicates whether this AnimationJob is complete.
   *
   * @return {boolean}
   */
  get isComplete() {
    return this._isComplete;
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @param {DOMHighResTimeStamp} startTime
   */
  start(startTime) {
    this._startTime = startTime;
    this._isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * This is called from the overall animation loop.
   *
   * @param {DOMHighResTimeStamp} currentTime
   * @param {DOMHighResTimeStamp} deltaTime
   * @abstract
   */
  update(currentTime, deltaTime) {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * This is called from the overall animation loop.
   *
   * @abstract
   */
  draw() {
    // Extending classes should implement this method.
    throw new TypeError('Method not implemented');
  }

  /**
   * Handles any necessary state for this AnimationJob being finished.
   *
   * @param {boolean} isCancelled
   */
  finish(isCancelled) {
    console.log(`${this.constructor.name} ${isCancelled ? 'cancelled' : 'completed'}`);

    this._isComplete = true;

    if (this._onComplete) {
      this._onComplete();
    }
  }
}

export {AnimationJob};
