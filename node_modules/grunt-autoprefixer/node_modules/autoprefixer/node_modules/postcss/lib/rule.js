(function() {
  var Container, Declaration, Rule,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Container = require('./container');

  Declaration = require('./declaration');

  Rule = (function(_super) {
    __extends(Rule, _super);

    function Rule() {
      this.type = 'rule';
      Rule.__super__.constructor.apply(this, arguments);
    }

    Rule.raw('selector');

    Rule.prototype.stringify = function(builder) {
      return this.stringifyBlock(builder, this._selector.stringify({
        after: ' '
      }) + '{');
    };

    return Rule;

  })(Container.WithDecls);

  module.exports = Rule;

}).call(this);
