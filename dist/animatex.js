(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animationJob = require('./src/animation-job');

Object.keys(_animationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animationJob[key];
    }
  });
});

var _animator = require('./src/animator');

Object.keys(_animator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _animator[key];
    }
  });
});

var _frameLatencyProfiler = require('./src/frame-latency-profiler');

Object.keys(_frameLatencyProfiler).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _frameLatencyProfiler[key];
    }
  });
});

var _persistentAnimationJob = require('./src/persistent-animation-job');

Object.keys(_persistentAnimationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _persistentAnimationJob[key];
    }
  });
});

var _transientAnimationJob = require('./src/transient-animation-job');

Object.keys(_transientAnimationJob).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _transientAnimationJob[key];
    }
  });
});

},{"./src/animation-job":2,"./src/animator":3,"./src/frame-latency-profiler":4,"./src/persistent-animation-job":5,"./src/transient-animation-job":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * An AnimationJob is used with the animator controller to update and re-draw something each frame.
 *
 * @abstract
 */
var AnimationJob = function () {
  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function AnimationJob(onComplete) {
    _classCallCheck(this, AnimationJob);

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

  _createClass(AnimationJob, [{
    key: 'start',

    /**
     * Sets this AnimationJob as started.
     *
     * @param {DOMHighResTimeStamp} startTime
     */
    value: function start(startTime) {
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

  }, {
    key: 'update',
    value: function update(currentTime, deltaTime) {
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

  }, {
    key: 'draw',
    value: function draw() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }

    /**
     * Handles any necessary state for this AnimationJob being finished.
     *
     * @param {boolean} isCancelled
     */

  }, {
    key: 'finish',
    value: function finish(isCancelled) {
      console.log(this.constructor.name + ' ' + (isCancelled ? 'cancelled' : 'completed'));

      this._isComplete = true;

      if (this._onComplete) {
        this._onComplete();
      }
    }
  }, {
    key: 'isComplete',
    get: function get() {
      return this._isComplete;
    }
  }]);

  return AnimationJob;
}();

exports.AnimationJob = AnimationJob;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animator = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _frameLatencyProfiler = require('./frame-latency-profiler');

var _persistentAnimationJob = require('./persistent-animation-job');

var _transientAnimationJob = require('./transient-animation-job');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var _DELTA_TIME_UPPER_THRESHOLD = 200;
var _FRAME_DURATION_WARNING_THRESHOLD = 1000 / 30;
var _FRAME_LATENCY_LOG_PERIOD = 5000;
var _LATENCY_LOG_LABEL = 'Animation frame period';

/**
 * This class handles the animation loop.
 *
 * This class's responsibilities include:
 * - updating modules for the current frame,
 * - drawing renderables for the current frame,
 * - starting and stopping transient animation jobs,
 * - capping time step durations at a max threshold.
 */

var Animator = function () {
  function Animator() {
    _classCallCheck(this, Animator);

    this._jobs = [];
    this._previousTime = null;
    this._isPaused = true;
    this._requestAnimationFrameId = null;
    this._totalUnpausedRunTime = 0;
    this._lastUnpauseTime = null;
    this._latencyProfiler = new _frameLatencyProfiler.FrameLatencyProfiler(_FRAME_LATENCY_LOG_PERIOD, _FRAME_DURATION_WARNING_THRESHOLD, _LATENCY_LOG_LABEL);
  }

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */

  _createClass(Animator, [{
    key: 'startJob',
    value: function startJob(job) {
      // Is this a restart?
      if (!job.isComplete) {
        console.debug('Restarting AnimationJob: ' + job.constructor.name);

        if (job instanceof _persistentAnimationJob.PersistentAnimationJob) {
          job.reset();
        } else {
          job.finish(true);
          job.start(window.performance.now());
        }
      } else {
        console.debug('Starting AnimationJob: ' + job.constructor.name);

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

  }, {
    key: 'cancelJob',
    value: function cancelJob(job) {
      console.debug('Cancelling AnimationJob: ' + job.constructor.name);
      job.finish(true);
    }

    /**
     * Cancels all running AnimationJobs.
     */

  }, {
    key: 'cancelAll',
    value: function cancelAll() {
      while (this._jobs.length) {
        this.cancelJob(this._jobs[0]);
      }
    }

    /** @returns {DOMHighResTimeStamp} */

  }, {
    key: 'pause',
    value: function pause() {
      this._stopAnimationLoop();
      console.debug('Animator paused');
    }
  }, {
    key: 'unpause',
    value: function unpause() {
      this._startAnimationLoop();
      console.debug('Animator unpaused');
    }

    /**
     * This is the animation loop that drives all of the animation.
     *
     * @param {DOMHighResTimeStamp} currentTime
     * @private
     */

  }, {
    key: '_animationLoop',
    value: function _animationLoop(currentTime) {
      var _this = this;

      // When pausing and restarting, it's possible for the previous time to be slightly inconsistent
      // with the animationFrame time.
      if (currentTime < this._previousTime) {
        this._previousTime = currentTime - 1;
      }

      var deltaTime = currentTime - this._previousTime;
      this._previousTime = currentTime;

      this._latencyProfiler.recordFrameLatency(deltaTime);

      // Large delays between frames can cause lead to instability in the system, so this caps them to
      // a max threshold.
      deltaTime = deltaTime > _DELTA_TIME_UPPER_THRESHOLD ? _DELTA_TIME_UPPER_THRESHOLD : deltaTime;

      if (!this._isPaused) {
        this._requestAnimationFrameId = window.requestAnimationFrame(function (currentTime) {
          return _this._animationLoop(currentTime);
        });
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

  }, {
    key: '_updateJobs',
    value: function _updateJobs(currentTime, deltaTime) {
      for (var i = 0, count = this._jobs.length; i < count; i++) {
        var job = this._jobs[i];

        // Remove jobs from the list after they are complete.
        if (job.isComplete) {
          this._removeJob(job, i);
          i--;
          count--;
          continue;
        }

        // Check whether the job is transient and has reached its end.
        if (job instanceof _transientAnimationJob.TransientAnimationJob && job.endTime < currentTime) {
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

  }, {
    key: '_removeJob',
    value: function _removeJob(job) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      console.debug('Removing AnimationJob: ' + job.constructor.name);

      if (index >= 0) {
        this._jobs.splice(index, 1);
      } else {
        var count = this._jobs.length;
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

  }, {
    key: '_drawJobs',
    value: function _drawJobs() {
      for (var i = 0, count = this._jobs.length; i < count; i++) {
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

  }, {
    key: '_startAnimationLoop',
    value: function _startAnimationLoop() {
      var _this2 = this;

      if (this._isPaused) {
        this._lastUnpauseTime = window.performance.now();
      }
      this._isPaused = false;

      // Only actually start the loop if it isn't already running and the page has focus.
      if (!this._requestAnimationFrameId && !document.hidden) {
        this._latencyProfiler.start();
        this._previousTime = window.performance.now();
        this._requestAnimationFrameId = window.requestAnimationFrame(function (time) {
          return _this2._animationLoop(time);
        });
      }
    }

    /**
     * Stops the animation loop.
     *
     * @private
     */

  }, {
    key: '_stopAnimationLoop',
    value: function _stopAnimationLoop() {
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

  }, {
    key: 'resolveOnNextFrame',
    value: function resolveOnNextFrame() {
      return new Promise(window.requestAnimationFrame);
    }

    /**
     * Gets the total amount of time the animator has been running while not paused.
     *
     * @returns {DOMHighResTimeStamp}
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._previousTime;
    }

    /** @returns {boolean} */

  }, {
    key: 'isPaused',
    get: function get() {
      return this._isPaused;
    }
  }, {
    key: 'totalRunTime',
    get: function get() {
      return this._isPaused ? this._totalUnpausedRunTime : this._totalUnpausedRunTime + this._timeSinceLastPaused;
    }

    /**
     * @returns {DOMHighResTimeStamp}
     */

  }, {
    key: '_timeSinceLastPaused',
    get: function get() {
      return window.performance.now() - this._lastUnpauseTime;
    }
  }]);

  return Animator;
}();

var animator = new Animator();

exports.animator = animator;

/**
 * @typedef {number} DOMHighResTimeStamp A number of milliseconds, accurate to one thousandth of a
 * millisecond.
 */

},{"./frame-latency-profiler":4,"./persistent-animation-job":5,"./transient-animation-job":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * This class keeps track of avg/min/max frame latencies over the last logging time period and
 * periodically logs these values.
 */
var FrameLatencyProfiler = function () {
  /**
   * @param {number} logPeriod The period at which to print latency log messages. In milliseconds.
   * @param {number} latencyWarningThreshold If the average latency exceeds this threshold, then the
   * log message is shown as a warning. In milliseconds.
   * @param {string} logLabel A label to show for each latency log message.
   */
  function FrameLatencyProfiler(logPeriod, latencyWarningThreshold, logLabel) {
    _classCallCheck(this, FrameLatencyProfiler);

    this._logPeriod = logPeriod;
    this._latencyWarningThreshold = latencyWarningThreshold;
    this._logLabel = logLabel;

    this._frameCount = null;
    this._maxFrameLatency = null;
    this._minFrameLatency = null;
    this._avgFrameLatency = null;

    this._intervalId = null;
  }

  _createClass(FrameLatencyProfiler, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.stop();
      this.reset();

      this._intervalId = setInterval(function () {
        _this.logFrameLatency();
        _this.reset();
      }, this._logPeriod);
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this._intervalId);
    }
  }, {
    key: "reset",
    value: function reset() {
      this._frameCount = 0;
      this._maxFrameLatency = Number.MIN_VALUE;
      this._minFrameLatency = Number.MAX_VALUE;
      this._avgFrameLatency = 0;
    }

    /**
     * Keeps track of a running average, min value, and max value for the frame latencies.
     *
     * @param {DOMHighResTimeStamp} frameLatency
     */

  }, {
    key: "recordFrameLatency",
    value: function recordFrameLatency(frameLatency) {
      this._frameCount++;
      this._maxFrameLatency = this._maxFrameLatency < frameLatency ? frameLatency : this._maxFrameLatency;
      this._minFrameLatency = this._minFrameLatency > frameLatency ? frameLatency : this._minFrameLatency;
      this._avgFrameLatency = this._avgFrameLatency + (frameLatency - this._avgFrameLatency) / this._frameCount;
    }
  }, {
    key: "logFrameLatency",
    value: function logFrameLatency() {
      if (this._frameCount > 0) {
        var message = this._logLabel + ":  AVG=" + this._avgFrameLatency.toFixed(3) + "  " + ("(MAX=" + this._maxFrameLatency.toFixed(3) + "; MIN=" + this._minFrameLatency.toFixed(3) + ")");
        if (this._maxFrameLatency >= this._latencyWarningThreshold) {
          console.warn(message);
        } else {
          console.debug(message);
        }
      }
    }
  }]);

  return FrameLatencyProfiler;
}();

exports.FrameLatencyProfiler = FrameLatencyProfiler;

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PersistentAnimationJob = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _animationJob = require('./animation-job');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A PersistentAnimationJob recurs or has an indefinite duration.
 *
 * @abstract
 */
var PersistentAnimationJob = function (_AnimationJob) {
  _inherits(PersistentAnimationJob, _AnimationJob);

  /**
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function PersistentAnimationJob(onComplete) {
    _classCallCheck(this, PersistentAnimationJob);

    // PersistentAnimationJob is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (PersistentAnimationJob.__proto__ || Object.getPrototypeOf(PersistentAnimationJob)).call(this, onComplete));

    if (new.target === PersistentAnimationJob) {
      throw new TypeError('Cannot construct PersistentAnimationJob instances directly');
    }
    return _this;
  }

  /**
   * @abstract
   */

  _createClass(PersistentAnimationJob, [{
    key: 'reset',
    value: function reset() {
      // Extending classes should implement this method.
      throw new TypeError('Method not implemented');
    }
  }]);

  return PersistentAnimationJob;
}(_animationJob.AnimationJob);

exports.PersistentAnimationJob = PersistentAnimationJob;

},{"./animation-job":2}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransientAnimationJob = undefined;

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _util2 = require('./util');

var _animationJob = require('./animation-job');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * A TransientAnimationJob is temporary and has a definite beginning and end.
 *
 * @abstract
 */
var TransientAnimationJob = function (_AnimationJob) {
  _inherits(TransientAnimationJob, _AnimationJob);

  /**
   * @param {number} duration
   * @param {number} delay
   * @param {Function|String} easingFunction
   * @param {Function} [onComplete] A callback to be called when this AnimationJob is finished.
   */
  function TransientAnimationJob(duration, delay, easingFunction, onComplete) {
    _classCallCheck(this, TransientAnimationJob);

    // TransientAnimationJob is an abstract class. It should not be instantiated directly.
    var _this = _possibleConstructorReturn(this, (TransientAnimationJob.__proto__ || Object.getPrototypeOf(TransientAnimationJob)).call(this, onComplete));

    if (new.target === TransientAnimationJob) {
      throw new TypeError('Cannot construct TransientAnimationJob instances directly');
    }

    _this._duration = duration;
    _this._delay = delay;
    _this._easingFunction = typeof easingFunction === 'function' ? easingFunction : _util2._util.easingFunctions[easingFunction];
    return _this;
  }

  /**
   * @returns {number}
   */

  _createClass(TransientAnimationJob, [{
    key: 'endTime',
    get: function get() {
      return this._startTime + this._duration + this._delay;
    }
  }]);

  return TransientAnimationJob;
}(_animationJob.AnimationJob);

exports.TransientAnimationJob = TransientAnimationJob;

},{"./animation-job":2,"./util":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This module defines a collection of static utility functions.
 */

// A collection of different types of easing functions.
var easingFunctions = {
  linear: function linear(t) {
    return t;
  },
  easeInQuad: function easeInQuad(t) {
    return t * t;
  },
  easeOutQuad: function easeOutQuad(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic: function easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic: function easeOutCubic(t) {
    return 1 + --t * t * t;
  },
  easeInOutCubic: function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart: function easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart: function easeOutQuart(t) {
    return 1 - --t * t * t * t;
  },
  easeInOutQuart: function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  easeInQuint: function easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function easeOutQuint(t) {
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint: function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};

var _util = {
  easingFunctions: easingFunctions
};

exports._util = _util;

},{}]},{},[1])

//# sourceMappingURL=animatex.js.map
