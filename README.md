Sequence v2
===========

Sequence.js -- originally released in 2011 -- is to be rebuilt from the ground up. This README documents major issues and considerations, and the philosophy for approaching the build.

## Philosophy

Sequence v2 will adhere to the following:

- To be written with vanilla JavaScript
- No "baked-in" dependencies
- Exposed API for integration with third-party dependencies
- AMD support
- Support all modern browsers and devices
- Graceful Degradation (Fallbacks for browsers without CSS3 transitions and transforms support)
- Semantic and easy to use markup


## Major Issues

The following are major issues present in Sequence v1 that need to be solved to make Sequence v2 a viable solution:

- Being Required and Limited to Animating All Top-level Elements
- Frames don't stack well via z-index
- Animations stop and get snappy when a mobile/tablet window is scrolled (solved)
- Build process


### Being Required and Limited to Animating All Top-level Elements

A major drawback with Sequence v1 is that all top-level elements within a frame MUST be animated. This is so that Sequence can watch those top-level elements to know when they have finished animating, to then be able to start the `autoPlay` timer and start the next frames animations.

This results in two problems:

1. Users aren't always aware they MUST animate top-level elements; when they don't Sequence may cease to function as expected
2. Second-level elements and beyond aren't included in Sequence's `transitionEnd` event and as such, Sequence may animate the next frame's animations prior to these lower level elements finishing animating.

Ideally with Sequence v2, users will be able to animate any element they wish without limitations.

Solution: Sequence v2 must know exactly which elements are going to animate so it can then watch them with the `transitionEnd` event. How Sequence v2 determines this will depend on how Sequence's animations are defined (as explained in consideration #1: Animations to be Written via CSS or JavaScript).

### Frames Don't Stack Well via z-index

In Sequence v1, an active frame is immediately given a higher z-index than other frames to make it appear on top.

For most Sequence v1 themes this is find because frames don't overlap each other; inactive frames would fade or slide out of view, revealing the active frame.

In themes such as [Ken Burns Effect](http://www.sequencejs.com/themes/ken-burns-effect/), where images within separate frames sit on top one another, this causes an undesired "snapping" effect where an active frame may immediately snaps in front of the previously active frame. To workaround this, the Ken Burns Effect will hide the contents of an active frame and slowly fade it in. This way, the previously active frame will still be visible (despite having a lower z-index than the newly active frame), until the active frame fades in; hiding the previous frame.

There are two problems with this workaround:

1. The workaround will only work when a image is placed within an `<img />` element. The original build of the Ken Burns Theme placed the images via a CSS `background` property instead. Some hacking on the `<img />` tag is required to produce a `background-size: cover` type of effect that could have been easily achieved if the workaround wasn't necessary.
2. This workaround is non-intuitive and not immediately apparent to a developer.

Potential solution (with drawback): One solution is to use JavaScript to change the position of the active element within the DOM. By placing the active element after all other elements, it will naturally appear on top of them without the need for a `z-index`. This solution would allow for Sequence options that determine exactly when a frame becomes active (before or after it animates in), as well as giving the developer the freedom to apply a `z-index` to the element should they wish. A drawback to this solution is that if elements are rearranged in the DOM, the developer can no longer use an `nth-child` selector within their CSS because the position of elements will continue to change. If Sequence v2 goes ahead with writing animations via CSS (as described in consideration #1 Animations to be Written via CSS or JavaScript), this could lead to an unintuitive experience for the developer.

### Animations Stop and Get Snappy When a Mobile/Tablet Window is Scrolled (Solved)

**This solution has been tested and will be integrated into Sequence v2**

When Sequence v1 makes use of the touch swipe event to allow navigation between slides, animations can sometimes stop and get snappy when the window is scrolled. For example: if the page Sequence is on has a vertical scroll bar, when the user swipes sideways to go to the previous/next slide, but does so in a way that causes the window to scroll up/down at the same time, the animations will stop and appear to be snappy.

Solution: A third party touch library should be used that prevents horizontal scrolling whilst the user is swiping vertically. Consider [hammer.js](https://github.com/EightMedia/hammer.js/).

### Build Process

As sequence.js is packaged with many themes, it is necessary for a build process to be put in place that repackages these themes each time a new version of sequence.js is released. With v1 of Sequence, this process has to be done manually -- moving sequence.js into a theme's directory then zipping it -- for each and every theme.

Solution: Grunt.js should be utilised to package themes with that themes dependencies, the latest version of both sequence.js and sequence.min.js, as well as any additional files such as README and LICENSE.

## Major Considerations

The following are major considerations that should be decided upon prior to Sequence v2 being written.

### Animations to be Written via CSS or JavaScript

In Sequence v1, all animations are written using CSS3 transitions and animations. This makes creating themes with Sequence v1 more accessible to developers as JavaScript knowledge isn't required. This way of creating animations is a major selling point of Sequence v1. It adds additional problems to Sequence v1's development though.

It should be decided whether Sequence v2 will continue allowing a developer to create animations written in CSS3, instead specify animations via data-attributes applied to animated elements, or a hybrid of the two.

#### CSS3 Animations Pros & Cons

Pros:

- More accessible to a wider range of theme developers

Cons:

- Harder for Sequence to know what elements are to be animated (See issue #1: Being Required and Limited to Animating All Top-level Elements)

#### Data Attributes Pros & Cons

Pros:

- Easier for Sequence to know what elements are to be animated (See issue #1: Being Required and Limited to Animating All Top-level Elements)
- Easier for developers wanting to create themes dynamically (to create a theme builder etc)

Cons:

- Not as accessible to develop themes
