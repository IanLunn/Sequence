(function() {
  var AtRule, Declaration, Parser, Raw, Root, Rule, SyntexError;

  SyntexError = require('./syntax-error');

  Declaration = require('./declaration');

  AtRule = require('./at-rule');

  Root = require('./root');

  Rule = require('./rule');

  Raw = require('./raw');

  Parser = (function() {
    function Parser(source, opts) {
      this.opts = opts;
      this.source = source.toString();
      this.root = new Root();
      this.current = this.root;
      this.parents = [this.current];
      this.type = 'rules';
      this.types = [this.type];
      this.pos = -1;
      this.line = 1;
      this.lines = [];
      this.column = 0;
      this.buffer = '';
    }

    Parser.prototype.loop = function() {
      while (this.pos < this.source.length - 1) {
        this.move();
        this.nextLetter();
      }
      return this.endFile();
    };

    Parser.prototype.nextLetter = function() {
      this.inString() || this.inComment() || this.isComment() || this.isString() || this.isWrong() || this.inAtrule() || this.isAtrule() || this.isBlockEnd() || this.inSelector() || this.isSelector() || this.inProperty() || this.isProperty() || this.inValue();
      return this.unknown();
    };

    Parser.prototype.inString = function() {
      if (this.quote) {
        if (this.escape) {
          this.escape = false;
        } else if (this.letter === '\\') {
          this.escape = true;
        } else if (this.letter === this.quote) {
          this.quote = void 0;
        }
        this.trimmed += this.letter;
        return true;
      }
    };

    Parser.prototype.isString = function() {
      if (this.letter === '"' || this.letter === "'") {
        this.quote = this.letter;
        this.quotePos = {
          line: this.line,
          column: this.column
        };
        this.trimmed += this.letter;
        return true;
      }
    };

    Parser.prototype.inComment = function() {
      if (this.inside('comment')) {
        if (this.next('*/')) {
          this.popType();
          this.move();
        }
        return true;
      }
    };

    Parser.prototype.isComment = function() {
      if (this.next('/*')) {
        this.commentPos = {
          line: this.line,
          column: this.column
        };
        this.addType('comment');
        this.move();
        return true;
      }
    };

    Parser.prototype.isWrong = function() {
      if (this.letter === '{' && (this.inside('decls') || this.inside('value'))) {
        this.error("Unexpected {");
      }
      if (this.inside('property') && (this.letter === '}' || this.letter === ';')) {
        return this.error('Missing property value');
      }
    };

    Parser.prototype.isAtrule = function() {
      if (this.letter === '@' && this.inside('rules')) {
        this.init(new AtRule());
        this.current.name = '';
        this.addType('atrule-name');
        return true;
      }
    };

    Parser.prototype.inAtrule = function(close) {
      if (this.inside('atrule-name')) {
        if (this.space()) {
          this.checkAtruleName();
          this.buffer = this.buffer.slice(this.current.name.length);
          this.trimmed = '';
          this.setType('atrule-param');
        } else if (this.letter === ';' || this.letter === '{' || close) {
          this.checkAtruleName();
          this.endAtruleParams();
        } else {
          this.current.name += this.letter;
        }
        return true;
      } else if (this.inside('atrule-param')) {
        if (this.letter === ';' || this.letter === '{' || close) {
          this.current.params = new Raw(this.prevBuffer(), this.trim(this.trimmed));
          this.endAtruleParams();
        } else {
          this.trimmed += this.letter;
        }
        return true;
      }
    };

    Parser.prototype.inSelector = function() {
      if (this.inside('selector')) {
        if (this.letter === '{') {
          this.current.selector = new Raw(this.prevBuffer(), this.trim(this.trimmed));
          this.semicolon = false;
          this.buffer = '';
          this.setType('decls');
        } else {
          this.trimmed += this.letter;
        }
        return true;
      }
    };

    Parser.prototype.isSelector = function() {
      if (!this.space() && this.inside('rules')) {
        this.init(new Rule());
        if (this.letter === '{') {
          this.addType('decls');
          this.current.selector = new Raw('', '');
          this.semicolon = false;
          this.buffer = '';
        } else {
          this.addType('selector');
          this.buffer = this.letter;
          this.trimmed = this.letter;
        }
        return true;
      }
    };

    Parser.prototype.isBlockEnd = function() {
      if (this.letter === '}') {
        if (this.parents.length === 1) {
          this.error('Unexpected }');
        } else {
          if (this.inside('value')) {
            this.fixEnd(function() {
              return this.inValue('close');
            });
          } else {
            if (this.semicolon) {
              this.current.semicolon = true;
            }
            this.current.after = this.prevBuffer();
          }
          this.pop();
        }
        return true;
      }
    };

    Parser.prototype.inProperty = function() {
      if (this.inside('property')) {
        if (this.letter === ':') {
          if (this.buffer[0] === '*' || this.buffer[0] === '_') {
            this.current.before += this.buffer[0];
            this.trimmed = this.trimmed.slice(1);
            this.buffer = this.buffer.slice(1);
          }
          this.current.prop = this.trim(this.trimmed);
          this.current.between = this.prevBuffer().slice(this.current.prop.length);
          this.buffer = '';
          this.setType('value');
          this.trimmed = '';
        } else if (this.letter === '{') {
          this.error('Unexpected { in decls');
        } else {
          this.trimmed += this.letter;
        }
        return true;
      }
    };

    Parser.prototype.isProperty = function() {
      if (this.inside('decls') && !this.space() && this.letter !== ';') {
        this.init(new Declaration());
        this.addType('property');
        this.buffer = this.letter;
        this.trimmed = this.letter;
        this.semicolon = false;
        return true;
      }
    };

    Parser.prototype.inValue = function(close) {
      if (this.inside('value')) {
        if (this.letter === '(') {
          this.inBrackets = true;
        } else if (this.inBrackets && this.letter === ')') {
          this.inBrackets = false;
        }
        if ((this.letter === ';' && !this.inBrackets) || close) {
          if (this.letter === ';') {
            this.semicolon = true;
          }
          this.current.value = new Raw(this.prevBuffer(), this.trim(this.trimmed));
          this.pop();
        } else {
          this.trimmed += this.letter;
        }
        return true;
      }
    };

    Parser.prototype.unknown = function() {
      if (!this.space) {
        return this.error("Unexpected symbol " + this.letter);
      }
    };

    Parser.prototype.endFile = function() {
      if (this.inside('atrule-param') || this.inside('atrule-name')) {
        this.fixEnd(function() {
          return this.inAtrule('close');
        });
      }
      if (this.parents.length > 1) {
        return this.error('Unclosed block', this.current.source.start);
      } else if (this.inside('comment')) {
        return this.error('Unclosed comment', this.commentPos);
      } else if (this.quote) {
        return this.error('Unclosed quote', this.quotePos);
      } else {
        return this.root.after = this.buffer;
      }
    };

    Parser.prototype.error = function(message, position) {
      if (position == null) {
        position = {
          line: this.line,
          column: this.column
        };
      }
      throw new SyntexError(message, this.source, position, this.opts.from);
    };

    Parser.prototype.move = function() {
      this.pos += 1;
      this.column += 1;
      this.letter = this.source[this.pos];
      this.buffer += this.letter;
      if (this.letter === "\n") {
        this.lines[this.line] = this.column - 1;
        this.line += 1;
        return this.column = 0;
      }
    };

    Parser.prototype.prevBuffer = function() {
      return this.buffer.slice(0, -1);
    };

    Parser.prototype.inside = function(type) {
      return this.type === type;
    };

    Parser.prototype.next = function(string) {
      return this.source.slice(this.pos, +(this.pos + string.length - 1) + 1 || 9e9) === string;
    };

    Parser.prototype.space = function() {
      return this.letter === ' ' || this.letter === "\t" || this.letter === "\n" || this.letter === "\f" || this.letter === "\r";
    };

    Parser.prototype.init = function(node) {
      this.current.push(node);
      this.parents.push(node);
      this.current = node;
      this.current.source = {
        start: {
          line: this.line,
          column: this.column
        }
      };
      if (this.opts.from) {
        this.current.source.file = this.opts.from;
      }
      this.current.before = this.buffer.slice(0, -1);
      return this.buffer = '';
    };

    Parser.prototype.fixEnd = function(callback) {
      var after, all, el, last, lines, start;
      if (this.letter === '}') {
        start = this.buffer.search(/\s*\}$/);
        after = this.buffer.slice(start, -1);
      } else {
        start = this.buffer.search(/\s*$/);
        after = this.buffer.slice(start);
      }
      this.buffer = this.buffer.slice(0, +start + 1 || 9e9);
      el = this.current;
      callback.apply(this);
      lines = after.match(/\n/g);
      if (lines) {
        el.source.end.line -= lines.length;
        all = this.lines[el.source.end.line];
        last = after.indexOf("\n");
        if (last === -1) {
          last = after.length;
        }
        el.source.end.column = all - last;
      } else {
        el.source.end.column -= after.length;
      }
      this.current.after = after;
      return this.buffer = after;
    };

    Parser.prototype.pop = function() {
      this.current.source.end = {
        line: this.line,
        column: this.column
      };
      this.popType();
      this.parents.pop();
      this.current = this.parents[this.parents.length - 1];
      return this.buffer = '';
    };

    Parser.prototype.addType = function(type) {
      this.types.push(type);
      return this.type = type;
    };

    Parser.prototype.setType = function(type) {
      this.types[this.types.length - 1] = type;
      return this.type = type;
    };

    Parser.prototype.popType = function() {
      this.types.pop();
      return this.type = this.types[this.types.length - 1];
    };

    Parser.prototype.atruleType = function() {
      var name;
      name = this.current.name.toLowerCase();
      if (name === 'page' || name === 'font-face' || name.slice(-8) === 'viewport') {
        return 'decls';
      } else {
        return 'rules';
      }
    };

    Parser.prototype.endAtruleParams = function() {
      var type;
      if (this.letter === '{') {
        type = this.atruleType();
        this.current.addMixin(type);
        this.setType(type);
        return this.buffer = '';
      } else {
        if (this.letter === ';') {
          this.current.semicolon = true;
        }
        return this.pop();
      }
    };

    Parser.prototype.checkAtruleName = function() {
      if (this.current.name === '') {
        return this.error('At-rule without name');
      }
    };

    Parser.prototype.trim = function(string) {
      return string.replace(/^\s*/, '').replace(/\s*$/, '');
    };

    return Parser;

  })();

  module.exports = function(source, opts) {
    var parser;
    if (opts == null) {
      opts = {};
    }
    parser = new Parser(source, opts);
    parser.loop();
    return parser.root;
  };

}).call(this);
