class Turnpike

  # OK for JSON objects, not good for anything with internal methods.
  isEqual = (o1, o2) ->
    return true if o1 == o2
    if o1 instanceof Object && o2 instanceof Object
      o1Keys = Object.keys o1
      o2Keys = Object.keys o2
      return o1Keys.sort().join() == o2Keys.sort().join() && o1Keys.every (k) ->
        return isEqual o1[k], o2[k]
    else
      return false

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

    for call in @_exitCallbacks.filter((i) => isEqual i.state, @_state)
      call.cb args...

    for call in @_enterCallbacks.filter((i) => isEqual i.state, destination)
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

