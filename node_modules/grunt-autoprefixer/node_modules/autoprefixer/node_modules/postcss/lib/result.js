(function() {
  var Result;

  Result = (function() {
    function Result(parsed, css) {
      this.parsed = parsed;
      this.css = css;
    }

    Result.prototype.toString = function() {
      return this.css;
    };

    return Result;

  })();

  module.exports = Result;

}).call(this);
