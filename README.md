#Sequence - The jQuery Slider Plugin with Infinite Style
Sequence is the jQuery slider plugin with infinite style. It provides the complete functionality for a website slider without forcing you to use a set theme. In fact, Sequence has no in-built theme, leaving you complete creative control to build a unique slider using only CSS3 -- no jQuery knowledge required!

##Features
- Unique transition styles created using CSS3
- Supports all modern browsers
- Gracefully degrades in older browsers*
- Supports responsive layouts
- Supports touch devices and swiping
- Many developer features with even more to come
- Semantic and easy to use markup
- Open source

*Tested down to Firefox 3.6 and IE7. Extensive support details to come

##Theme Demos
- [Modern Slide In](http://www.sequencejs.com/themes/modern-slide-in/)
- [Sliding Horizontal Parallax](http://www.sequencejs.com/themes/sliding-horizontal-parallax/)
- [Apple Style](http://www.sequencejs.com/themes/apple-style/)

##Documentation
The unashamedly technical documentation can be found here: [SequenceJS Demo](http://www.sequencejs.com/documentation.php). Quick guides are on their way!

##Author
[Ian Lunn](http://twitter.com/#!/IanLunn) (say hi on Twitter!)

##License
sequence.js is a FREE script and is dual licensed under the following:
http://www.opensource.org/licenses/mit-license.php | http://www.gnu.org/licenses/gpl.html

Theme files, their HTML, CSS, JavaScript/jQuery and images are licensed under the following unless otherwise stated:
http://www.opensource.org/licenses/mit-license.php | http://www.gnu.org/licenses/gpl.html

[http://www.sequencejs.com/](SequenceJS.com), the sequence.js script and its dependencies are &copy; 2012 [Ian Lunn Design](http://www.ianlunn.co.uk/) unless otherwise specified.

##What's New? 

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
