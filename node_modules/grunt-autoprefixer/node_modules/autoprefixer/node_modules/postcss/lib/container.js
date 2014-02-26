(function() {
  var Container, Declaration, Node, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Node = require('./node');

  Declaration = require('./declaration');

  Container = (function(_super) {
    __extends(Container, _super);

    function Container() {
      _ref = Container.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Container.prototype.stringifyContent = function(builder) {
      var last,
        _this = this;
      if (!this.rules && !this.decls) {
        return;
      }
      if (this.rules) {
        last = this.rules.length - 1;
        return this.rules.map(function(rule, i) {
          return rule.stringify(builder, last === i);
        });
      } else if (this.decls) {
        last = this.decls.length - 1;
        return this.decls.map(function(decl, i) {
          return decl.stringify(builder, last !== i || _this.semicolon);
        });
      }
    };

    Container.prototype.stringifyBlock = function(builder, start) {
      if (this.before) {
        builder(this.before);
      }
      builder(start, this, 'start');
      this.stringifyContent(builder);
      if (this.after) {
        builder(this.after);
      }
      return builder('}', this, 'end');
    };

    Container.prototype.push = function(child) {
      child.parent = this;
      this.list.push(child);
      return this;
    };

    Container.prototype.each = function(callback) {
      var id, index, list;
      this.lastEach || (this.lastEach = 0);
      this.indexes || (this.indexes = {});
      this.lastEach += 1;
      id = this.lastEach;
      this.indexes[id] = 0;
      list = this.list;
      while (this.indexes[id] < list.length) {
        index = this.indexes[id];
        callback(list[index], index);
        this.indexes[id] += 1;
      }
      delete this.indexes[id];
      return this;
    };

    Container.prototype.eachDecl = function(callback) {};

    Container.prototype.append = function(child) {
      child = this.normalize(child, this.list[this.list.length - 1]);
      this.list.push(child);
      return this;
    };

    Container.prototype.prepend = function(child) {
      var id, index, _ref1;
      child = this.normalize(child, this.list[0], 'prepend');
      this.list.unshift(child);
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        this.indexes[id] = index + 1;
      }
      return this;
    };

    Container.prototype.insertBefore = function(exist, add) {
      var id, index, _ref1;
      exist = this.index(exist);
      add = this.normalize(add, this.list[exist], exist === 0 ? 'prepend' : void 0);
      this.list.splice(exist, 0, add);
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        if (index >= exist) {
          this.indexes[id] = index + 1;
        }
      }
      return this;
    };

    Container.prototype.insertAfter = function(exist, add) {
      var id, index, _ref1;
      exist = this.index(exist);
      add = this.normalize(add, this.list[exist]);
      this.list.splice(exist + 1, 0, add);
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        if (index > exist) {
          this.indexes[id] = index + 1;
        }
      }
      return this;
    };

    Container.prototype.remove = function(child) {
      var id, index, _ref1;
      child = this.index(child);
      this.list.splice(child, 1);
      _ref1 = this.indexes;
      for (id in _ref1) {
        index = _ref1[id];
        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }
      return this;
    };

    Container.prototype.every = function(condition) {
      return this.list.every(condition);
    };

    Container.prototype.some = function(condition) {
      return this.list.some(condition);
    };

    Container.prototype.index = function(child) {
      if (typeof child === 'number') {
        return child;
      } else {
        return this.list.indexOf(child);
      }
    };

    Container.prop('list', {
      get: function() {
        return this.rules || this.decls;
      }
    });

    Container.prototype.normalize = function(child, sample) {
      child.parent = this;
      if ((child.before == null) && sample) {
        child.before = sample.before;
      }
      return child;
    };

    return Container;

  })(Node);

  Container.WithRules = (function(_super) {
    __extends(WithRules, _super);

    function WithRules() {
      this.rules = [];
      WithRules.__super__.constructor.apply(this, arguments);
    }

    WithRules.prototype.eachDecl = function(callback) {
      this.each(function(child) {
        return child.eachDecl(callback);
      });
      return this;
    };

    WithRules.prototype.eachRule = function(callback) {
      var _this = this;
      this.each(function(child, i) {
        if (child.type === 'rule') {
          return callback(child, i);
        } else if (child.eachRule) {
          return child.eachRule(callback);
        }
      });
      return this;
    };

    WithRules.prototype.eachAtRule = function(callback) {
      var _this = this;
      this.each(function(child, i) {
        if (child.type === 'atrule') {
          callback(child, i);
          if (child.eachAtRule) {
            return child.eachAtRule(callback);
          }
        }
      });
      return this;
    };

    return WithRules;

  })(Container);

  Container.WithDecls = (function(_super) {
    __extends(WithDecls, _super);

    function WithDecls() {
      this.decls = [];
      WithDecls.__super__.constructor.apply(this, arguments);
    }

    WithDecls.prototype.normalize = function(child, sample) {
      if (!child.type) {
        child = new Declaration(child);
      }
      return WithDecls.__super__.normalize.call(this, child, sample);
    };

    WithDecls.prototype.eachDecl = function(callback) {
      var _this = this;
      this.each(function(decl, i) {
        return callback(decl, i);
      });
      return this;
    };

    return WithDecls;

  })(Container);

  module.exports = Container;

}).call(this);
