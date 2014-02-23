# turnpike

A minimal [finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) for JavaScript.

## Usage

To instantiate a new state machine:

    var state = new Turnpike({
      start: 'asleep',
      events: [
        { ev: 'shake', from: 'asleep', to: 'awake' },
        { ev: 'shake', from: 'awake', to: 'shaken' },
        { ev: 'rest', from: 'shaken', to: 'asleep' }
      ]
    });

**Note:** You can also use a wildcard (`*`) `from` value to match any state.

Define state/enter exit transition callbacks:

    state.onExit('asleep', function(){ console.log('Woke up'); });
    state.onEnter('shaken', function(){ console.log('Got shook'); });

And use the `act` method to trigger events:

    state.act('shake'); // -> 'Woke up'
    state.act('shake'); // -> 'Got shook'

**Note:** Any further arguments given to `act` will be passed through to any callbacks.

To retrieve the current state:

    state.getState(); // -> 'shaken'

## Testing and building

    $ npm install
    $ gulp test
    $ gulp build

## License

MIT

## Credits

Constructor syntax loosely inspired by [jakesgordon](https://github.com/jakesgordon/javascript-state-machine)
