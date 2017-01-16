# Turnpike

A minimal [finite-state
machine](https://en.wikipedia.org/wiki/Finite-state_machine) for JavaScript.

## Installation

```bash
$ npm install turnpike-sm --save
```

## Usage

Defining state transitions:

```javascript
const Turnpike = require('turnpike');

const turnpike = new Turnpike('asleep', [
  { name: 'bother', from: 'asleep', to: 'awake' },
  { name: 'bother', from: 'awake', to: 'bothered' },
  { name: 'rest', from: 'jumping', to: 'asleep' },
  { name: 'jump', from: Turnpike.ANY, to: 'jumping' }
]);
```

The special value `Turnpike.ANY` will match any `from` state.

Turnpike is an [EventEmitter](https://nodejs.org/api/events.html) and provides
several events on each state transition:

```javascript
turnpike.on('exit:asleep', (...args) => {
  console.log('Sleep over', args);
});

turnpike.on('exit', (stateName, ...args) => {
  console.log(`Exiting ${stateName} with args:`, args);
});

turnpike.on('enter', (stateName, ...args) => {
  console.log(`Entering ${stateName} with args:`, args);
});

turnpike.on('enter:jumping', (height, speed) => {
  console.log(`Started jumping, height: ${height}, speed: ${speed}`);
});

turnpike.act('jump', 12, 'fast');
```

## Testing / Linting

```
$ npm test
$ npm run lint
```

## Migrating from 0.x to 1.x

A few minor breaking changes:

- Initial state is now a separate argument.
- `ev` was renamed to `name` in the event definition.
- Now uses EventEmitter syntax (`on('event', ...)`) rather than bespoke
  `onEnter` / `onExit` handlers.
- No more browser build provided - you should be bundling that yourself.

## License

MIT
