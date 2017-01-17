'use strict';

const ANY = Symbol('ANY');

function assert(bool, message) {
  if (!bool) throw new Error(message);
}

function validateDefinition(events) {
  assert(events instanceof Array, 'Events must be an array');

  events.forEach((event) => {
    assert(typeof event.name === 'string', 'Each event name must be a string');

    assert(
      typeof event.from === 'string' || event.from === ANY,
      'Each `from` event name must be a string or ANY'
    );

    assert(typeof event.to === 'string', 'Each `to` event name must be a string');
  });
}

class Turnpike {
  /**
   * @param {String} initialState The initial state
   * @param {Array} events Event definitions, in the format:
   *   [
   *     { name: 'shake', from: 'asleep', to: 'awake' },
   *     { name: 'shake', from: 'awake', to: 'shaken' },
   *     { name: 'rest', from: Turnpike.ANY, to: 'asleep' }
   *   ]
   *
   * (The special value Turnpike.ANY will match any event)
   *
   * Definitions will be run in the order defined and all against the same
   * initial state; if multiple match, the last one that matches the original
   * `from` value will be used.
   *
   * @param {Object} opts Additional options. Currently supports:
   *   `EventEmitter`: An EventEmitter class to use instead of `require('events')`
   */
  constructor(initialState, events, opts = {}) {
    assert(typeof initialState === 'string', 'Initial state must be a string');

    validateDefinition(events);

    // eslint-disable-next-line global-require
    const EventEmitter = opts.EventEmitter || require('events');
    this._emitter = new EventEmitter();

    this.on = this._emitter.on.bind(this._emitter);

    this._state = initialState;
    this._events = events;
  }

  /**
   * Perform an action. Any further arguments past the first will be provided to
   * all callbacks.
   *
   * @param {String} actionName An action to be performed. Should probably
   * correspond to a `name` in the initial events definition if you want it to
   * have an effect.
   */
  act(actionName, ...args) {
    const previousState = this._state;
    let newState = this._state;

    this._events.forEach((event) => {
      const matchesFrom = (event.from === ANY || event.from === previousState);

      if (event.name === actionName && matchesFrom) {
        newState = event.to;
      }
    });

    if (newState !== this._state) {
      // Technically 'beforeExit' / 'afterEnter'... open to adding more
      // lifecycle events here if anyone has a use case for them.
      this._emitter.emit('exit', previousState, ...args);
      this._emitter.emit(`exit:${previousState}`, ...args);

      this._state = newState;

      this._emitter.emit('enter', newState, ...args);
      this._emitter.emit(`enter:${newState}`, ...args);
    }
  }

  /**
    * @returns {String} state
    */
  getState() {
    return this._state;
  }
}

Turnpike.ANY = ANY;

module.exports = Turnpike;
