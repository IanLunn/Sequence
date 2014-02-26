'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');
var diff = require('diff');

module.exports = function(grunt) {

    grunt.registerMultiTask(
        'autoprefixer',
        'Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website.',
        function() {
            var options = this.options({
                diff: false,
                map: false
            });

            /**
             * @type {Autoprefixer}
             */
            var processor = autoprefixer(options.browsers);

            // Iterate over all specified file groups.
            this.files.forEach(function(f) {

                /**
                 * @type {string[]}
                 */
                var sources = f.src.filter(function(filepath) {

                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });

                /**
                 * Ensure that `file` property in a given map exists
                 * and it's a filename of a generated content (not a path)
                 * @param {string} map
                 * @param {string} filePath
                 * @returns {string}
                 */
                function ensureFile(map, filePath) {
                    map = JSON.parse(map);
                    map.file = path.basename(filePath);

                    return JSON.stringify(map);
                }

                /**
                 * Set the correct path to a source file
                 * @param {string[]} sources
                 * @param {string} to
                 * @returns {string[]}
                 */
                function fixSources(sources, to) {
                    for (var i = 0, ii = sources.length; i < ii; i++) {
                        sources[i] = path.relative(path.dirname(to), sources[i]);

                        if (path.sep === '\\') {
                            sources[i] = sources[i].replace(/\\/g, '/');
                        }
                    }

                    return sources;
                }

                /**
                 * Returns an input source map or `true` if it doesn't exist
                 * @param {string} mapPath A path to an input source map file
                 * @param {string} from
                 * @returns {string|true}
                 */
                function getMapParam(mapPath, from) {

                    if (grunt.file.exists(mapPath)) {
                        return ensureFile(grunt.file.read(mapPath), from);
                    } else {
                        return true;
                    }
                }

                /**
                 * Create a patch file and write it to the destination folder
                 * @param {string} to
                 * @param {string} input Input CSS
                 * @param {string} output Prefixed CSS
                 */
                function writeDiff(to, input, output) {
                    var diffPath = (typeof options.diff === 'string') ? options.diff : to + '.patch';

                    grunt.file.write(diffPath, diff.createPatch(to, input, output));
                }

                /**
                 * PostCSS doesn't handle the annotation yet
                 * @param {string} css
                 * @param {string} to
                 * @returns {string}
                 */
                function updateAnnotation(css, to) {
                    var pattern = /(\/\*(?:#|@)\ssourceMappingURL=\s*)(?:.*)(\s*\*\/)/;
                    var mapName = path.basename(to) + '.map';

                    if (pattern.test(css)) {
                        css = css.replace(pattern, '$1' + mapName + ' $2');
                    } else {
                        css = css.concat(
                            grunt.util.linefeed,
                            '/*# sourceMappingURL=' + mapName + ' */'
                        );
                    }

                    return css;
                }

                /**
                 * @param {string} input Input CSS
                 * @param {string} from Input path
                 * @param {string} to Output path
                 */
                function compile(input, from, to) {
                    var result;

                    if (options.map) {
                        var mapPath;

                        if (options.map === true) {
                            mapPath = from + '.map';
                        } else {
                            mapPath = options.map + path.basename(from) + '.map';
                        }

                        // source-map lib works incorrectly if an input file is in subdirectory
                        // so we must cwd to subdirectry and make all paths relative to it
                        // https://github.com/ai/postcss/issues/13
                        process.chdir(path.dirname(from));
                        mapPath = path.relative(path.dirname(from), mapPath);
                        to = path.relative(path.dirname(from), to);
                        from = path.basename(from);

                        result = processor.process(input, {
                            map: getMapParam(mapPath, from),
                            from: from,
                            to: to
                        });

                        var map = JSON.parse(ensureFile(result.map, to));

                        fixSources(map.sources, to);
                        result.css = updateAnnotation(result.css, to);
                        grunt.file.write(to + '.map', JSON.stringify(map));
                    } else {
                        result = processor.process(input);
                    }

                    grunt.file.write(to, result.css);

                    options.diff && writeDiff(to, input, result.css);
                }

                sources.forEach(function(filepath) {
                    var dest = f.dest || filepath;
                    var cwd = process.cwd();

                    compile(grunt.file.read(filepath), filepath, dest);

                    // Restore the default cwd
                    process.chdir(cwd);
                    grunt.log.writeln('File "' + dest + '" prefixed.');
                });
            });
        }
    );
};
