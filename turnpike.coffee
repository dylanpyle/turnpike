class Turnpike

  constructor: ({ start, events }) ->
    @_state = start
    @_events = events
    @_enterCallbacks = []
    @_exitCallbacks = []

  act: (ev, args...) ->
    destination = @_events.filter((t) =>
      t.ev == ev && t.from in [@_state, '*']
    )[0]?.to

    return false unless destination && destination != @_state

    for call in @_exitCallbacks.filter((i) => i.state == @_state)
      call.cb args...

    for call in @_enterCallbacks.filter((i) => i.state == destination)
      call.cb args...

    @_state = destination

  onEnter: (state, cb) ->
    @_enterCallbacks.push { state, cb }

  onExit: (state, cb) ->
    @_exitCallbacks.push { state, cb }

  getState: -> @_state

if module?.exports
  module.exports = Turnpike

else if define?.amd
  define 'turnpike', [], Turnpike

else
  root = @
  old = root.Turnpike
  root.Turnpike = Turnpike
  Turnpike.noConflict = -> root.Turnpike = old
