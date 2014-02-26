(function() {
  var Declaration, Node, vendor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Node = require('./node');

  vendor = require('./vendor');

  Declaration = (function(_super) {
    __extends(Declaration, _super);

    function Declaration() {
      this.type = 'decl';
      Declaration.__super__.constructor.apply(this, arguments);
    }

    Declaration.raw('value');

    Declaration.prototype.stringify = function(builder, semicolon) {
      var string;
      if (this.before) {
        builder(this.before);
      }
      string = this.prop + (this.between || '') + ':' + this._value.stringify({
        before: ' '
      });
      if (semicolon) {
        string += ';';
      }
      return builder(string, this);
    };

    Declaration.prototype.removeSelf = function() {
      if (!this.parent) {
        return;
      }
      this.parent.remove(this);
      return this;
    };

    Declaration.prototype.clone = function(obj) {
      var cloned;
      cloned = Declaration.__super__.clone.apply(this, arguments);
      delete cloned.before;
      return cloned;
    };

    return Declaration;

  })(Node);

  module.exports = Declaration;

}).call(this);
