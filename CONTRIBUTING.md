# Contributing

- [Project Files](#project-files)
- [Using Grunt](#using-grunt)
- [Submitting A Bug](#submitting-a-bug)
- [Submitting A Pull Request](#submitting-a-pull-request)
- [Submit Your Theme to The Showcase](#submit-your-theme-to-the-showcase)

## Project Files

The following gives a brief description for each file's purpose.

### `css`

Contains stylesheets for the demo page and intro theme.

### `scripts`

Contains the compiled `sequence.js` and its minified version `sequence.min.js`. If you want to develop `sequence.js` please do so in the version found in `src`. Also contains the following third-party dependencies:

- `hammer.min.js` - Used for touch support
- `imagesloaded.pkgd.min.js` - Used for preloading images
- `sequence-theme.intro.js` - Options and inititation code to start Sequence.js on the Intro theme.

### `src`

Contains the development version of `sequence.js`. This is the file to change should you wish to work on the core Sequence.js library.

### `tests`

Contains a test file and test themes. Head to [`tests/index.html`](/tests/index.html).

### `.gitignore`

Lists files/directory that [Git](http://git-scm.com/) should ignore.

### `bower.json`

Lists Sequence.js' [Bower](http://bower.io/) details and the dependencies it uses.

### `CHANGELOG.md`

Contains history of all the changes made to Sequence.js.

### `CONTRIBUTING.md`

The very file you are reading right now!

### `Gruntfile.js`

Describes the automated tasks used for developing Sequence.js.

### `index.html`

The Intro theme for Sequence.js.

### `LICENSE.md`

License information for Sequence.js.

### `package.json`

Lists Sequence.js' [NPM](https://www.npmjs.org/) details and the dependencies it uses during development.

### `README.md`

The intro to Sequence.js.

## Using Grunt

The Sequence.js project uses [Grunt](http://gruntjs.com/) to automate useful tasks. With Grunt installed (see Grunt's [Getting Started](http://gruntjs.com/getting-started)), use the following command to install Sequence.js' project dependencies:

```
npm install
```

Once Sequence.js dependencies have installed you can use the commands `grunt`, `grunt serve`, `grunt test`, and `grunt test-watch`.

### `grunt`

This will manually run the tasks run via the `grunt serve` command once.

### `grunt serve`

This will start a development environment with the following automated tasks:

- Starts a [livereload](http://livereload.com/) session that will reload your browser whenever a file is changed (be sure to install [livereload](http://livereload.com/))
- Opens your browser and navigates to `http://localhost:8000/`
- Sets up a *watch* task to run the following sub-tasks:
  - Update the version number in `sequence.js` and `bower.json` when changed in `package.json`
  - Copy `src/sequence.js` to the `scripts` directory and create an uglify (minified) copy as `scripts/sequence.min.js`
  - Process any `.scss` files found in the `scss` directory then copy to `css` and minify

You only need to run `grunt serve` per each development session as the *watch* task will continue to operate as you modify files.

### `grunt test`

Manually runs [JSHint](http://www.jshint.com/about/) and Sequence.js tests via jasmine and karma.

### `grunt test-watch`

Runs the same tests as the `grunt test` command each time the files in `tests/` are updated.

## Submitting a Bug

Please note that the issue tracker is for bugs only -- either relating to sequence.js, its dependencies, or official Sequence.js themes. For support on your own Sequence.js themes, please use [StackOverflow](http://stackoverflow.com/questions/ask?tags=sequencejs) with the tag `sequencejs`.

### Before reporting a bug

1. Search [issue tracker](https://github.com/IanLunn/Sequence/issues) for similar issues.

### How to report a bug

1. Specify the version number of the sequence.js library where the bug occurred (you'll find it toward the top of `sequence.js`, `sequence.min.js`, or `package.json`).
2. Specify your browser version and operating system (for example, Chrome 35, Windows 8)
3. Describe the problem in detail. Explain what happened, and what you expected would happen.
4. Provide a [reduced test-case](https://css-tricks.com/reduced-test-cases/) via [CodePen](http://codepen.io/), [JSBin](http://jsbin.com/), [JSFiddle](http://jsfiddle.net/), or similar.
5. If helpful, include a screenshot. Annotate the screenshot for clarity.

## Submitting a Pull Request

1. Make sure you have a [GitHub](https://github.com/) account.
2. Fork the repository on [GitHub](https://github.com/IanLunn/Sequence).
3. Make changes to your clone of the repository.
4. Submit a pull request.
