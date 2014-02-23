(function() {
  var Turnpike, old, root,
    __slice = [].slice;

  Turnpike = (function() {
    function Turnpike(_arg) {
      var events, start;
      start = _arg.start, events = _arg.events;
      this._state = start;
      this._events = events;
    }

    Turnpike.prototype._enterCallbacks = [];

    Turnpike.prototype._exitCallbacks = [];

    Turnpike.prototype.act = function() {
      var args, call, destination, ev, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      ev = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      destination = (_ref = this._events.filter((function(_this) {
        return function(t) {
          var _ref1;
          return t.ev === ev && ((_ref1 = t.from) === _this._state || _ref1 === '*');
        };
      })(this))[0]) != null ? _ref.to : void 0;
      if (!(destination && destination !== this._state)) {
        return false;
      }
      _ref1 = this._exitCallbacks.filter((function(_this) {
        return function(i) {
          return i.state === _this._state;
        };
      })(this));
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        call = _ref1[_i];
        call.cb.apply(call, args);
      }
      _ref2 = this._enterCallbacks.filter((function(_this) {
        return function(i) {
          return i.state === destination;
        };
      })(this));
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        call = _ref2[_j];
        call.cb.apply(call, args);
      }
      return this._state = destination;
    };

    Turnpike.prototype.onEnter = function(state, cb) {
      return this._enterCallbacks.push({
        state: state,
        cb: cb
      });
    };

    Turnpike.prototype.onExit = function(state, cb) {
      return this._exitCallbacks.push({
        state: state,
        cb: cb
      });
    };

    Turnpike.prototype.getState = function() {
      return this._state;
    };

    return Turnpike;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = Turnpike;
  } else if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
    define('turnpike', [], Turnpike);
  } else {
    root = this;
    old = root.Turnpike;
    root.Turnpike = Turnpike;
    Turnpike.noConflict = function() {
      return root.Turnpike = old;
    };
  }

}).call(this);
