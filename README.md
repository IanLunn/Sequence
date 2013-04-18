#Sequence - The Responsive Slider with Advanced CSS3 Transitions
Sequence provides the complete functionality for a website slider without forcing you to use a set theme. In fact, Sequence has no in-built theme, leaving you complete creative control to build a unique slider using only CSS3 -- no jQuery knowledge required!

##Features
- Unique transition styles created using CSS3
- Supports all modern browsers
- Gracefully degrades in older browsers*
- Supports responsive layouts
- Supports touch devices and swiping
- Many developer features with even more to come
- Semantic and easy to use markup
- Open source

*Tested down to Firefox 3.6 and IE7. Extensive support details to come.

##Theme Demos
- [Modern Slide In](http://www.sequencejs.com/themes/modern-slide-in/)
- [Modern Slide In (with hashTags enabled)](http://www.sequencejs.com/themes/modern-slide-in-hashtags/)
- [Sliding Horizontal Parallax](http://www.sequencejs.com/themes/sliding-horizontal-parallax/)
- [Apple Style](http://www.sequencejs.com/themes/apple-style/)
- [Basic Slide](http://ianlunn.github.com/Sequence/themes/basic-slide)
- [Basic Crossfade](http://ianlunn.github.com/Sequence/themes/basic-crossfade)
- [Documentation Demo](http://www.sequencejs.com/themes/documentation-demo/) (the theme built using the documentation)

##Documentation
Documentation can be found here: [SequenceJS Demo](https://github.com/IanLunn/Sequence/blob/master/documentation.md).

##Author
[@Ian Lunn](http://twitter.com/#!/IanLunn)

##License
sequence.js is a FREE script and is licensed under the following:
http://www.opensource.org/licenses/mit-license.php

Theme files, their HTML, CSS, JavaScript/jQuery and images are licensed under the following unless otherwise stated:
http://www.opensource.org/licenses/mit-license.php

[SequenceJS.com](http://www.sequencejs.com/), the sequence.js script and its dependencies are &copy; 2012 - 2013 [Ian Lunn Design](http://www.ianlunn.co.uk/) unless otherwise specified.

Full [license information can be found on the SequenceJS.com website](http://www.sequencejs.com/developers/license-information/).

##Please Consider Supporting Future Sequence.js Development

Sequence.js has been in development for over 18 months. Whilst we think it's great already, we have many plans for the future. Aside from improving Sequence.js and making many more themes available, we're also working on a WordPress plugin and a visual theme editor. As Sequence.js and many of its themes are completely free, we can't commit as much time to these awesome ideas as we'd like because we're busy with paid client work. With your support, we can donate more time to turning these ideas into reality at a much quicker rate -- and get rid of clients for good! Live the dream!

###Show Your Support

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=IanLunn&url=https://github.com/IanLunn/Sequence&title=Sequence&language=&tags=github&category=software)

If you'd like to support Sequence.js, please consider purchasing a [premium theme from SequenceJS.com](http://www.sequencejs.com/themes/category/premium/). Whether you need the theme or not, we thank you for your genoristy! We're open about our premium licenses so if you think a friend, colleague or client could make use of the theme instead, feel free to pass it on.

Why purchase a premium theme and not just make a donation? We'd like to give you something a little extra to say thanks! A payment of support is made through PayPal (don't worry, you don't need a PayPal account), so it keeps them and our accountants happy too -- because they're not keen on "donations".

If you'd rather not give up your hard-earned money but still want to show your support, we like to receive your feedback, ideas and opinions too.

##What's New? 

###v1.0 18/4/2013

- Renamed sequence.jquery.js to jquery.sequence.js

###v0.9.2 12/4/2013

- Minor fix to the Slide fallback theme to hide frames when they are inactive

###25/3/2013

- Added two new themes - [Basic Slide](http://ianlunn.github.com/Sequence/themes/basic-slide) & [Basic Crossfade](http://ianlunn.github.com/Sequence/themes/basic-crossfade)

###v0.9.1 23/3/2013

**Note: This version of Sequence may not be compatible with existing themes without an upgrade. Please see the [upgrade instructions](https://github.com/IanLunn/Sequence/blob/master/upgradeInstructions.md).**

- `autoPlay` is now `false` by default. If you're upgrading existing themes to v0.9.1 and they use the autoPlay feature, you will need to include `autoPlay: true` in your theme options.
- The code that deals with the `transitionThreshold` option is now a little faster when `transitionThreshold` is `false` or `0`. Prior to this upgrade, if elements were animated at the same time and their edges touched (such as in the basic-slide theme), there would be a small gap/tear between the two. This is now resolved.

###v0.9 19/3/2013

**Note: This version of Sequence is not compatible with existing themes without an upgrade. Please see the [upgrade instructions](https://github.com/IanLunn/Sequence/blob/master/upgradeInstructions.md).**

- Lots of little changes to make JSHint happier (although haven't gone overkill on this)
- Namespaced events with a class of `sequence`, so `click` is now `click.sequence` and so on
- Updated CSS of most themes (`pauseOnHover` wasn't working due to no height/width specified on the top level `<ul>`)
- `self.sequence` renamed to `self.canvas`. The top level `<ul>` will now be referred to as the canvas, and the `<li>` elements frames. Fancy! The top level `<ul>` MUST now be given the class `.sequence-canvas` for Sequence to work
- Updated documentation with latest public variables, and functionality examples
- Added a `destroy(callback)` function which will remove a Sequence instance entirely from the page
- Added a `sequence.destroyed()` callback for parity with the rest of the callbacks (it does the same as passing the callback into the `.destroy(callback)` function - your choice as to which you use)
- Added "example functionality" directory where you can find demonstrations of various Sequence functionality such as destroy/initiate, hashtags and multiple instances (will drop more in here as time goes on, let me know if there's particular functionality you'd like to see demonstrated)
- Pagination is now in-built!
- Lots of class names are now prefixed with `sequence-`. If you're using any of the following class names with Sequence, you'll need to follow the [upgrade instructions](https://github.com/IanLunn/Sequence/blob/master/upgradeInstructions.md): `.next`, `.prev`, `.pause`, `.paused`, `.pause-icon`, `.pagination`, `.destroyed`, `.preloader`
- Updated included jquery.js and jquery-min.js to 1.9.1
- Added `showPaginationOnInit` and `showPauseButtonOnInit` options

###v0.8.5 05/3/2013

**Note: This version of Sequence may not be compatible with existing themes without an upgrade. Please see the [upgrade instructions](https://github.com/IanLunn/Sequence/blob/master/upgradeInstructions.md).**

- Removed CSS setup from sequence.jquery.js - some CSS is required for Sequence to work which the developer MUST include in their CSS. By having the developer do this rather than Sequence, the DOM is cleaner and Sequence can initiate a little faster.
- Updated Theme Template and Documentation Demo themes to work with v0.8.5, all other themes should be good to go.

###v0.8.4 23/2/2013

- Added the `transitionThreshold` option again, now with a default of `false`
- When navigating backwards, Sequence will now create a perfect reverse animation
- Added the option `preventDelayWhenReversingAnimations` which is `false` by default. Now Sequence reverses animations perfectly, if the overall animation duration (`transition-duration` + `transition-delay`) of frame 2 for example, is greater than that of frame 1, when navigating from frame 2 to frame 1, frame1 will be given a delay to create a perfect reversal of animation. This isn't particularly great for user experience as the moment the user tries to navigate to another frame they will be presented with a delay. By setting `preventDelayWhenReversingAnimations` to true, the delay won't be applied to frame 1
- Updated themes for better compatibility with the new handling of reversed animations

###v0.8.3 22/1/2013

- Renamed 'char' variable to 'keyCodeChar'
- All callbacks now work in both fallback themes
- Removed `beforeFirstFrameAnimatesIn()` and related callbacks (they're rarely used and can be achieved using normal callbacks and public variables), see upgradeInstructions.md if you'd like an alternative for this functionality

###v0.8.2.1 17/1/2013

- Bug fix for IE. currentFrameID will now return when Sequence is first initiated

###v0.8.2 5/1/2013

- Removed the 50ms gap inbetween frame transitions when in the "slide" fallback theme

### 28/12/2012

- Added SCSS file for each theme
- Added template with basic CSS/HTML for starting themes quicker
- Modified existing themes ready for SequenceJS.com relaunch (themes are now just the elements that make up the theme and nothing more -- no branding etc)

###v0.8.1 8/12/2012

- Hash tags are associated with the correct frame again
- `startAutoPlay` and `stopAutoPlay` now work indefinetly
- Frames are now given `z-index: 1` on initiation so that they stack correctly and links remain in their respective frames
- Minor updates to documentation with a couple of fixes
- Tested with latest jQuery version 1.8.3

###v0.8 18/11/2012
**Note: Animating elements now works in a slighty different way and as such, this version of Sequence is not compatible with existing themes without an upgrade.** The `animate-in` and `animate-out` classes are now only applied to the frame (`<li>` element), instead of the frames child elements. Because of this, if you are upgrading from a previous version, you will need to update your CSS, so that any rules using the `animate-in` and `animate-out` classses will be changed from this:

`.title.animate-in`

`li .model.animate-out`

to this:

`.animate-in .title`

`li.animate-out .model`


And so on. All existing Sequence themes have been upgraded so reference those if necessary or view the [upgrade instructions](https://github.com/IanLunn/Sequence/blob/master/upgradeInstructions.md).

- Performance improvements
- Preloader now works in IE.
- Removed the 50ms gap between a frame animating out and the next animating in (doesn't sound exciting but it means you can now have elements or slides moving at exactly the same time, so things like 3D cubes or just traditional sliders are possible without any seams between frames)
- Included new swiping functionality that works better on iOS and now also on Android devices.
- `swipeThreshold` now represents the number of pixels a user must swipe before swiping is detected (instead of a percentage of the devices width).

###v0.7.6 18/11/2012
- Fixed preloader in IE.

###v0.7.5.1 13/11/2012
- Minor fixes

###v0.7.5 13/11/2012
- It's now possible to skip frames whilst they are animating. Finally!
- Added new options relating to navigation skipping: `navigationSkip`, `navigationSkipThreshold`, `fadeFrameWhenSkipped`, `fadeFrameTime`, and `preventReverseSkipping`
- Removed `transitionThreshold` option. One frame can now only animate in immediately after the other. Nobody seemed to use this option and its presence affected the new navigation skipping options. If you want a time period between one frame animating out and the next frame animating in, use a CSS `transition-delay` instead
- Removed defunct code and general tidy up

###v0.7.4.1 01/11/2012

**Note: If upgrading from an existing Sequence.js version and using a preloader, please add `preloader: true` to your options**
- Changed the `preloader` option to `false` by default.

###v0.7.4 31/10/2012
- Now works with jQuery 1.8.2
- Rewritten `autoPlay` logic, which is now much simpler and easier to maintain
- Added `.unpause()` function for clarity (`.pause()` will still toggle between pause and unpause for backwards compaitibility)
- Added `isHardPaused` public variable. `isHardPaused` is set to true when Sequence is paused via the pause button. You can also pass an argument of true when using the `.pause(true)` public method to manually set `isHardPaused` to true
- The `transitionThreshold` setting now works when `animateStartingFrameIn` is true
- Fixed keyboard events. Pressing numeric keys will now navigate to respective frames. Custom key events are also working
- Removed `pauseOnElementsOutsideContainer` setting. Seemed to have been broken for a while and nobody noticed so decided it was useless!
- Added more inline documentation to the non minified version -- more to come!

###v0.7.3 16/09/2012
- Preloader should now work perfectly in all browsers

###v0.7.2 13/09/2012

**Note: 0.7.2 may not be backwards compatible with existing themes if those themes use callbacks or the public variable `paused`, which has now been renamed to `isPaused`. Please see the documentation for how callbacks now work and update your theme accordingly.**

- Preloader now more stable (although still not perfect, will be fixed in 0.7.3)
- Change how callbacks work to be more intuitive and work around IE issues
- Updated themes to work with new callback method

###v0.7.1 21/08/2012
- Added hashTag support. See [the modified Modern Slide In demo](http://www.sequencejs.com/themes/modern-slide-in-hashtags/) to see hashTags in action. Also see the [documentation](https://github.com/IanLunn/Sequence/blob/master/documentation.md#options-hashtag) for relevant options.

###v0.7.0.1 17/08/2012
- Minor fix to prevent frames from being able to animate in before another frame has finished animating (when the transitionThreshold is greater than the animation time).

###v0.7 16/08/2012
- Added `preloadTheseFrames` and `preloadTheseImages` options. Previously, when the `preloader` option was true, Sequence wouldn't initiate until the entire page had loaded. By giving the `preloadTheseFrames` option a comma separated list of frame numbers, you can tell Sequence which images need to be loaded before Sequence initiates. The `preloadTheseImages` can be given a comma separated list of image paths that tells Sequence to only initiate once those images have loaded. If you'd like, you can combine these options to have all images in frame 1 and one image from frame 2 to load before Sequence initiates.

###v0.6.9 14/08/2012
- Added `moveActiveFrameToTop` option that will bring an active frame to the top via z-index
- Dropped Opera 11 down to fallback theme support due to it's poor implementation of CSS3 transitions
- Made adding UI elements simpler (which reduced a lot of code too)
- The default preloader icon now uses SVG - no more 404s for the preloader image!
- General fixes and tidy up

###v0.6.8 10/07/2012
- Added "Slide" fallback theme and made it the default. "Slide" provides better support for older versions of Internet Explorer because opacity is no longer needed. In the original "Fade" fallback, opacity was used which caused a black halo around PNGs.
- Added new option `hideFramesUntilPreloaded`, which is `true` by default. When `true`, frames will be hidden as soon as Sequence is loaded and then shown when everything has preloaded.
- Lots of changes made to the themes to better assist with Internet Explorer support. Also removed CSS Resets into their own files to make themes a little more modular.

###v0.6.7.1 19/06/2012
- Minor fix to get Sequence working in Opera 12

###v0.6.7 5/06/2012

**Note: 0.6.7 may not be backwards compatible with existing themes if those themes use the afterPreload callback, which has now been renamed to afterLoaded**

- Fixed bug that prevented Sequence from initiating when the preloader was disabled
- Changed the name of the afterPreload callback to afterLoaded and made it execute whether a preloader is used or not
- Changed the name of the `FallbackTheme` object to `fallback`. `fallback` now has an option within it called `theme`. In the future, the `theme` option can be given different strings such as `fade` and `slide` to provide different fallback themes for older browsers.
- A few minor adjustments to improve or remove redundant code

###v0.6.6 16/05/2012

####Bug fix for Multiple Instances of Sequence
The documentation has been slightly modified to better assist with multiple instances of Sequence on the same page. The default Sequence preloader was originally appended to the Sequence container as an ID but this caused issues when using more than one Sequence instance, so it's now a class.

###v0.6.5 14/05/2012

**Note: 0.6.5 may not be backwards compatible with existing themes if those themes use the delayDuringOutInTransitions setting, which has now been renamed to transitionThreshold**

####New callback
You can now use afterCurrentFrameAnimatesOut which is triggered once the current frame reaches the end of its animate out transition

####Minor changes to delayDuringOutInTransitions Setting
`delayDurintOutInTransitions` option renamed to `transitionThreshold`
Fix for `transitionThreshold` which now makes all possible settings work

###v0.6.4 09/05/2012
Minor changes to how the nextButton/prevButton/pauseButton and prependNextButton/prependPrevButton/prependPauseButton options work. Now closer match how they are described in the documentation.

###v0.6.3 08/05/2012
**Check out the updated [Apple Style theme](http://www.sequencejs.com/themes/apple-style/) that showcases the new pause options and callbacks.**

####New Pause Options
pauseButton, prependPauseButton, pauseButtonSrc, pauseButtonAlt, unpauseDelay have been added to allow for a pause button when using autoPlay. 

####New Pause Callbacks
Two new callbacks added for pause and unpause

####New customKeyEvent for Pausing
If using customKeyEvents, you can now hook a key to the pause event.

####startAutoPlay Public Method Bug Fix
The public method startAutoPlay accepted an argument that would cause Sequence to wait x amount of milliseconds before autoPlay was started. This argument wasn't correctly implemented but should now work.

####Sequence Container is Given a Class of "sequence-fallback" When in Fallback Mode
If Sequence goes into fallback mode because the browser doesn't support CSS3 transitions, it is given the class of "sequence-fallback" allowing for the application of styles specifically for older browsers

###v0.6.2 06/05/2012
**Note: 0.6.2 may not be backwards compatible with existing themes if those themes use the touchEnabled and keysNavigate settings (these settings have changed names, see below)**

####Added keyEvents Option
keyEvents allows you to specify which way the left and right arrows should cause Sequence to navigate. [See Keyboard Options](https://github.com/IanLunn/Sequence/blob/master/documentation.md#options-keyboard)

####Added customKeyEvents Option
customKeyEvents are keyEvents on steroids! Specify a key (using a keyCode) and the event to be trigger when the user hits that key. Example: 65: "prev" causes Sequence to navigate backwards when the "a" key is pressed on the keyboard.

####Added numericKeysGoToFrames Option
When the keyboards numeric keys are pressed, if there is a frame that represents that number, Sequence will navigate to that frame.

####Added swipeEvents Option
swipeEvents allows you to specify which way Sequence should navigate when the user swipes in a particular direction. Up/Down/Left/Right supported.

####Added swipePreventsDefault Option
If set to true, on touch devices, when swiping over Sequence, the default will be prevented (the page will not scroll). Useful if you want up/down swiping to cause Sequence to navigate but be careful that this doesn't affect user experience by preventing scrolling the page all together.

####Changed the Names of a Few Options
touchEnabled changed to swipeNavigation
keysNavigate changed to keyNavigation

####Tidied up the Documentation
Changed the layout of the options in the documentation

###v0.6.1 03/05/2012
####Bug Fix
In previous versions of Sequence, all frame elements *HAD* to have a class for Sequence to work. This was unintentional but is now resolved in 0.6.1. Use IDs and classes as you see fit, but they're no longer necessary.

###v0.6 03/05/2012
####Code Optimisation and General Tweaks
**Note: 0.6 may not be backwards compatible with existing themes, particularly if they use before/after callbacks or rely on the "current" class**

- A frame is now only deemed as being "current" when it is in the viewport but not animating. If animating in, it will have a class of "next-frame". The "current" frame now has a class of "current-frame".

- Changed the before/after callbacks. These callbacks are now beforeNextFrameAnimatesIn, afterNextFrameAnimatesIn, beforeCurrentFrameAnimatesOut. Please consult the documentation and the [http://sequencejs.com/themes/documentation-demo/](documentation theme) to better understand this.

- before/after callbacks are now working correctly in the fallback themes.

####Fix for Reversed Animation Speeds
If an element animates-in at 2 seconds and then animates-out at 3, when it reverses in (from the animate-out position), it will take 3 seconds. 

###v0.5.2 02/05/2012
####Made 'Modern Slide In' Responsive
The theme 'Modern Slide In' is now responsive.

No changes made to Sequence.js.

###v0.5.2 18/04/2012
####Touch Swiping Improved
Swiping on touch devices has been improved and swipeThreshold is working again. Links within frames are clickable and the page can be scrolled vertically without initiating a frame change.

###v0.5.1 17/04/2012
####Changed Default Values for nextButton and prevButton
The nextButton and prevButton options are now turned off out of the box. To turn them on, either use the defaults by setting these options to true or by specifying a CSS selector to use your own custom buttons

###v0.5 15/04/2012

####Multiple Instances Now Working
Merged a pull request that got multiple instances of Sequence on one page working.

###v0.4 11/03/2012

####Previous/Next Button Options
The previous and next buttons now have a couple more options:
- nextButtonSrc: specify a path to an image to be used as the next button
- nextButtonAlt: specify a string to be used as the alt text for the next button image
- prevButtonSrc: specify a path to an image to be used as the previous button
- prevButtonAlt: specify a string to be used as the alt text for the previous button image

####Maintenance
General tidy up of the script. Made some changes for better practice -- now only using one jQuery function etc, all dependencies are enclosed within the Sequence function. Also optimised .init().

###v0.3 06/03/2012)
####Modernizr Detect
Sequence will now detect whether Modernizr.prefixed is installed on the site, if it's not, it'll use its own instance.

####pauseOnElementsOutsideContainer
Sequence will now only trigger the pause function when hovering over its child elements inside the container. If you'd like Sequence to pause when hovering on child elements outside of the container, set this to true.

####pauseIcon Fix
In update v0.2, the pauseIcon option got broken. This is now fixed.

###v0.2 28/02/2012
####Preloader
Sequence now has a default preloader or support for a custom preloader. When preloading is complete, a class of "preloading-complete" can be added to one or multiple elements to allow you to write your own reveal using CSS3 transitions. Also comes with a callback for when the preloading is complete.

####Cycle Option
Choose whether Sequence should go back to the start when it reaches the last frame (or the first frame if navigating backwards)

####reverseAnimationsWhenNavigatingBackwards Option
When navigating backwards, you can now specify whether frames should animate forwards or in reverse
