/**
 * This class keeps track of avg/min/max frame latencies over the last logging time period and
 * periodically logs these values.
 */
class FrameLatencyProfiler {
  /**
   * @param {number} logPeriod The period at which to print latency log messages. In milliseconds.
   * @param {number} latencyWarningThreshold If the average latency exceeds this threshold, then the
   * log message is shown as a warning. In milliseconds.
   * @param {string} logLabel A label to show for each latency log message.
   */
  constructor(logPeriod, latencyWarningThreshold, logLabel) {
    this._logPeriod = logPeriod;
    this._latencyWarningThreshold = latencyWarningThreshold;
    this._logLabel = logLabel;

    this._frameCount = null;
    this._maxFrameLatency = null;
    this._minFrameLatency = null;
    this._avgFrameLatency = null;

    this._intervalId = null;
  }

  start() {
    this.stop();
    this.reset();

    this._intervalId = setInterval(() => {
      this.logFrameLatency();
      this.reset();
    }, this._logPeriod);
  }

  stop() {
    clearInterval(this._intervalId);
  }

  reset() {
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
  recordFrameLatency(frameLatency) {
    this._frameCount++;
    this._maxFrameLatency =
        this._maxFrameLatency < frameLatency ? frameLatency : this._maxFrameLatency;
    this._minFrameLatency =
        this._minFrameLatency > frameLatency ? frameLatency : this._minFrameLatency;
    this._avgFrameLatency =
        this._avgFrameLatency + (frameLatency - this._avgFrameLatency) / this._frameCount;
  }

  logFrameLatency() {
    if (this._frameCount > 0) {
      const message = `${this._logLabel}:  AVG=${this._avgFrameLatency.toFixed(3)}  ` +
          `(MAX=${this._maxFrameLatency.toFixed(3)}; MIN=${this._minFrameLatency.toFixed(3)})`;
      if (this._maxFrameLatency >= this._latencyWarningThreshold) {
        console.warn(message);
      } else {
        console.debug(message);
      }
    }
  }
}

export {FrameLatencyProfiler};
