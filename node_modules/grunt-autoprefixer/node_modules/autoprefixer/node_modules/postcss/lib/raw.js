(function() {
  var Raw;

  Raw = (function() {
    function Raw(raw, trimmed) {
      this.raw = raw;
      this.trimmed = trimmed;
    }

    Raw.prototype.set = function(value) {
      if (this.trimmed !== value) {
        this.changed = true;
        return this.trimmed = value;
      }
    };

    Raw.prototype.stringify = function(opts) {
      if (opts == null) {
        opts = {};
      }
      if (!this.changed) {
        return this.raw || '';
      } else if (!this.raw) {
        return (opts.before || '') + this.trimmed + (opts.after || '');
      } else {
        return (this.raw[0] === ' ' ? ' ' : '') + this.trimmed + (this.raw.slice(-1) === ' ' ? ' ' : '');
      }
    };

    return Raw;

  })();

  Raw.empty = new Raw();

  module.exports = Raw;

}).call(this);
