# Documentation

Sequence allows you to create your own unique, animated themes for sliders, presentations, banners, accordions, and other step-based applications.

The documentation will guide you through the process of creating your own Sequence from scratch, but if you'd rather just choose a theme that you can easily customize and add your own content to, visit the Sequence [theme store](http://sequencejs.com/) for pre-built [free](http://www.sequencejs.com/themes/category/free/) and [premium themes](http://www.sequencejs.com/themes/category/premium/). Should you wish to modify the animations of a theme, head to [How Sequence Works](#how-sequence-works).

At any point in the documentation, if you [need support](#need-support), we'll do everything we can to help.

## Table of Contents

1. [Download Sequence](#download-sequence)
  - [Package Contents](#pakcage-contents)
- [Creating a Theme](#creating-a-theme)
  1. [Add Sequence](#add-sequence)
  2. [Add HTML](#add-html)
  3. [Add Content](#add-content)
  4. [Setup a No-JavaScript Fallback](#setup-a-no-js-fallback)
  5. [Add CSS](#add-css)
- [How Sequence Works](#how-sequence-works)
  - [Structure](#structure)
  - [Animating](#animating)
  - [Support for Legacy Browsers](#support-for-legacy-browsers)
- [Options](#options)
  - [General](#general)
  - [Canvas Animation](#canvas-animation)
  - [Autoplay](#autoplay)
  - [Navigation Skipping](#navigation-skipping)
  - [Next/Previous Buttons](#next-previous-buttons)
  - [Pause](#pause)
  - [Pagination](#pagination)
  - [Preloader](#preloader)
  - [Keyboard](#keyboard)
  - [Touch Swipe](#touch-swipe)
  - [Hash Tag](#hash-tag)
  - [Fallback Theme for Legacy Browsers](#fallback-theme-for-legacy-browsers)
- [API](#api)
  - [Callbacks](#callbacks)
  - [Methods](#methods)
  - [Properties](#properties)
- [Using Grunt (todo)](#using-grunt)
- [Need Support?](#need-support)

---

## Download Sequence

[Download Sequence here](https://github.com/IanLunn/Sequence/archive/v2.zip)

Or if you have [Bower](http://bower.io/) installed, use the following command:

```
bower install sequencejs
```

### Package Contents

As well as containing the sequence.js library, the package also contains several pre-built themes that you can base your theme on or use for reference. These pre-built themes are also made available on the Sequence [theme store](http://sequencejs.com/) along with many more.

Some directories and files in the package that you may want to familiarize yourself with:

- scripts:
  - `sequence.js`: Production ready, unminified version of Sequence
  - `sequence.min.js`: Production ready, minified version of Sequence
- src:
  - `sequence.js`: Development version of Sequence
- themes:
  **TBA**
- Gruntfile.js: Provides a production environment. See [Using Grunt](#using-grunt)

## Creating a Theme

Creating a theme consists of [adding Sequence's JavaScript](#add-sequence) and [HTML structure](#add-html) to the page, [adding your content](#add-content), and then animating the transitions between your content via CSS transitions.

The following is a mini-tutorial that will set up a basic theme that you can build upon. This theme is included in the Sequence download package under `themes/basic` if you'd rather just reference it than follow along.

### Add Sequence

Place a link to Sequence, its third-party files, and the theme options file just before the `</body>` element of your page:
```html
<script src="scripts/third-party/imagesloaded.pkgd.min.js"></script>
<script src="scripts/third-party/hammer.min.js"></script>
<script src="scripts/sequence.min.js"></script>
<script src="scripts/sequence-theme.basic.js"></script>
```

Note: Where appropriate, you can instead place these scripts in the `<head></head>` of your page within a `window.onload` function or jQuery's `$(document).ready()`.

Third-party files provide Sequence with the following functionality:

- imagesLoaded: Image preloading when Sequence's `preloader` option is enabled
- hammer: Touch support

Create the `sequence-theme.basic.js` file and save it in the `scripts` folder, then add the following to it:

After the references to the files you just added, initiate an instance of Sequence like so:

```javascript
  // Get the Sequence element
  var sequenceElement = document.getElementById("sequence");

  // Place your Sequence options here to override defaults
  // See: https://github.com/IanLunn/Sequence/blob/v2/DOCUMENTATION.md
  var options = {

  }

  // Launch Sequence on the element, and with the options we specified above
  var mySequence = sequence(sequenceElement, options);
```

With this code, we've got the HTML element that Sequence will be attached to `<div id="sequence"></div>` (we'll [add the HTML](#add-html) in a moment), and then launched Sequence.

We have saved an instance of Sequence into a variable (`var`) called `mySequence`. The variable name is entirely up to you and, if necessary, will allow you to interact with Sequence via custom JavaScript which is explained in [API](#api).

The Sequence function `sequence()`, accepts an HTML element and options as its arguments. The HTML element is required, but if we don't want to change Sequence's default options, we can ignore the `options` argument altogether, like this `var mySequence = sequence(sequenceElement)`.

In the code we've added to the file, we setup an `options` object to place our options, but for the time being we'll leave it blank. We'll take a look at customizing Sequence's functionality using [Options](#options) later.

It is possible to place multiple instances of Sequence on the same page, like so:
```javascript
<script>
  var sequenceElement1 = document.getElementById("sequence1");
  var sequenceElement2 = document.getElementById("sequence2");

  var mySequence1 = sequence(sequenceElement1);
  var mySequence2 = sequence(sequenceElement2);
</script>
```

Here the page will have two instances of Sequence, one attached to `<div id="sequence1"></div>`, the other `<div id="sequence2"></div>`.

### Add HTML

Wherever you'd like Sequence to appear on your page, add Sequence’s simple HTML structure like so:

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li>
        <!-- Step 1 content here -->
    </li>
    <li>
        <!-- Step 2 content here -->
    </li>
    <li>
        <!-- Step 3 content here -->
    </li>
  </ul>
</div>
```

Sequence's HTML structure consists of the containing element with an unique ID of your choosing, followed by its canvas (any element with the class of `sequence-canvas`), and then the elements that will act as Sequence's steps. Steps hold the content of your Sequence instance -- you can think of these as slides but we like the name *steps* better because Sequence can do a whole lot more than just slide!

In this code example, we've used an unordered list `<ul>` for the canvas and `<li>` for the steps, but Sequence will allow you to use other elements too. For example, assuming you want to use `<section>` and `<article>`, the following code can be used:

```html
<div id="sequence">
  <section class="sequence-canvas">
    <article>
        <!-- Step 1 content here -->
    </article>
    <article>
        <!-- Step 2 content here -->
    </article>
    <article>
        <!-- Step 3 content here -->
    </article>
  </section>
</div>
```

Sequence knows the canvas is whichever element you give the `sequence-canvas` and the steps are the canvas' immediate descendants, in this case, the `<article>` elements.

### Add Content

To add content to a step, simply place HTML within each step element:

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li>
      <h2>Powered by Sequence.js</h2>
      <h3>The open-source CSS animation framework</h3>
    </li>
    <li>
      <h2>Create Unique Animated Themes</h2>
      <h3>For sliders, presentations, banners, accordions, and other step-based applications</h2>
    </li>
    <li>
      <h2>No Restrictions, Endless Possibilities</h2>
      <h3>Use the HTML and CSS syntax you're used to. No JavaScript knowledge required.</h3>
    </li>
  </ul>
</div>
```

Beyond the initial structure of *containing element > canvas > steps*, there are no limitations to what elements you can use in your Sequence content. Add as many elements as you like, a `<video>` element, a gif, a plain old `<div>`, an embedded video...it is entirely up to you.

In the above example, we've added `<h2>` and `<h3>` elements which we'll shortly animate via CSS.

### Setup a No-JavaScript Fallback

In a small percentage of browsers, JavaScript may be disabled which is the technology Sequence is built upon. In this case, to prevent an empty container from showing, nominate a step to be displayed by giving it a class of `animate-in`:

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li class="animate-in">
      <h2>Powered by Sequence.js</h2>
      <h3>The open-source CSS animation framework</h3>
    </li>
    <li>
      <h2>Create Unique Animated Themes</h2>
      <h3>For sliders, presentations, banners, accordions, and other step-based applications</h2>
    </li>
    <li>
      <h2>No Restrictions, Endless Possibilities</h2>
      <h3>Use the HTML and CSS syntax you're used to. No JavaScript knowledge required.</h3>
    </li>
  </ul>
</div>
```

Here you’ve nominated the first step to be displayed if JavaScript is disabled. We'll shortly define the `animate-in` class via CSS to tell the browser how to show that step's content when it is move to its `animate-in` position.

### Add CSS

In the `<head></head>` of your page, add the following reference to a stylesheet:

```html
<link href="css/sequence-theme.basic.css" rel="stylesheet" media="all">
```

Then create a `.css` file, name it `sequence-theme.basic.css`, and save it within a `css` directory.

In the CSS file, add the following and save it:

```css
#sequence {
  position: relative;
  height: 585px;
  width: 100%;
  max-width: 960px;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  border: black solid 2px;
  font-family: sans-serif;
}

/* Reset */
#sequence .sequence-canvas,
#sequence .sequence-canvas > * {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Make the canvas the same dimensions as the container and prevent lines from
   wrapping so each step can sit side-by-side */
#sequence .sequence-canvas {
  position: absolute;
  height: 100%;
  width: 100%;
  white-space: nowrap;
}

/* Make the steps the same size as the container and sit side-by-side */
#sequence .sequence-canvas > * {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  white-space: normal;
  text-align: center;
}
```

The CSS above adds a basic layout for the Sequence structure:

- Makes the Sequence element 960px x 585px, centers it and prevents any content from overflowing its boundaries
- Adds a mini-reset to the canvas and its steps for better browser consistency
- Makes the steps sit side-by-side

Now with this CSS in place, take a look at the web page containing the theme in a web browser.

If Sequence is set up correctly, when you press your keyboard's right arrow key, Sequence should animate the canvas element so that the second step moves into view.

<img src="http://sequencejs.com/images/first-animation.gif" alt="First Animation" />

That's cool, but not that impressive though, is it? Don't worry, this is just the very start of what Sequence is capable of - your imagination is the only limitation!

Let's style our `<h2>` and `<h3>` element and then make them animate. Add the following to the CSS file and save it:

```css
/* Starting positions and default styles for content */
#sequence h2,
#sequence h3 {
  display: block;
  opacity: 0;
  transition-duration: .5s;
}

#sequence h2 {
  transform: translate(0, -20px);
}

#sequence h3 {
  transform: translate(0, 20px);
}

/* Animate in positions for content */
#sequence .animate-in h2,
#sequence .animate-in h3 {
  opacity: 1;
  transform: translate(0, 0);
}

/* Animate out positions for content */
#sequence .animate-out h2,
#sequence .animate-out h3 {
  opacity: 1;
  transform: translate(0, 0);
}
```

In the first rulesets for `#sequence h2` and `#sequence h3`, we made the text invisible, moved `<h2>` up `20px`, and `<h3>` down `20px`.

Sequence's true capabilities are demonstrated in the following rulesets. Sequence controls exactly when a step is given the classes of `animate-in` and `animate-out`, allowing you to control the animation of elements.

So, the next time you view the page and press the right arrow key, Sequence will automatically animate the canvas to show the second step, then apply the `animate-in` class to it. Our `#sequence .animate-in h2` and `#sequence .animate-in h3` rulesets will take effect and cause both the `<h2>` and `<h3>` to fade-in, and move to their respective positions over a `.5s` duration.

<img src="http://sequencejs.com/images/second-animation.gif" alt="Second Animation" />

We applied the same declarations when a step is given the `animate-out` class so its elements remain in the same place as `animate-in`. Of course, if we want we can easily have the elements do something else when the `animate-out` class is applied, just by changing the CSS for `#sequence .animate-out h2` and `#sequence .animate-out h3`. Which elements animate and how they do, is entirely up to you.

These are the very basics of how to begin animating with Sequence. We can add as many transitions as we like to as many elements as necessary. We can also change how the canvas animates or disable its animation entirely, so only the content animates.

To create some truly impressive and unique animated applications, keep reading to discover how Sequence works and how you can make best use of it, or if you'd rather, go take a look at some of Sequence's [pre-built themes](http://sequencejs.com/) for inspiration.

### How Sequence Works

Now we've setup the HTML, let's get to grips with how Sequence works so we can best make use of it.

#### Structure

The basic structure of Sequence is a container element, a canvas element with the class of `sequence-canvas`, such as `<ul class="sequence-canvas">` and steps, such as `<li>`.

The container is useful for the following:

- Applying a width and height
- Centering the Sequence element on the page
- Applying `overflow: hidden;` so no content appears outside of the container's boundaries
- Adding additional Sequence elements such as navigation and pagination

As steps are navigated between, the container is given index class names such as `step1`, `step2`, and so on. These class names can be used to animate the canvas manually, if you so wish.

The canvas sits inside the container and holds the steps. If you choose to have Sequence animate the canvas (which it does by default), when the user navigates to a step, the canvas element will move, to show the relevant step.

The steps hold your content. When a step is navigated to, it is given the class `animate-in`, allowing you to animate a steps content into its "in" position. Then, when a step is navigated away from, the step is given an `animate-out` class so you can move any of its elements to an "out" position, as you see fit.

When a step becomes active (is being viewed), it is given a higher `z-index` property than the others, so that the active step sits on top. This functionality can be changed via the `moveActiveStepToTop` option.

##### Relative vs Absolute (Layered) Structure

There are two main ways in which we can structure Sequence, relative or absolute.

In the [Creating a Theme](#creating-a-theme) mini-tutorial, we created a relative structure. This is suitable when you want to position steps relative to one another and have the canvas animate between them.

<img src="http://sequencejs.com/images/relative-layout.jpg" alt="An example of a relative layout" />

In the above relative structure example, three steps are positioned side-by-side. When the user navigates between steps, Sequence will animate the canvas so the relevant step comes in to view. Shown is a basic side-by-side layout but this could also be a grid or other formation of layout.

<img src="http://sequencejs.com/images/absolute-layout.jpg" alt="An example of an absolute layout" />

An absolute or layered structure is when steps are all positioned in the same place and on top of one another. With this structure, the canvas doesn't need to animate between steps and only the content animates.

The long and short of choosing a structure is: use absolute (layered) if you don't want the canvas to animate. If you do, then go for relative.

### Animating

When a Sequence step is navigated to and becomes active, it is given a class of `animate-in`. The previously active step is given a class of `animate-out`. Using these classes, we can animation the content of Sequence using [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions).

Here we have a basic structure for a Sequence theme which we created in the mini-tutorial:

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li class="animate-in">
      <h2>Powered by Sequence.js</h2>
      <h3>The open-source CSS animation framework</h3>
    </li>
    <li>
      <h2>Create Unique Animated Themes</h2>
      <h3>For sliders, presentations, banners, accordions, and other step-based applications</h2>
    </li>
    <li>
      <h2>No Restrictions, Endless Possibilities</h2>
      <h3>Use the HTML and CSS syntax you're used to. No JavaScript knowledge required.</h3>
    </li>
  </ul>
</div>
```

And the following CSS:

```css
h2,
h3 {
  display: block;
  opacity: 0;
  transition-duration: .5s;
}

h2 {
  transform: translate(0, -20px);
}

h3 {
  transform: translate(0, 20px);
}
```

This CSS applies an `opacity` of `0` to the elements, along with a `transition-duration` that will cause the elements to animate over half a second, when their properties change (they haven't as yet).

Now, when Sequence starts the first step is given a class of `animate-in`. This enables us to move the contents of the first step into position via CSS.

In the mini-tutorial, we applied the following which makes the `<h2>` and `<h3>` elements of the first slide fade-in and move into position:

```css
#sequence .animate-in h2,
#sequence .animate-in h3 {
  opacity: 1;
  transform: translate(0, 0);
}
```

Note that we didn't define a `transition-duration` in this `animate-in` ruleset. We could have done but instead we just relied on CSS cascading and applied it to the default styles in the `h2, h3` rulset.

With the first step active, the second and third steps are in their "start" positions. As they don't have `animate-in` or `animate-out` classes applied to them, only the default styles still take effect.

When a step is in its `animate-in` position, eventually it will need to be animated out (when the user presses the next button for example). Sequence will remove the `animate-in` class from the first step, and add a class of `animate-out`. The second step will then receive the `animate-in` class. Step 1 will have its content animated out and step 2 will animate in. The HTML will then look like this:

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li class="animate-out" style="z-index: 2;">
      <h2>Powered by Sequence.js</h2>
      <h3>The open-source CSS animation framework</h3>
    </li>
    <li class="animate-in" style="z-index: 3;">
      <h2>Create Unique Animated Themes</h2>
      <h3>For sliders, presentations, banners, accordions, and other step-based applications</h2>
    </li>
    <li>
      <h2>No Restrictions, Endless Possibilities</h2>
      <h3>Use the HTML and CSS syntax you're used to. No JavaScript knowledge required.</h3>
    </li>
  </ul>
</div>
```

By default Sequence also controls the `z-index` property for steps using the `moveActiveStepToTop` option. In the above HTML, the newly active second step is given a `z-index` the equivalent of the number of steps being used (3), and the previously active step is given a `z-index` one less than that.

This process is applied to each step as and when that step becomes active.

When the last step is active, if the `cycle` option is enabled (which it is be default), Sequence will remove the `animate-in` class from step 3, and add `animate-out`. Then, step 1 has the `animate-out` class removed (resetting its elements back to their starting positions), and adds `animate-in` again.

### Support for Legacy Browsers

As Sequence is powered entirely by CSS transitions and some older browsers still in use today don't support these features, Sequence takes extra measures to ensure content is still viewable.

When Sequence is launched, it tests to see if the browser supports CSS transitions, if it doesn't then fallback mode is activated.

In fallback mode, Sequence gives all steps a class of `animate-in` and will then restructure the canvas and steps so that they sit side-by-side, much like a traditional slider. When the user navigates between steps, the canvas is animated and moved to the relevant step. This way, the user still gets to see all of the content available in your Sequence theme, just without so many fancy effects. Animation of the canvas is controlled via JavaScript.

## Options

Sequence comes with many options that allow you to easily control its features and how it behaves.

As explained in Initiate Sequence, each instance of Sequence can be passed developer defined options that override Sequence’s defaults. Options are stored in an object passed to the `sequence()` function, like so:

```html
<script>

  // Get the Sequence element
  var sequenceElement = document.getElementById("sequence");

  // Change Sequence's default options
  var options = {
    autoPlayThreshold: 500
  };

  // Initiate Sequence
  var sequence1 = sequence(sequenceElement, options);
</script>
```

Multiple instances of Sequence can be passed the same options:

```html
<script>

  // Get the Sequence elements
  var sequenceElement1 = document.getElementById("sequence1");
  var sequenceElement2 = document.getElementById("sequence2");

  // Change Sequence's default options
  var options = {
    autoPlayThreshold: 500
  };

  // Initiate Sequence
  var sequence1 = sequence(sequenceElement1, options);
  var sequence2 = sequence(sequenceElement2, options);
</script>
```

Or differing options:

```html
<script>

  // Get the Sequence elements
  var sequenceElement1 = document.getElementById("sequence1");
  var sequenceElement2 = document.getElementById("sequence2");

  // Change Sequence's default options
  var options1 = {
    autoPlayThreshold: 500
  };

  var options2 = {
    autoPlayThreshold: 1000
  }

  // Initiate Sequence
  var sequence1 = sequence(sequenceElement1, options1);
  var sequence2 = sequence(sequenceElement2, options2);
</script>
```


The following is the complete set of options implemented within Sequence:

### General

#### `startingStepId`

- Type: Number
- Default: `1`

The step that should first be displayed when Sequence loads.

#### `startingStepAnimatesIn`

- Type: true/false
- Default: `false`

Whether the starting step should animate in to its active position.

- `true`: The starting step will begin in its "start" position and move to its "animate-in" position when Sequence loads.
- `false`: The starting step will begin in its "animate-in" position when Sequence loads.

#### `cycle`

- Type: true/false,
- Default: `true`

Whether Sequence should navigate to the first step after the last step and vice versa.

- `true`: When a user navigates forward from the last step, Sequence will go to the first step. Likewise, when a user navigates backwards from the first step, Sequence will go to the last step.
- `false`: When a user navigates forward from the last step or backwards from the first step, Sequence will not go to another step.

#### `phaseThreshold`

- Type: true/false or a number representing milliseconds
- Default: `true`

Whether there should be a delay between a step animating out and the next animating in.

- `true`: the next step will not animate in until the current step has completely animated out.
- `false`: the next step will animate in at the same time as the current step animating out.
- A number: The amount of milliseconds to wait after animating the current step out, before the next step is animated in.

#### `reverseWhenNavigatingBackwards`

- Type: true/false
- Default: `false`

Whether animations should be reversed when a user navigates backwards by clicking a previous button/swiping/pressing the left key.

- `true`: when navigating backwards, Sequence will animate the preceding step from its "animate-out" position to its "animate-in" position (creating a reversed animation).
- `false`: when navigating backwards, Sequence will animate the preceding step from its "start" position to its "animate-in" position (as it does when navigating forwards).

#### `moveActiveStepToTop`

- Type: true/false
- Default: `true`

Whether a step should be given a higher `z-index` than other steps whilst it is active, to bring it above the others.

- `true`: an active step will be given a `z-index` value the same as the number of steps in the Sequence instance (bringing it to the top) and the previous step will be given a `z-index` value one less than the number of steps in the Sequence instance.
- `false`: steps will not have a `z-index` applied to them.

### <a id="canvas-animation">Canvas Animation</a>

Canvas animation causes Sequence to automatically animate the canvas element to show the next step. Automatic animation consists of finding the next step's position and then directly animating to it.

If you'd like to customize how the canvas animates, set `animateCanvas` to `false`. Regardless of the `animateCanvas` option, the Sequence element is given a class representing the current step being viewed. `step1`, `step2`, and so on. These classes allow you to control canvas animation manually.

**Browser Support**: In modern browsers, animation is powered by CSS transitions and JavaScript in non-supporting browsers.

#### `animateCanvas`

- Type: true/false
- Default: `true`

Whether Sequence should automatically control the canvas animation when a step is navigated to.

- `true`: Sequence will control the canvas animation when a step is navigated to.
- `false`: Sequence will not control the canvas animation when a step is navigated to.

There are two reasons you may want to disabled `animateCanvas`:

1. You don't need the canvas to animate because its steps are layered on top of each other using `position: absolute;`.
2. You want to manually control the canvas animation. When step 1 is viewed, the Sequence element will be given the class of `step1`, and so on. Using these classes you can control animation manually using either CSS3 or JavaScript via Sequence's [API](#api).

#### `animateCanvasDuration`

- Type: A number representing milliseconds
- Default: `500`
- Dependencies: `animateCanvas: true`

The amount of time it should take the canvas to automatically animate to the next step.

### <a id="autoplay-options">Autoplay Options</a>

AutoPlay causes Sequence to automatically navigate to the next step every X amount of milliseconds. AutoPlay by default is paused when the user hovers over the Sequence element and can also be paused/unpaused via the [API](#api).

#### `autoPlay`

 - Type: true/false
 - Default: `false`

Cause Sequence to automatically navigate to the next step after a period of time, as defined in `autoPlayThreshold`.

- `true`: Sequence will automatically navigate from step to step with a delay between each step (specified using the `autoPlayThreshold` option).
- `false`: Sequence will display the starting step until a user chooses to navigate using next/previous buttons, swiping, etc.

#### `autoPlayThreshold`

- Type: a number representing milliseconds
- Default: `5000`
- Dependencies: `autoPlay: true`

The duration in milliseconds to wait before navigating to the next step.

#### `autoPlayDirection`

- Type: a number (`1` = forward, `-1` = reverse)
- Default:`1`
- Dependencies: `autoPlay: true`

The direction in which Sequence's `autoPlay` should navigate.

- `1`: Sequence will navigate forwards, from step to step
- `-1`: Sequence will navigate backwards, from step to step

### <a id="navigation-skipping-options">Navigation Skipping Options</a>

Navigation skipping controls whether a step can be navigated to whilst another is actively animating and how to most gracefully deal with skipped steps when enabled.

#### `navigationSkip`

- Type: true/false
- Default: `true`

Whether the user can navigate through steps before another step has finished animating.

- `true`: The user can navigate to another step whilst the current one is mid animation
- `false`: The user is prevented from navigating to another step whilst the current one is mid animation

#### `navigationSkipThreshold`

- Type: a number representing time in milliseconds
- Default: `250`
- Dependencies: `navigationSkip: true`

Amount of time that must pass before the next step can be navigated to. Example, if the user hits the next button, a period of 250ms (by default) must pass before they can navigate to another step.

#### `fadeStepWhenSkipped`

- Type: true/false
- Default: `true`
- Dependencies: `navigationSkip: true`

If a step is skipped before it finishes animating, cause it to fade out over a specific period of time (see `fadeFrameTime`).

#### `fadeStepTime`

- Type: a number representing time in milliseconds
- Default: `500`
- Dependencies: `navigationSkip: true`, `fadeFrameWhenSkipped: true`

How quickly a step should fade out when skipped (in milliseconds).

**Browser Support**: In modern browsers, animation is powered by CSS transitions and JavaScript in non-supporting browsers.

#### `preventReverseSkipping`

- Type: true/false
- Default: `false`
- Dependencies: `navigationSkip: true`

Whether the user can change the direction of navigation during steps animating (if navigating forward, the user can only skip forwards when other steps are animating but not backwards, and vice versa).

### <a id="nextprevious-button-options">Next/Previous Button Options</a>

Next and previous buttons allow the user to navigate between steps.

By default, these buttons are enabled, however, Sequence doesn't automatically add these elements so the necessary HTML must be added to the page. For example, a next button can be added using the default class `sequence-next`, like so:

```html
<div class="sequence-next">Next →</div>
```

Any element can be used as a next/previous button, as long as it is given the specified selector and is clickable.

#### `nextButton`

- Type: true/false or a CSS selector
- Default: `true`

Defines a button that when clicked, causes the current step to animate out and the next to animate in.

- `true`: Use a next button with the default CSS selector (`.sequence-next`)
- `false`: Don't use a next button
- CSS Selector: Use a next button but change the default selector to something of your own liking.

Note: the button must be added to the HTML manually.

#### `prevButton`

- Type: true/false or a CSS selector
- Default: `true`

Defines a button that when clicked, causes the current step to animate out and the previous to animate in.

- `true`: Use a previous button with the default CSS selector (`.sequence-prev`)
- `false`: Don't use a previous button
- CSS Selector: Use a previous button but change the default selector to something of your own liking.

Note: the button must be added to the HTML manually.

### <a id="pause-options">Pause Options</a>

Sequence's pause options apply when `autoPlay` is set to `true`. Pausing Sequence will prevent `autoPlay` from continuing, until it is unpaused again. Pause and unpause can be manipulated via the [API](#api).

As with next/previous buttons, by default, the pause buttons is enabled, however, Sequence doesn't automatically add the element so the necessary pause button HTML must be added to the page. For example, a pause button can be added using the default class `sequence-pause`, like so:

```html
<div class="sequence-pause">||</div>
```

Any element can be used as a pause button, as long as it is given the specified selector and is clickable.

Note: Sequence can either be soft paused or hard paused. Soft pause is used internally and still allows the `pauseOnHover` option to pause/unpause autoPlay when the Sequence element is hovered over (assuming this option is set to `true`). When Hard paused the `pauseOnHover` option will have no effect. Think of hard pause as stopping autoPlay altogether, until it is explicitly started again either via the user pressing a pause button or via use of `.pause()`, `.togglePause()` from the [API](#api).

#### `pauseButton`

- Type: true/false or a CSS selector
- Default: `true`
- Dependencies: `autoPlay: true`

Defines a button that when clicked, pauses the autoPlay feature.

- `true`: Use a pause button with the default CSS selector (`.sequence-pause`)
- `false`: Don't use a pause button
- CSS Selector: Use a pause button but change the default selector to something of your own liking.

Note: the button must be added to the HTML manually.

#### `unpauseThreshold`

- Type: a number representing time in milliseconds
- Default: same value as `autoPlayThreshold`
- Dependencies: `autoPlay: true` and `pauseButton: true` or `pauseButton: "<CSS selector>"`

The time Sequence should wait before starting autoPlay again once the user unpauses Sequence. The default value will be the same as `autoPlayThreshold`.

If you want Sequence to immediately navigate to the next step when unpaused, set this to `0`. This may be a good idea when your Sequence instance has no visual representation of being unpaused because the next step will immediately be navigated to and the user will see their interaction with the page had an immediate effect.

#### `pauseOnHover`

- Type: true/false
- Default: `true`
- Dependencies: `autoPlay: true`

Whether autoPlay should pause when the user hovers over Sequence. autoPlay will continue again when the user moves their cursor outside of Sequence.

Note: The user is only deemed to be hovering over Sequence when their cursor is within the containing element's boundaries.

### <a id="pagination-options">Pagination Options</a>

Pagination allows for a list of links that represents each step within Sequence. These links can be clicked to navigate to the relevant step.

#### `pagination`

- Type: true/false or a CSS selector
- Default: `true`

Pagination associates immediate descendant elements within the pagination selector (`.sequence-pagination` by default) to each Sequence step. If `pagination` is `true`, the following HTML can be included in your document to act as pagination:

```html
<ul class="sequence-pagination">
  <li>Step 1</li>
  <li>Step 2</li>
  <li>Step 3</li>
</ul>
```

When the first `<li>` element is clicked, Sequence will navigate to its first step. When the second is clicked, Sequence will navigate to its second step, and so on.

The pagination and its immediate descendants can consist of any element(s). So, if you'd prefer, you could use `<div>` and `<button>` elements instead of `<ul>` and `<li>` elements, like so:

```html
<div class="sequence-pagination">
  <button>Step 1</button>
  <button>Step 2</button>
  <button>Step 3</button>
</div>
```

The immediate descendants can also have child elements of their own. These additional elements do not affect how the pagination works.

When a Sequence step is navigated to (via any navigation method, such as clicking pagination links, pressing a keyboard key etc), the associated pagination link will be given a class of `current`, so you can style the current pagination link as you wish:

HTML:

```html
<ul class="sequence-pagination">
  <li>Step 1</li>
  <li class="current">Step 2</li>
  <li>Step 3</li>
</ul>
```

CSS:

```css
.sequence-pagination .current {
  font-weight: bold;
}
```

- `true`: Use pagination with the default CSS selector (`.sequence-pagination`)
- `false`: Don't use pagination
- CSS Selector: Use pagination but change the default selector to something of your own liking.

Note: the pagination elements must be added to the HTML manually.

### <a id="preloader-options">Preloader Options</a>

Sequence's preloader allows the ability to hide content or display some form of loading indicator until your chosen content has loaded.

Sequence relies on the third-party [imagesLoaded](https://github.com/desandro/imagesloaded/) to determine when images have loaded.

#### `preloader`

- Type: true/false or a CSS selector
- Default: `false`

- `true`: Append the default preloader element with the CSS selector (`.sequence-preloader`) to the Sequence element, and add the preloader styles to `<head></head>`
- `false`: Don't use a preloader
- CSS Selector: Use a preloader but change the default selector to something of your own liking and don't use default styles, use your own instead.

When the preloader is being used, the Sequence element is give a class of `sequence-preloading` during the preloading phase, then `sequence-preloaded` when preloading is complete.

Note: when using the default preloader, default styles are also applied. These styles can be overwritten via CSS (except for the animation wich is driven by SVG) . If you'd like a more unique preloader, it's recommend you use a CSS selector for the `preloader` element and apply your own preloader element to the page for styling however you please.

If using `preloader: true`, and the browser supports SVG, the following preloading HTML will be applied to the document:

HTML:

```html
<div class="sequence-preloader">
    <svg class="preload" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle" cx="6" cy="6" r="6" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle class="circle" cx="22" cy="6" r="6" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="150ms" repeatCount="indefinite" />
      </circle>
      <circle class="circle" cx="38" cy="6" r="6" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="300ms" repeatCount="indefinite" />
      </circle>
    </svg>
</div>
```

If Using `preloader: true`, and the browser *doesn't* support SVG, the following preloader HTML will be applied to the document:

```html
<div class="preload fallback">
  <div class="circle"></div>
  <div class="circle"></div>
  <div class="circle"></div>
</div>
```

**Browser support**: The SVG preloader will automatically animate the preloader icon using Sequence's default animation. When the browser doesn't support SVG, JavaScript will instead be used to animate the preloader icon.

If Using `preloader: true`, the following CSS is added to layout the preloader:

CSS:
```css
  .sequence-preloader {
    position: absolute;
    z-index: 9999;
    height: 100%;
    width: 100%;
  }

  .sequence-preloader .preload .circle {
    position: relative;
    top: -50%;
    display: inline-block;
    height: 12px;
    width: 12px;
    fill: #ff9442;
  }

  .preload {
    position: relative;
    top: 50%;
    display: block;
    height: 12px;
    width: 48px;
    margin: -6px auto 0 auto;
  }

  .preload-complete {
    opacity: 0;
    visibility: hidden;
    transition: .5s;
  }

  .preload.fallback .circle {
    float: left;
    margin-right: 4px;
    background-color: #ff9442;
    border-radius: 6px;
  }
```

**Note**: Vendor prefixes are omitted from the above CSS for brevity.

#### `preloadTheseSteps`

- Type: An integer array containing a list of step numbers
- Default: `[1]`
- Dependencies: `preloader: true`

Specify which steps should have their images loaded before Sequence initiates. By default, images in the first step are loaded before Sequence initiates.

The following example will load all images in steps 1 and 2:

```javascript
preloadTheseSteps: [1, 2]
```

#### `preloadTheseImages`

- Type: A string array containing a list of image sources
- Default: `[]`
- Dependencies: `preloader: true`

Specify which images should be loaded before Sequence initiates. By default, no individual images are loaded (note that all images in step 1 load by default, as described in the `preloadTheseSteps` option).

The following example will load all images in step 1 (via the `preloadTheseSteps` option), as well as an image from step 2, an image in the footer of the page, and an image applied via CSS:

	preloadTheseFrames: [1],
	preloadTheseImages: [
		"images/step2image.png",
		"images/footer-logo.png",
    "css/images/background.png"
	]

#### `hideStepsUntilPreloaded`

- Type: true/false
- Default: `true`
- Dependencies: `preloader: true`

Specify whether steps should be hidden during preloading and then shown afterwards.

- `true`: Hide steps until preloaded
- `false`: Don't hide steps during preloading

### <a id="keyboard-options">Keyboard Options</a>

Keyboard options enable the user to navigate to steps using specific keyboard buttons.

#### `keyNavigation`

- Type: true/false
- Default: `true`

Whether to allow the user to navigate between steps using the left/right arrow keys, and/or numeric keys.

#### `numericKeysGoToSteps`

- Type: true/false
- Default: `true`

Whether Sequence should go to a specific step when the user presses a numeric key. Pressing 1 goes to step 1, 2 to step 2, and so on.

#### `keyEvents`

- Type: An object or false

The public Sequence method that should occur when the left or right arrow keys are pressed.

By default the `keyEvents` option is the following object:

```javascript
keyEvents: {
  left: function(sequence) {sequence.prev()},
  right: function(sequence) {sequence.next()}
}
```

When the left button is pressed, the Sequence event `self.prev()` is initiated. `self.next()` is initiated when the right button is pressed.

- object: An object containing `left` and `right` properties that have a related public method to executed when the left and right buttons are pressed
- `false`: No keyboard events


### <a id="touch-swipe-options">Touch Swipe Options</a>

Touch swipe capabilities are powered via the third-party library [Hammer.js](http://eightmedia.github.io/hammer.js/).

#### `swipeNavigation`

- Type: true/false
- Default: `true`

Whether to allow the user to navigate between steps by swiping left and right on touch enabled devices.

#### `swipeEvents`

- Type: An object or false
- Default: `{left: "prev", right: "next", up: false, down: false}`**

The public Sequence method that should occur when the user swipes in a particular direction.

By default the `swipeEvents` option is the following object:

```javascript
swipeEvents: {
  left: function(sequence) {sequence.prev()},
  right: function(sequence) {sequence.next()},
  up: false,
  down: false
},
```

When the user swipes left, the Sequence event `self.prev()` is initiated. `self.next()` is initiated when the user swipes right.

- object: An object containing `left`, `right`, `up`, and `down` properties that have a related public method to executed when the user swipes in one of those directions
- `false`: No swipe events

### <a id="hash-tag-options">Hash Tag Options</a>

When enabled, the hash tag options will append a hash tag to a page's URL, reflecting the currently active slide's `id` or `data-sequence-hashtag` attribute.

Note: The hashTags options make use of a "hash bang", a hash followed by an exclamation point `#!`. This is to prevent the browser from jumping when the URL is changed.

**Browser Support**: In supporting browsers, [pushState](http://caniuse.com/#search=pushstate) is used to change the URL.

#### `hashTags`

- Type: true/false
- Default: `false`

- `true`: When a step is navigated to and becomes active, the hash tag will change to reflect the steps `id` attribute
- `false`: the hash tag will not change

In the following example, when `hashTags` is enabled and the second step becomes active, the URL will be changed to end with the hash tag `#!second-step`. The name "second-step" is taken from the step's `id` attribute.

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li id="intro">
      <h2>Built using Sequence.js</h2>
    </li>
    <li id="second-step">
      <h2>Super awesome!</h2>
    </li>
  </ul>
</div>
```

#### `hashDataAttribute`

- Type: true/false
- Default: `false`
- Dependencies: `hashTags: true`

- `true`: the hash tag name, will not be taken from the step's `id` attribute but instead a data attribute called `data-sequence-hashtag`.
- `false`: Use the `id` attribute instead of the data attribute.

In the following example, when `hashTags` and `hashDataAttribute` are true, and the first step becomes active, the URL will be changed to end with the hash tag `#!superAwesome`.

```html
<div id="sequence">
  <ul class="sequence-canvas">
    <li id="intro" data-sequence-hashtag="superAwesome">
      <h2>Built using Sequence.js</h2>
    </li>
  </ul>
</div>
```

#### `hashChangesOnFirstStep`

- Type: true/false
- Default: `false`
- Dependencies: `hashTags: true`

Whether the hash tag should be changed when the first step becomes active.

- `true`: The hash tag will change as soon as Sequence is initiated
- `false`: The hash tag will not change when the first step becomes active but will change for every other step after that

### <a id="fallback-theme-for-legacy-browsers">Fallback Theme for Legacy Browsers</a>

The fallback theme options control Sequence when it is being viewed in browsers that do not support CSS transitions. Please see [caniuse.com for CSS3 transition browser compatibility](http://caniuse.com/#search=transitions).

Fallback theme options are included in the options of each instance of Sequence, like so:

```javascript
<script>
  var options = {
    fallback: {
      speed: 500,
      layout: "auto"
    }
  };

  var sequenceElement = document.getElementById("sequence");

  var sequence1 = sequence(sequenceElement, options);
</script>
```

#### `speed`

- Type: a number representing milliseconds
- Default: `500`

The speed at which steps should transition between one another when in fallback mode.

#### `layout`

- Type: a string - `"auto"` | `"basic"` | `"custom"`
- Default: `"auto"`

The layout to be used when in fallback mode.

- `"auto"`: Sequence will detect the best layout to use based on the `animateCanvas` option. If `animateCanvas `is false, the "basic" layout will be used. If `animateCanvas` is true, the "custom" layout is used
- `"basic"`: Layout each step in one row using inline-block
- `"custom"`: Assume the developer defined layout is to be used and don't layout the steps in any way.

## <a id="api">API</a>

Sequence's API allows you to use its [properties](#properties), [methods](#methods) and [callbacks](#callbacks) to extend its functionality.

### <a id="callbacks">Callbacks</a>

Callbacks allow you to execute custom JavaScript functions at specific key points during Sequence's operation. For example, callbacks are executed every time Sequence is paused/unpaused, allowing you to change the text of a pause button.

A callback can be accessed via the variable Sequence is saved in, like so:


```javascript
<script>  
  var sequenceElement = document.getElementById("sequence");
  var mySequence = sequence(sequenceElement);

  // When Sequence is paused
  mySequence.paused = function() {

    // Add code to execute here, such as:
    alert("Sequence's auto play featured is paused");
  }

  // When Sequence is unpaused
  mySequence.unpaused = function() {

    // Add code to execute here, such as:
    alert("Sequence's auto play featured is unpaused");
  }
</script>
```

#### `paused(sequence)`
Executed when autoPlay is paused.

- `sequence`: All properties and methods available to this instance

#### `unpaused(sequence)`
Executed when autoPlay is unpaused.

- `sequence`: All properties and methods available to this instance

#### `animationStarted(id, sequence)`
Executed when a step animation starts.

- `id`: The id of the step that started animating in
- `sequence`: All properties and methods available to this instance

#### `animationFinished(id, sequence)`
Executed when a step animation finishes (both the animate-in and animate-out phases finish).

- `id`: The id of the step that finished animating in

#### `currentPhaseStarted(sequence)`
Executed when the current phase starts animating out.

- `sequence`: All properties and methods available to this instance

#### `currentPhaseEnded(sequence)`
Executed when the current phase finishes animating out.

- `sequence`: All properties and methods available to this instance

#### `nextPhaseStarted(sequence)`
Executed when the next phase starts animating in.

- `sequence`: All properties and methods available to this instance

#### `nextPhaseEnded(sequence)`
Executed when the next phase finishes animating in.

- `sequence`: All properties and methods available to this instance

#### `throttledResize(sequence)`
Executed every 100 milliseconds when the browser window is resized.

- `sequence`: All properties and methods available to this instance

#### `preloaded(sequence)`
Executed when Sequence has finished preloading.

- `sequence`: All properties and methods available to this instance

#### `preloadProgress(result, src, progress, length, sequence)`
Executed for every image that Sequence preloads.

- `result`: Whether the image is "loaded" or "broken"
- `src`: The source of the image
- `progress`: The number of images that have returned a result
- `length`: The total number of images that are being preloaded

Example use:

```javascript
sequence.preloadProgress = function(result, src, progress, length) {

  console.log( "image is " + result + " for " + src );
  console.log("progress: " + progress + " of " + length);
}
```

Example output to the web browser's console:

```
image is loaded for "images/smiley.gif"
progress: 1 of 4
```

### <a id="methods">Methods</a>

Public methods are the functions that Sequence utilises, made available for developers to extend and enhance their particular instance.

#### `goTo(id, direction, ignoreTransitionThreshold)`

Causes Sequence to animate to a specific step.

- `id` (required): The ID of the step to go to
- `direction` (optional): Direction to get to the step (`1` = forward, `-1` = reverse)
- `ignoreTransitionThreshold` (optional): if `true`, ignore the `phaseThreshold` option and immediately go to the specified step.

If a "direction" is not specified, Sequence will determine the shortest direction to the step and use that. For example, if `cycle` is enabled, going from step 1 to 4 will use a direction of `-1`, as going in reverse is the shortest direction.

Examples:

```javascript
// Navigate forward to step 3
sequence.goTo(3, 1);

// Navigate in reverse to step 2
sequence.goTo(2, -1);
```

#### `next()`

Causes Sequence to go to the next step.

Example:
```javascript
sequence.next();
```

#### `prev()`

Causes Sequence to go to the previous step.

Example:
```javascript
sequence.prev();
```

#### `pause()`

Pause Sequence's autoPlay feature.

Example:
```javascript
sequence.pause();
```

#### `unpause()`

Unpause Sequence's autoPlay feature.

Example:
```javascript
sequence.unpause();
```

Note: even if `autoPlay` is disabled in the options, autoPlay can still later be enabled by using the `unpause()` method.

#### `togglePause()`

Pause or unpause Sequence's autoPlay feature based on its current state.

Example:
```javascript
sequence.togglePause();
```

Note: even if `autoPlay` is disabled in the options, autoPlay can still later be enabled by using the `togglePause()` method.

#### `destroy(navigation, callback)`

**Not yet available in v2 pre-alpha.**

Remove Sequence from the element it is attached to, along with events and other related elements such as navigation.

- `navigation` (optional): if false, Sequence won't remove navigation elements such as next and previous button. Navigation elements will be removed by default.
- `callback` (optional): a callback to execute after the `.destroy()` function has finished. You can also use the public callback `.destroyed()`.

### <a id="properties">Properties</a>

Properties can be used to get certain information about the state of Sequence, for example, the ID of the current step.

Properties can be taken from the variable the Sequence object is saved in to, like so:

```javascript
<script>  
  var sequenceElement = document.getElementById("sequence");
  var mySequence = sequence(sequenceElement);

  alert(mySequence.currentStepId);
</script>
```

Or from the last argument of a callback:

```javascript
<script>  
  var sequenceElement = document.getElementById("sequence");
  var mySequence = sequence(sequenceElement);

  mySequence.animationStarted(id, sequence) = function() {

    alert(sequence.currentStepId);
  }
</script>
```

#### `animationMap`

- Type: Object

Returns an object used by Sequence to know how many steps it will consist of, the elements that will animate, and their durations.

#### `animationsSupported`

- Type: true/false

Returns whether the browser supports CSS animations.

#### `canvas`

- Type: HTMLElement

Returns the HTML element used as Sequence's canvas.

#### `canvasPreviousPosition`

- Type: Array

Returns an array containing X, Y coordinates of the canvas' previous position.

#### `currentStepId`

- Type: Number

Returns a number representing the step that is currently being viewed.

#### `direction`

- Type: Number

Returns a number representing the direction Sequence is last navigated in.

- `1`: Forward
- `-1`: Reverse

#### `element`

- Type: HTMLElement

Returns the HTML element used as Sequence's container.

#### `elementsAnimating`

- Type: Array

Returns an array containing the HTML elements currently being animated by Sequence.

#### `isActive`

- Type: true/false

Returns whether a Sequence step is currently animating.

#### `isAutoPlayActive`

- Type: true/false

Returns whether autoPlay is enabled.

#### `isHardPaused`

- Type: true/false

Returns whether autoPlay is hard paused.

Sequence can either be soft paused or hard paused. Soft pause is used internally and still allows the `pauseOnHover` option to pause/unpause autoPlay when the Sequence element is hovered over (assuming this option is set to `true`). When Hard paused the `pauseOnHover` option will have no effect. Think of hard pause as stopping autoPlay altogether, until it is explicitly started again either via the user pressing a pause button or via use of `.pause()`, `.togglePause()` from the [API](#api).

#### `isPaused`

- Type: true/false

Returns whether autoPlay is paused.

#### `navigationSkipThresholdActive`

- Type: true/false
- Dependencies: `navigationSkip: true`

Returns whether the navigationSkipThreshold is currently active (preventing the user from skipping steps).

#### `nextButton`

- Type: Array
- Dependencies: `nextButton: true` | `nextButton: <CSS Selector>`

Returns an array containing the HTML elements used as Sequence's next button(s).

#### `noOfSteps`

- Type: Number

Returns the number of steps the Sequence instance is made up of.

#### `options`

- Type: Object

Returns Sequence's options - defaults combined with developer defined options.

#### `pagination`

- Type: Array
- Dependencies: `pagination: true` | `pagination: <CSS Selector>`

Returns an array containing the HTML elements used as Sequence's pagination.

#### `pauseButton`

- Type: Array
- Dependencies: `pauseButton: true` | `pauseButton: <CSS Selector>`

Returns an array containing the HTML elements used as Sequence's pause button(s).

#### `prevButton`

- Type: Array
- Dependencies: `prevButton: true` | `prevButton: <CSS Selector>`

Returns an array containing the HTML elements used as Sequence's previous button(s).

#### `prevStepId`

- Type: Number

Returns a number representing the step that was previously being viewed (the one before `currentStepId`).

#### `steps`

- Type: Array

Returns an array containing the HTML elements used as Sequence's steps.


#### `transitionsSupported`

- Type: true/false

Returns whether the browser supports CSS transitions.

## Using Grunt

// TODO

## Need Support?

We want to make your time spent with Sequence as easy and enjoyable as possible. If the documentation didn't answer your question, solve your problem, or didn't quite make sense, we'd love to hear from you.

Here's how you can get more help:

- Visit [Sequence's GitHub Project Page](https://github.com/IanLunn/Sequence)
- [Contact us](http://sequencejs.com/contact/)
- Send a tweet to [@IanLunn](https://twitter.com/IanLunn)
