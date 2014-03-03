Turnpike = require '../turnpike'
sinon = require 'sinon'
require('chai').should()

describe 'Turnpike', ->
  sm = null

  beforeEach ->
    sm = new Turnpike
      start: 'asleep'
      events: [
        { ev: 'poke', from: 'asleep', to: 'awake' }
        { ev: 'poke', from: 'awake', to: 'annoyed' }
        { ev: 'rest', from: 'annoyed', to: 'awake' }
        { ev: 'chill', from: 'annoyed', to: 'asleep' }
        { ev: 'rest', from: 'awake', to: 'asleep' }
        { ev: 'goWild', from: '*', to: 'wilding' }
      ]

  it 'should be in the initial state', ->
    sm.getState().should.eq 'asleep'

  it 'should transition when acted upon', ->
    sm.act 'poke'
    sm.getState().should.eq 'awake'

  it 'should transition when acted upon multiple times', ->
    sm.act 'poke'
    sm.act 'poke'
    sm.getState().should.eq 'annoyed'

  it 'should handle long sets of actions', ->
    states = []
    sm.act 'poke' # awake
    states.push sm.getState()
    sm.act 'rest' # asleep
    states.push sm.getState()
    sm.act 'poke' # awake
    states.push sm.getState()
    sm.act 'poke' # annoyed
    states.push sm.getState()
    sm.act 'chill' # asleep
    states.push sm.getState()

    states.should.deep.eq ['awake', 'asleep', 'awake', 'annoyed', 'asleep']

  it 'should not transition when given an invalid action', ->
    sm.act 'madeup'
    sm.getState().should.eq 'asleep'

  it 'should support wildcards', ->
    sm.act 'goWild'
    sm.getState().should.eq 'wilding'

  it 'should call onEnter callback', ->
    cb = sinon.stub()
    sm.onEnter 'awake', cb
    sm.act 'poke'
    cb.called.should.be.true

  it 'should call onExit callback', ->
    cb = sinon.stub()
    sm.onExit 'asleep', cb
    sm.act 'poke'
    cb.called.should.be.true

  it 'should call object-formatted callbacks', ->
    cb = sinon.stub()
    sm.onExit asleep: cb
    sm.act 'poke'
    cb.called.should.be.true

  it 'should not transition if state doesnt change', ->
    cb = sinon.stub()
    sm.onExit 'wilding', cb
    sm.act 'goWild'
    sm.act 'goWild'
    cb.called.should.be.false

  it 'should include arguments', ->
    cb = sinon.stub()
    sm.onEnter 'awake', cb
    sm.act 'poke', 1, 2, 3
    cb.firstCall.args.should.deep.eq [1,2,3]

  it 'should call multiple callbacks', ->
    cb1 = sinon.stub()
    cb2 = sinon.stub()
    sm.onEnter 'awake', cb1
    sm.onEnter 'awake', cb2
    sm.act 'poke'
    cb1.called.should.be.true
    cb2.called.should.be.true

  it 'should not call other instance\'s callbacks', ->
    sm2 = new Turnpike
      start: 'asleep'
      events: [
        { ev: 'poke', from: 'asleep', to: 'awake' }
      ]

    cb1 = sinon.stub()
    cb2 = sinon.stub()
    sm.onEnter 'awake', cb1
    sm2.onEnter 'awake', cb2
    sm.act 'poke'
    cb1.called.should.be.true
    cb2.called.should.be.false

