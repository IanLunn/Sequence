# grunt-autoprefixer
[![Build Status](https://travis-ci.org/nDmitry/grunt-autoprefixer.png?branch=master)](https://travis-ci.org/nDmitry/grunt-autoprefixer) 
[![Dependency Status](https://david-dm.org/nDmitry/grunt-autoprefixer.png)](https://david-dm.org/nDmitry/grunt-autoprefixer)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nDmitry/grunt-autoprefixer/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

> [Autoprefixer](https://github.com/ai/autoprefixer) parses CSS and adds vendor-prefixed CSS properties using the [Can I Use](http://caniuse.com/) database.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-autoprefixer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-autoprefixer');
```

## The "autoprefixer" task

### Overview
In your project's Gruntfile, add a section named `autoprefixer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autoprefixer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.browsers
Type: `Array`
Default value: `['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1']`

You can specify browsers actual for your project:

```js
options: {
  browsers: ['last 2 version', 'ie 8', 'ie 9']
}
```

[View more](https://github.com/ai/autoprefixer#browsers).

#### options.diff
Type: `Boolean|String`
Default value: `false`

Set it to `true` if you want to get an output patch file:

```js
options: {
  diff: true // or 'custom/path/to/file.css.patch'
}
```
Also you can specify a path where to save this file. More examples in [Gruntfile](https://github.com/nDmitry/grunt-autoprefixer/blob/master/Gruntfile.js).

#### options.map
Type: `Boolean|String`
Default value: `false`

If `true`, the plugin will try to find an input source map file (from a pre-processor) and generate a new map based on the found one (or just generate a new map). If a string is specified, grunt-autoprefixer will look for an input source map at the specified directory.

```js
options: {
  map: true // or 'custom/path/to/maps/'
}
```
You cannot specify a path where to save a map file, it will be saved at the same directory as the output CSS file.

### Usage Examples

```js
grunt.initConfig({

  autoprefixer: {

    options: {
      // Task-specific options go here.
    },

    // prefix the specified file
    single_file: {
      options: {
        // Target-specific options go here.
      },
      src: 'src/css/file.css',
      dest: 'dest/css/file.css'
    },

    // prefix all files
    multiple_files: {
      expand: true,
      flatten: true,
      src: 'src/css/*.css', // -> src/css/file1.css, src/css/file2.css
      dest: 'dest/css/' // -> dest/css/file1.css, dest/css/file2.css
    },

    // if you have specified only the `src` param, the destination will be set automatically,
    // so source files will be overwritten
    no_dest: {
      src: 'dest/css/file.css' // globbing is also possible here
    },

    diff: {
        options: {
            diff: true
        },
        src: 'src/css/file.css',
        dest: 'dest/css/file.css' // -> dest/css/file.css, dest/css/file.css.patch
    },

    sourcemap: {
        options: {
            map: true
        },
        src: 'src/css/file.css',
        dest: 'dest/css/file.css' // -> dest/css/file.css, dest/css/file.css.map
    },
  }

});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
