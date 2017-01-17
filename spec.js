'use strict';

const tape = require('tape');
const Turnpike = require('./index');

let turnpike;

function beforeEach() {
  turnpike = new Turnpike('asleep', [
    { name: 'bother', from: 'asleep', to: 'awake' },
    { name: 'bother', from: 'awake', to: 'shouldntgethere' },
    { name: 'bother', from: 'awake', to: 'bothered' },
    { name: 'rest', from: 'jumping', to: 'asleep' },
    { name: 'jump', from: Turnpike.ANY, to: 'jumping' }
  ]);
}

function it(description, cb) {
  tape(description, (t) => {
    beforeEach();
    cb(t);
  });
}

it('sets initial state correctly', (t) => {
  t.plan(1);
  t.equal(turnpike.getState(), 'asleep');
});

it('transitions between states correctly', (t) => {
  t.plan(6);

  turnpike.act('bother');
  t.equal(turnpike.getState(), 'awake');

  turnpike.act('bother');
  t.equal(turnpike.getState(), 'bothered');

  turnpike.act('rest'); // No effect
  t.equal(turnpike.getState(), 'bothered');

  turnpike.act('jump');
  t.equal(turnpike.getState(), 'jumping');

  turnpike.act('jump');
  t.equal(turnpike.getState(), 'jumping');

  turnpike.act('rest');
  t.equal(turnpike.getState(), 'asleep');
});

function runTransitionActions() {
  // Transition from asleep -> awake
  turnpike.act('bother', 1, { shouldWork: true });

  // Transition from awake -> jumping
  turnpike.act('jump', 2, { shouldWork: true });

  // No transition - should not be logged
  turnpike.act('jump', 3, { shouldWork: false });
  turnpike.act('foozbuz', 4, { shouldWork: false });

  // Transition to 'asleep' and back to 'jumping'
  turnpike.act('rest', 5, { shouldWork: true });
  turnpike.act('jump', 6, { shouldWork: true });
}

it('emits `enter` with correct data', (t) => {
  t.plan(2);

  const jumpArgs = [];
  const anyArgs = [];

  turnpike.on('enter:jumping', (...args) => jumpArgs.push(args));
  turnpike.on('enter', (stateName, ...args) => anyArgs.push(args));

  runTransitionActions(turnpike);

  t.deepEqual(anyArgs, [
    [1, { shouldWork: true }],
    [2, { shouldWork: true }],
    [5, { shouldWork: true }],
    [6, { shouldWork: true }]
  ]);

  t.deepEqual(jumpArgs, [
    [2, { shouldWork: true }],
    [6, { shouldWork: true }]
  ]);
});

it('emits `exit` with correct data', (t) => {
  t.plan(2);

  const asleepArgs = [];
  const anyArgs = [];

  turnpike.on('exit:asleep', (...args) => asleepArgs.push(args));
  turnpike.on('exit', (stateName, ...args) => anyArgs.push(args));

  runTransitionActions(turnpike);

  t.deepEqual(anyArgs, [
    [1, { shouldWork: true }],
    [2, { shouldWork: true }],
    [5, { shouldWork: true }],
    [6, { shouldWork: true }]
  ]);

  t.deepEqual(asleepArgs, [
    [1, { shouldWork: true }],
    [6, { shouldWork: true }]
  ]);
});

it('allows alternative EventEmitter to be provided', (t) => {
  t.plan(1);

  const logs = [];

  /* eslint-disable class-methods-use-this */
  class BadEmitter {
    emit(...args) {
      logs.push(args);
    }
    on() {}
  }
  /* eslint-enable class-methods-use-this */

  const tp2 = new Turnpike(
    'asleep',
    [
      { name: 'bother', from: 'asleep', to: 'awake' }
    ],
    { EventEmitter: BadEmitter }
  );

  tp2.act('bother');

  t.deepEqual(logs, [
    ['exit', 'asleep'],
    ['exit:asleep'],
    ['enter', 'awake'],
    ['enter:awake']
  ]);
});
