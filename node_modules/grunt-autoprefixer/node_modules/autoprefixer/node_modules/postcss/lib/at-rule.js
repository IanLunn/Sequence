(function() {
  var AtRule, Container, name, _fn, _i, _len, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Container = require('./container');

  AtRule = (function(_super) {
    __extends(AtRule, _super);

    function AtRule() {
      this.type = 'atrule';
      AtRule.__super__.constructor.apply(this, arguments);
    }

    AtRule.prototype.addMixin = function(type) {
      var mixin, name, value, _ref;
      mixin = type === 'rules' ? Container.WithRules : Container.WithDecls;
      if (!mixin) {
        return;
      }
      _ref = mixin.prototype;
      for (name in _ref) {
        value = _ref[name];
        if (name === 'constructor') {
          continue;
        }
        this[name] = value;
      }
      return mixin.apply(this);
    };

    AtRule.raw('params');

    AtRule.prototype.stringify = function(builder, last) {
      var params, semicolon;
      if (this.rules || this.decls) {
        params = this._params.stringify({
          before: ' ',
          after: ' '
        });
        return this.stringifyBlock(builder, '@' + this.name + params + '{');
      } else {
        if (this.before) {
          builder(this.before);
        }
        semicolon = !last || this.semicolon ? ';' : '';
        return builder('@' + this.name + this._params.stringify({
          before: ' '
        }) + semicolon, this);
      }
    };

    return AtRule;

  })(Container);

  _ref = ['append', 'prepend'];
  _fn = function(name) {
    return AtRule.prototype[name] = function(child) {
      this.addMixin(child.type + 's');
      return this[name](child);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    _fn(name);
  }

  module.exports = AtRule;

}).call(this);
