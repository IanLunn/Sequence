(function() {
  var Result, SourceMap, generateMap;

  SourceMap = require('source-map');

  Result = require('./result');

  generateMap = function(css, opts) {
    var builder, column, line, map, prev, result;
    map = new SourceMap.SourceMapGenerator({
      file: opts.to || 'to.css'
    });
    result = new Result(css, '');
    line = 1;
    column = 1;
    builder = function(str, node, type) {
      var last, lines, _ref, _ref1;
      result.css += str;
      if ((node != null ? (_ref = node.source) != null ? _ref.start : void 0 : void 0) && type !== 'end') {
        map.addMapping({
          source: node.source.file || 'from.css',
          original: {
            line: node.source.start.line,
            column: node.source.start.column - 1
          },
          generated: {
            line: line,
            column: column - 1
          }
        });
      }
      lines = str.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str.lastIndexOf("\n");
        column = str.length - last;
      } else {
        column = column + str.length;
      }
      if ((node != null ? (_ref1 = node.source) != null ? _ref1.end : void 0 : void 0) && type !== 'start') {
        return map.addMapping({
          source: node.source.file || 'from.css',
          original: {
            line: node.source.end.line,
            column: node.source.end.column
          },
          generated: {
            line: line,
            column: column
          }
        });
      }
    };
    css.stringify(builder);
    if (typeof opts.map === 'string') {
      prev = new SourceMap.SourceMapConsumer(opts.map);
      map.applySourceMap(prev);
    }
    result.map = map.toString();
    return result;
  };

  module.exports = generateMap;

}).call(this);
