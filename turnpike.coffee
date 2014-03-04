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

  _normalizeListeners: (name, cb) ->
    if typeof name == 'object'
      return Object.keys(name).map (k) -> { state: k, cb: name[k] }
    else return [{ state: name, cb }]

  onEnter: (name, cb) ->
    @_enterCallbacks = @_enterCallbacks.concat @_normalizeListeners name, cb

  onExit: (name, cb) ->
    @_exitCallbacks = @_exitCallbacks.concat @_normalizeListeners name, cb

  getState: -> @_state

if module?.exports
  module.exports = Turnpike

else if define?.amd
  define -> Turnpike

else
  root = @
  old = root.Turnpike
  root.Turnpike = Turnpike
  Turnpike.noConflict = -> root.Turnpike = old
