/*
Sequence.js (http://www.sequencejs.com)
Version: 1.0.1
Author: Ian Lunn @IanLunn
Author URL: http://www.ianlunn.co.uk/
Github: https://github.com/IanLunn/Sequence

This is a FREE script and is available under a MIT License:
http://www.opensource.org/licenses/mit-license.php

Sequence.js and its dependencies are (c) Ian Lunn Design 2012 - 2013 unless otherwise stated.

Sequence also relies on the following open source scripts:

- jQuery imagesLoaded 2.1.0 (http://github.com/desandro/imagesloaded)
	Paul Irish et al
	Available under a MIT License: http://www.opensource.org/licenses/mit-license.php

- jQuery TouchWipe 1.1.1 (http://www.netcu.de/jquery-touchwipe-iphone-ipad-library)
	Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
	Available under a MIT License: http://www.opensource.org/licenses/mit-license.php

- Modernizr 2.6.1 Custom Build (http://modernizr.com/) (Named Modernizr for Sequence to prevent conflicts)
	Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
	Available under the BSD and MIT licenses: www.modernizr.com/license/
	*/

;(function($) {
	var windowLoaded = false;
	$(window).bind("load", function() {
		windowLoaded = true;
	});

	function Sequence(element, options, defaults, get) {
		var self = this;
		self.container = $(element); //the Sequence containing element
		self.canvas = self.container.children('.sequence-canvas'); //the Sequence canvas which holds Sequence's frames (<li> elements)
		self.frames = self.canvas.children('li'); //the Sequence frames (top level <li> elements within the Sequence canvas)

		self._modernizrForSequence(); //get the custom build necessary for Sequence

		var prefixes = { //convert JS transition/animation names to CSS names
			'WebkitTransition' : '-webkit-',
			'WebkitAnimation'  : '-webkit-',
			'MozTransition'    : '-moz-',
			'MozAnimation '    : '-moz-',
			'OTransition'      : '-o-',
			'OAnimation'       : '-o-',
			'msTransition'     : '-ms-',
			'msAnimation'      : '-ms-',
			'transition'       : '',
			'animation'        : ''
		};
		
		var transitionsAndAnimations = { //convert JS transition names to JS transition end and animation end event names (also apply a classname of .sequence to the event)
			'WebkitTransition' : 'webkitTransitionEnd.sequence',
			'WebkitAnimation'  : 'webkitAnimationEnd.sequence',
			'MozTransition'    : 'transitionend.sequence',
			'MozAnimation'     : 'animationend.sequence',
			'OTransition'      : 'otransitionend.sequence',
			'OAnimation'       : 'oanimationend.sequence',
			'msTransition'     : 'MSTransitionEnd.sequence',
			'msAnimation'      : 'MSAnimationEnd.sequence',
			'transition'       : 'transitionend.sequence',
			'animation'        : 'animationend.sequence'
		};

		self.transitionPrefix = prefixes[ModernizrForSequence.prefixed('transition')], //work out the CSS transition prefix for the browser being used (-webkit- for example)
		self.animationPrefix = prefixes[ModernizrForSequence.prefixed('animation')], //work out the CSS animation prefix for the browser being used

		self.transitionProperties = {},
		self.transitionEnd = transitionsAndAnimations[ModernizrForSequence.prefixed('transition')] + ' ' + transitionsAndAnimations[ModernizrForSequence.prefixed('animation')], //work out the JS transitionEnd name for the browser being used (webkitTransitionEnd webkitAnimationEnd for example)
		self.numberOfFrames = self.frames.length, //number of frames (<li>) Sequence consists of

		self.transitionsSupported = (self.transitionPrefix !== undefined) ? true : false, //determine if transitions are supported
		self.hasTouch = ("ontouchstart" in window) ? true : false, //determine if this is a touch enabled device
		self.isPaused = false, //whether Sequence is paused
		self.isBeingHoveredOver = false, //whether the Sequence canvas is currently being hovered over

		self.container.removeClass('sequence-destroyed'); //if Sequence is destroyed using .destroy(), it is given a clas of "destroy", remove that now if present

		//CALLBACKS
		self.paused = function() {},												//executes when Sequence is paused
		self.unpaused = function() {},											//executes when Sequence is unpaused

		self.beforeNextFrameAnimatesIn = function() {},			//executes before the next frame animates in
		self.afterNextFrameAnimatesIn = function() {},			//executes after the next frame animates in
		self.beforeCurrentFrameAnimatesOut = function() {},	//executes before the current frame animates out
		self.afterCurrentFrameAnimatesOut = function() {},	//executes after the current frame animates out

		self.afterLoaded = function() {};										//executes after Sequence is initiated
		self.destroyed = function() {};											//executes when Sequence is destroyed via the destory() function

		//INIT
		self.settings = $.extend({}, defaults, options); //combine default options with developer defined ones
		self.settings.preloader = self._renderUiElements(self.settings.preloader, '.sequence-preloader'); //set up the preloader and save it
		self.isStartingFrame = (self.settings.animateStartingFrameIn) ? true : false; //determine if the first frame should animate in
		self.settings.unpauseDelay = (self.settings.unpauseDelay === null) ? self.settings.autoPlayDelay : self.settings.unpauseDelay; //if the unpauseDelay is not specified, make it the same as the autoPlayDelay speed
		self.getHashTagFrom = (self.settings.hashDataAttribute) ? "data-sequence-hashtag": "id"; //get the hashtag from the ID or data attribute?
		self.frameHashID = []; //array that matches frames with has IDs
		self.direction = self.settings.autoPlayDirection;

		if(self.settings.hideFramesUntilPreloaded && self.settings.preloader !== undefined  && self.settings.preloader !== false) { //if using a preloader and hiding frames until preloading has completed...
			self.frames.hide(); //hide Sequence's frames
		}

		if(self.transitionPrefix === "-o-") { //if Opera prefixes are required...
			self.transitionsSupported = self._operaTest(); //run a test to see if Opera correctly supports transitions (Opera 11 has bugs relating to transitions)
		}

		self.frames.removeClass("animate-in"); //remove any instance of "animate-in", which should be used incase JS is disabled

		//functionality to run once Sequence has preloaded
		function oncePreloaded() {
			self.afterLoaded(); //callback
			if(self.settings.hideFramesUntilPreloaded && self.settings.preloader !== undefined  && self.settings.preloader !== false) {
				self.frames.show();
			}
			if(self.settings.preloader !== undefined  && self.settings.preloader !== false){
				if(self.settings.hidePreloaderUsingCSS && self.transitionsSupported) {
					self.prependPreloadingCompleteTo = (self.settings.prependPreloadingComplete === true) ? self.settings.preloader : $(self.settings.prependPreloadingComplete);
					self.prependPreloadingCompleteTo.addClass("preloading-complete");
					setTimeout(init, self.settings.hidePreloaderDelay);
				}else{
					self.settings.preloader.fadeOut(self.settings.hidePreloaderDelay, function() {
						clearInterval(self.defaultPreloader);
						init();
					});
				}
			}else{
				init();
			}
		}

		var preloadTheseFramesLength = self.settings.preloadTheseFrames.length; //how many frames to preload?
		var preloadTheseImagesLength = self.settings.preloadTheseImages.length; //how many single images to load?

		function saveImagesToArray(length, srcOnly) {
			var imagesToPreload = []; //saves the images that are to be preloaded
			if(!srcOnly){
				for(var i = length; i > 0; i--){ //for each frame to be preloaded...
					self.frames.eq(self.settings.preloadTheseFrames[i-1]-1).find("img").each(function() { //find <img>'s in specific frames, and for each found...
						imagesToPreload.push($(this)[0]); //add it to the array of images to be preloaded
					});
				}
			}else{
				for(var j = length; j > 0; j--) { //for each frame to be preloaded...
					imagesToPreload.push($("body").find('img[src="'+self.settings.preloadTheseImages[j-1]+'"]')); //find any <img> with the given source and add it to the array of images to be preloaded
				}
			}
			return imagesToPreload;
		}

		//jQuery imagesLoaded plugin v2.1.0 (http://github.com/desandro/imagesloaded)
		function imagesLoaded(imagesToPreload, callback) {
			var BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
			var $this = imagesToPreload,
			deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
			hasNotify = $.isFunction(deferred.notify),
			$images = $this.find('img').add( $this.filter('img') ),
			loaded = [],
			proper = [],
			broken = [];

			//Register deferred callbacks
			if($.isPlainObject(callback)) {
				$.each(callback, function(key, value) {
					if(key === 'callback') {
						callback = value;
					}else if(deferred) {
						deferred[key](value);
					}
				});
			}

			function doneLoading() {
				var $proper = $(proper),
				$broken = $(broken);

				if(deferred) {
					if(broken.length) {
						deferred.reject($images, $proper, $broken);
					}else{
						deferred.resolve($images);
					}
				}

				if($.isFunction(callback)) {
					callback.call($this, $images, $proper, $broken);
				}
			}

			function imgLoaded( img, isBroken ) {
				if(img.src === BLANK || $.inArray(img, loaded) !== -1) { // don't proceed if BLANK image, or image is already loaded
					return;
			}

				loaded.push(img); // store element in loaded images array

				if(isBroken) { // keep track of broken and properly loaded images
					broken.push(img);
				}else{
					proper.push(img);
				}

				$.data(img, 'imagesLoaded', {isBroken: isBroken, src: img.src }); // cache image and its state for future calls

				if(hasNotify) { // trigger deferred progress method if present
					deferred.notifyWith($(img), [isBroken, $images, $(proper), $(broken)]);
				}

				if($images.length === loaded.length) { // call doneLoading and clean listeners if all images are loaded
					setTimeout(doneLoading);
					$images.unbind('.imagesLoaded');
				}
			}

			if(!$images.length) { // if no images, trigger immediately
				doneLoading();
			}else{
				$images.bind('load.imagesLoaded error.imagesLoaded', function(event) {
					imgLoaded(event.target, event.type === 'error'); // trigger imgLoaded
				}).each(function(i, el) {
					var src = el.src;
					var cached = $.data(el, 'imagesLoaded'); // find out if this image has been already checked for status if it was, and src has not changed, call imgLoaded on it
					if(cached && cached.src === src) {
						imgLoaded(el, cached.isBroken);
						return;
					}

					if(el.complete && el.naturalWidth !== undefined) { // if complete is true and browser supports natural sizes, try to check for image status manually
						imgLoaded(el, el.naturalWidth === 0 || el.naturalHeight === 0);
						return;
					}

					// cached images don't fire load sometimes, so we reset src, but only when dealing with IE, or image is complete (loaded) and failed manual check webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
					if(el.readyState || el.complete) {
						el.src = BLANK;
						el.src = src;
					}
				});
			}
		}

		if(self.settings.preloader !== undefined && self.settings.preloader !== false && (preloadTheseFramesLength !== 0 || preloadTheseImagesLength !== 0)) { //if using the preloader and the dev has specified some images should preload...
			var frameImagesToPreload = saveImagesToArray(preloadTheseFramesLength); //get images from particular Sequence frames to be preloaded
			var individualImagesToPreload = saveImagesToArray(preloadTheseImagesLength, true); //get images with specific source values to be preloaded
			var imagesToPreload = $(frameImagesToPreload.concat(individualImagesToPreload)); //combine frame images and individual images

			imagesLoaded(imagesToPreload, oncePreloaded);
		}else{ //if not using the preloader...
			if(windowLoaded === true) { //if the window has already loaded...
				oncePreloaded(); //run the init functionality when the preloader has finished
				$(this).unbind("load.sequence"); //unbind the load event as it's no longer needed
			}else{ //if the window hasn't already loaded...
				$(window).bind("load.sequence", function() { //when the window loads...	
					oncePreloaded(); //run the init functionality when the preloader has finished
					$(this).unbind("load.sequence"); //unbind the load event as it's no longer needed
				});
			}
		}

		function init() {
			$(self.settings.preloader).remove(); //remove the preloader element

			self.nextButton = self._renderUiElements(self.settings.nextButton, ".sequence-next"); //set up the next button
			self.prevButton = self._renderUiElements(self.settings.prevButton, ".sequence-prev"); //set up the previous button
			self.pauseButton = self._renderUiElements(self.settings.pauseButton, ".sequence-pause"); //set up the pause button
			self.pagination = self._renderUiElements(self.settings.pagination, ".sequence-pagination"); //set up the pagination

			if((self.nextButton !== undefined && self.nextButton !== false) && self.settings.showNextButtonOnInit === true){self.nextButton.show();} //if using a next button, show it
			if((self.prevButton !== undefined && self.prevButton !== false) && self.settings.showPrevButtonOnInit === true){self.prevButton.show();} //if using a previous button, show it
			if((self.pauseButton !== undefined && self.pauseButton !== false) && self.settings.showPauseButtonOnInit === true){self.pauseButton.show();} //if using a pause button, show it

			if(self.settings.pauseIcon !== false) {
				self.pauseIcon = self._renderUiElements(self.settings.pauseIcon, ".sequence-pause-icon");
				if(self.pauseIcon !== undefined) {
					self.pauseIcon.hide();
				}
			}else{
				self.pauseIcon = undefined;
			}

			if(self.pagination !== undefined && self.pagination !== false) {
				self.paginationLinks = self.pagination.children(); //get each pagination link

				self.paginationLinks.on('click.sequence', function() { //when a pagination link is clicked...
					var associatedFrameNumber = $(this).index() + 1; //get the number of the frame this link is associated with
					self.nextFrameID = associatedFrameNumber;
					self.goTo(associatedFrameNumber); //go to the associate frame
				});

				if(self.settings.showPaginationOnInit === true) {
					self.pagination.show();
				}
			}

			self.nextFrameID = self.settings.startingFrameID;

			if(self.settings.hashTags === true) { //if using hashtags...
				self.frames.each(function() { //for each frame...
					self.frameHashID.push($(this).prop(self.getHashTagFrom)); //add the hashtag to an array
				});

				self.currentHashTag = location.hash.replace("#", ""); //get the current hashtag
				if(self.currentHashTag === undefined || self.currentHashTag === "") { //if there is no hashtag...
					self.nextFrameID = self.settings.startingFrameID; //use the startingFrameID
				}else{
					self.frameHashIndex = $.inArray(self.currentHashTag, self.frameHashID); //get the index of the frame that matches the hashtag
					if(self.frameHashIndex !== -1){  //if the hashtag matches a Sequence frame ID...
						self.nextFrameID = self.frameHashIndex + 1; //use the frame associated to the hashtag
					}else{
						self.nextFrameID = self.settings.startingFrameID; //use the startingFrameID
					}
				}
			}

			self.nextFrame = self.frames.eq(self.nextFrameID-1); //get the next frame
			self.nextFrameChildren = self.nextFrame.children(); //get the elements within the next frame to be animated

			if(self.pagination !== undefined) { //if using pagination, make the starting frame the current one in pagination
				$(self.paginationLinks[self.settings.startingFrameID-1]).addClass('current'); //add the 'current' class to the current frame
			}

			if(self.transitionsSupported) { //initiate the full featured Sequence if transitions are supported...
				if(!self.settings.animateStartingFrameIn) { //start first frame in animated in position
					self.currentFrameID = self.nextFrameID;

					if(self.settings.moveActiveFrameToTop) {
						self.nextFrame.css('z-index', self.numberOfFrames);
					}

					self._resetElements(self.transitionPrefix, self.nextFrameChildren, "0s");
					self.nextFrame.addClass("animate-in");
					if(self.settings.hashTags && self.settings.hashChangesOnFirstFrame) {
						self.currentHashTag = self.nextFrame.prop(self.getHashTagFrom);
						document.location.hash = "#"+self.currentHashTag;
					}

					setTimeout(function() {
						self._resetElements(self.transitionPrefix, self.nextFrameChildren, "");
					}, 100);

					self._resetAutoPlay(true, self.settings.autoPlayDelay);
				}else if(self.settings.reverseAnimationsWhenNavigatingBackwards && self.settings.autoPlayDirection -1 && self.settings.animateStartingFrameIn) { //animate in backwards
					self._resetElements(self.transitionPrefix, self.nextFrameChildren, "0s");
					self.nextFrame.addClass("animate-out");
					self.goTo(self.nextFrameID, -1, true);
				}else{ //animate in forwards
					self.goTo(self.nextFrameID, 1, true);
				}
			}else{ //initiate a basic slider for browsers that don't support CSS3 transitions
				self.container.addClass("sequence-fallback");
				self.currentFrameID = self.nextFrameID;
				if(self.settings.hashTags && self.settings.hashChangesOnFirstFrame){
					self.currentHashTag = self.nextFrame.prop(self.getHashTagFrom);
					document.location.hash = "#"+self.currentHashTag;
				}

				self.frames.addClass("animate-in"); //move each frame into its animate-in position
				self.frames.not(':eq('+(self.nextFrameID-1)+')').css({"display": "none", "opacity": 0}); //set all frames (except the next one) to display: none, opacity: 0
				self._resetAutoPlay(true, self.settings.autoPlayDelay);
			}
			//END INIT
			//EVENTS
			if(self.nextButton !== undefined) { //if a next button is defined...
				self.nextButton.bind('click.sequence', function() { //when the next button is clicked...
					self.next(); //go to the next frame
				});
			}

			if(self.prevButton !== undefined) { //if a previous button is defined...
				self.prevButton.bind('click.sequence', function() { //when the previous button is clicked...
					self.prev(); //go to the previous frame
				});
			}

			if(self.pauseButton !== undefined) { //if a pause button is defined...
				self.pauseButton.bind('click.sequence', function() { //when the pause button is clicked...
					self.pause(true); //pause Sequence and set hardPause to true
				});
			}

			function keyEvents(keyPressed, keyDirections) {
				var keyCode;
				var keyCodes;

				for(keyCodes in keyDirections) {
					if(keyCodes === "left" || keyCodes === "right") {
						keyCode = defaultKeys[keyCodes];
					}else{
						keyCode = keyCodes;
					}

					if(keyPressed === parseFloat(keyCode)) { //if the key pressed is associated with a function...
						self._initCustomKeyEvent(keyDirections[keyCodes]); //initiate the function
					}
				}
			}

			if(self.settings.keyNavigation) {
				var defaultKeys = {
					'left'	: 37,
					'right'	: 39
				};

				$(document).bind('keydown.sequence', function(e) { //when a key is pressed...
					var keyCodeChar = String.fromCharCode(e.keyCode);
					if((keyCodeChar > 0 && keyCodeChar <= self.numberOfFrames) && (self.settings.numericKeysGoToFrames)) {
						self.nextFrameID = keyCodeChar;
						self.goTo(self.nextFrameID); //go to specified frame
					}

					keyEvents(e.keyCode, self.settings.keyEvents); //run default keyevents
					keyEvents(e.keyCode, self.settings.customKeyEvents); //run custom keyevents
				});
			}
			
			self.canvas.on({
				'mouseenter.sequence': function() { //when the mouse enter the Sequence element...
					if(self.settings.pauseOnHover && self.settings.autoPlay && !self.hasTouch) { //if using pauseOnHover and autoPlay on non touch devices
						self.isBeingHoveredOver = true;
						if(!self.isHardPaused) { //if Sequence is hard paused (via a pause button)...
							self.pause(); //pause autoPlay
						}
					}
				},
				'mouseleave.sequence': function() { //when the mouse leaves the Sequence element...
					if(self.settings.pauseOnHover && self.settings.autoPlay && !self.hasTouch) { //if using pauseOnHover and autoPlay on non touch devices
						self.isBeingHoveredOver = false;
						if(!self.isHardPaused) { //if Sequence is not hard paused (via a pause button)...
							self.unpause(); //unpause autoPlay
						}
					}
				}
			});

			if(self.settings.hashTags) { //if hashchange is enabled in the settings...
				$(window).bind('hashchange.sequence', function() { //when the hashtag changes...
					var newTag = location.hash.replace("#", ""); //grab the new hashtag

					if(self.currentHashTag !== newTag) { //if the last hashtag is not the same as the current one...
						self.currentHashTag = newTag; //save the new tag
						self.frameHashIndex = $.inArray(self.currentHashTag, self.frameHashID); //get the index of the frame that matches the hashtag
						if(self.frameHashIndex !== -1) { //if the hashtag matches a Sequence frame ID...
							self.nextFrameID = self.frameHashIndex + 1; //set that frame as the next one
								self.goTo(self.nextFrameID); //go to the next frame
							}
						}
					});
			}

			function cancelTouch() {
				self.canvas.on("touchmove.sequence", onTouchMove);
				startX = null;
				isMoving = false;
			}

			function onTouchMove(e) {
				if(self.settings.swipePreventsDefault) {
					e.preventDefault();
				}
				if(isMoving) {
					var x = e.originalEvent.touches[0].pageX;
					var y = e.originalEvent.touches[0].pageY;
					var dx = startX - x;
					var dy = startY - y;
					if(Math.abs(dx) >= self.settings.swipeThreshold) {
						cancelTouch();
						if(dx > 0) {
							self._initCustomKeyEvent(self.settings.swipeEvents.left);
						}else{
							self._initCustomKeyEvent(self.settings.swipeEvents.right);
						}
					}else if(Math.abs(dy) >= self.settings.swipeThreshold) {
						cancelTouch();
						if(dy > 0) {
							self._initCustomKeyEvent(self.settings.swipeEvents.down);
						}else{
							self._initCustomKeyEvent(self.settings.swipeEvents.up);
						}
					}
				}
			}

			function onTouchStart(e) {
				if(e.originalEvent.touches.length === 1) {
					startX = e.originalEvent.touches[0].pageX;
					startY = e.originalEvent.touches[0].pageY;
					isMoving = true;
					self.canvas.on("touchmove.sequence", onTouchMove);
				}
			}

			if(self.settings.swipeNavigation && self.hasTouch) { //if using swipeNavigation and the device has touch capabilities...
				//jQuery TouchWipe v1.1.1 (http://www.netcu.de/jquery-touchwipe-iphone-ipad-library)
				var startX;
				var startY;
				var isMoving = false;

				self.canvas.on("touchstart.sequence", onTouchStart);
			}
			//END EVENTS
		}
	} //END CONSTRUCTOR

	Sequence.prototype = {

		//PUBLIC METHODS
		/*
		start autoPlay -- causing Sequence to automatically change frame every x amount of milliseconds
		
		delay: a time in ms before starting the autoPlay feature (if unspecified, the default will be used)
		*/
		startAutoPlay: function(delay) {
			var self = this;
			delay = (delay === undefined) ? self.settings.autoPlayDelay : delay; //if a delay isn't specified, use the default
			self.unpause();

			self._resetAutoPlay(); //stop autoPlay before starting it again
			self.autoPlayTimer = setTimeout(function() { //start a new autoPlay timer and...
				if(self.settings.autoPlayDirection === 1) { //go to either the next or previous frame
					self.next();
				}else{
					self.prev();
				}
			}, delay); //after a specified delay
		},

		//stop causing Sequence to automatically change frame every x amount of seconds
		stopAutoPlay: function() {
			var self = this;
			self.pause(true);
			clearTimeout(self.autoPlayTimer); //stop the autoPlay timer
		},

		/*
		Toggle startAutoPlay (unpausing autoPlay) and stopAutoPlay (pausing autoPlay)

		hardPause: if true, Sequence's pauseOnHover will not execute. Useful for pause buttons.

		Note: Sequence 0.7.3 and below didn't have an .unpause() function -- .pause() would pause/unpause
		based on the current state. .unpause() is now included for clarity but the .pause() function will
		still toggle between paused and unpaused states.
		*/
		pause: function(hardPause) {
			var self = this;
			if(!self.isSoftPaused) { //if pausing Sequence...
				if(self.pauseButton !== undefined) { //if a pause button is defined...
					self.pauseButton.addClass("paused"); //add the class of "paused" to the pause button
					if(self.pauseIcon !== undefined) { //if a pause icon is defined...
						self.pauseIcon.show(); //show the pause icon
					}
				}
				self.paused(); //callback when Sequence is paused
				self.isSoftPaused = true;
				self.isHardPaused = (hardPause) ? true : false; //if hardPausing, set hardPause to true
				self.isPaused = true;
				self._resetAutoPlay(); //stop autoPlay
			}else{ //if unpausing Sequence...
				self.unpause();
			}
		},

		/*
		Start the autoPlay feature, as well as deal with any changes to pauseButtons, pauseIcons and public variables etc
		
		callback: if false, the unpause callback will not be initiated (this is because unpause is used internally during the stop and start of each frame)
		*/
		unpause: function(callback) {
			var self = this;
			if(self.pauseButton !== undefined) { //if a pause button is defined...
				self.pauseButton.removeClass("paused"); //remove the class of "paused" from the pause button
				if(self.pauseIcon !== undefined) { //if a pause icon is defined...
					self.pauseIcon.hide(); //hide the pause icon
				}
			}

			self.isSoftPaused = false;
			self.isHardPaused = false;
			self.isPaused = false;

			if(!self.active) {
				if(callback !== false) {
					self.unpaused(); //callback when Sequence is unpaused
				}
				self._resetAutoPlay(true, self.settings.unpauseDelay); //start autoPlay after a delay specified via the unpauseDelay setting
			}else{
				self.delayUnpause = true; //Sequence is animating so delay the unpause event until the animation completes
			}
		},

		//Go to the frame ahead of the current one
		next: function() {
			var self = this;
			self.nextFrameID = (self.currentFrameID !== self.numberOfFrames) ? self.currentFrameID + 1 : 1; //work out the next frame
			if(self.active === false || self.active === undefined) { //if Sequence isn't currently animating...
				self.goTo(self.nextFrameID, 1); //go to the next frame
			}else{ //if Sequence is currently animating...
				self.goTo(self.nextFrameID, 1, true); //go immediately to the next frame (ignoring the transition threshold)
			}
		},

		//Go to the frame prior to the current one
		prev: function() {
			var self = this;
			self.nextFrameID = (self.currentFrameID === 1) ? self.numberOfFrames : self.currentFrameID - 1; //work out the prev frame
			if(self.active === false || self.active === undefined) { //if Sequence isn't currently animating...
				self.goTo(self.nextFrameID, -1); //go to the prev frame
			}else{ //if Sequence is currently animating...
				self.goTo(self.nextFrameID, -1, true); //go immediately to the prev frame (ignoring the transition threshold)
			}
		},

		/*
		Go to a specific frame
		
		id: number of the frame to go to
		direction: direction to get to that frame (1 = forward, -1 = reverse)
		ignoreTransitionThreshold: if true, ignore the transitionThreshold setting and immediately go to the specified frame
		*/
		goTo: function(id, direction, ignoreTransitionThreshold) {
			var self = this;
			id = parseFloat(id); //convert the id to a number just in case
			var transitionThreshold = (ignoreTransitionThreshold === true) ? 0 : self.settings.transitionThreshold; //if transitionThreshold is to be ignored, set it to zero

			if((id === self.currentFrameID) //if the id of the frame the user is trying to go to is the same as the currently active one...
			|| (self.settings.navigationSkip && self.navigationSkipThresholdActive) //or navigationSkip is enabled and the navigationSkipThreshold is active (which prevents frame from being navigated too fast)...
			|| (!self.settings.navigationSkip && self.active) //or navigationSkip is disbaled but Sequence is animating...
			|| (!self.transitionsSupported && self.active) //or Sequence is in fallback mode and Sequence is animating...
			|| (!self.settings.cycle && direction === 1 && self.currentFrameID === self.numberOfFrames) //or cycling is disabled, the user is navigating forward and this is the last frame...
			|| (!self.settings.cycle && direction === -1 && self.currentFrameID === 1) //or cycling is disabled, the user is navigating backwards and this is the first frame...
			|| (self.settings.preventReverseSkipping && self.direction !== direction && self.active)) { //or Sequence is animating and the user is trying to change the direction of navigation...
				return false; //don't go to another frame
			}else if(self.settings.navigationSkip && self.active) { //if navigationSkip is enabled and Sequence is animating (a frame is being skipped before it has finished animating)...
				self.navigationSkipThresholdActive = true; //the navigationSkipThreshold is now active
				if(self.settings.fadeFrameWhenSkipped) { //if a frame should fade when skipped...
					self.nextFrame.stop().animate({"opacity": 0}, self.settings.fadeFrameTime); //fade
				}

				clearTimeout(self.transitionThresholdTimer);

				setTimeout(function() { //start the navigationSkipThreshold timer to prevent being able to navigate too quickly
					self.navigationSkipThresholdActive = false; //once the timer is complete, navigationSkip can occur again
				}, self.settings.navigationSkipThreshold);
			}

			if(!self.active || self.settings.navigationSkip) { //if there are no animations running or navigationSkip is enabled...
				self.active = true; //Sequence is now animating
				self._resetAutoPlay(); //stop any autoPlay timer that may be running

				if(direction === undefined) { //if no direction to navigate was defined...
					self.direction = (id > self.currentFrameID) ? 1 : -1; //work out which way to go based on what frame is currently active
				}else{
					self.direction = direction; //go to the developer defined frame
				}

				self.currentFrame = self.canvas.children(".animate-in"); //find which frame is active -- the frame currently being viewed (and about to be animated out)
				self.nextFrame = self.frames.eq(id-1); //grab the next frame
				self.currentFrameChildren = self.currentFrame.children();	//save the child elements of the current frame
				self.nextFrameChildren = self.nextFrame.children(); //save the child elements of the next frame

				if(self.pagination !== undefined) { //if using pagination...
					self.paginationLinks.removeClass('current'); //remove the 'current' class from all pagination links
					$(self.paginationLinks[id-1]).addClass('current'); //add the 'current' class to the current frame
				}

				if(self.transitionsSupported) { //if the browser supports CSS3 transitions...
					if(self.currentFrame.length !== undefined) { //if there is a current frame (one that is in it's animate-in position)...
						self.beforeCurrentFrameAnimatesOut(); //callback
						if(self.settings.moveActiveFrameToTop) { //if the active frame should move to the top...
							self.currentFrame.css("z-index", 1); //move this frame to the bottom as it is now inactive
						}
						self._resetElements(self.transitionPrefix, self.nextFrameChildren, "0s"); //give the next frame elements a transition-duration and transition-delay of 0s so they don't transition to their reset position
						if(!self.settings.reverseAnimationsWhenNavigatingBackwards || self.direction === 1) { //if user hit next button...
							self.nextFrame.removeClass("animate-out"); //reset the next frame back to its starting position
							self._resetElements(self.transitionPrefix, self.currentFrameChildren, "");  //remove any inline styles from the elements to be animated so styles via the "animate-out" class can take full effect
						}else if(self.settings.reverseAnimationsWhenNavigatingBackwards && self.direction === -1) { //if the user hit prev button
							self.nextFrame.addClass("animate-out"); //reset the next frame back to its animate-out position
							self._reverseTransitionProperties(); //reverse the transition-duration, transition-delay and transition-timing-function
						}
					}else{
						self.isStartingFrame = false; //no longer the first frame
					}

					self.active = true; //Sequence is now animating
					self.currentFrame.unbind(self.transitionEnd); //remove the animation end event
					self.nextFrame.unbind(self.transitionEnd); //remove the animation end event

					if(self.settings.fadeFrameWhenSkipped && self.settings.navigationSkip) { //if a frame may have faded out when it was previously skipped...
						self.nextFrame.css("opacity", 1); //show it again
					}

					self.beforeNextFrameAnimatesIn(); //callback
					if(self.settings.moveActiveFrameToTop) { //if an active frame should be moved to the top...
						self.nextFrame.css('z-index', self.numberOfFrames);
					}

					//modifications to the current and next frame's elements to get them ready to animate
					if(!self.settings.reverseAnimationsWhenNavigatingBackwards || self.direction === 1) { //if user hit next button...
						setTimeout(function() { //50ms timeout to give the browser a chance to modify the DOM sequentially
							self._resetElements(self.transitionPrefix, self.nextFrameChildren, ""); //remove any inline styles from the elements to be animated so styles via the "animate-in" class can take full effect
							self._waitForAnimationsToComplete(self.nextFrame, self.nextFrameChildren, "in"); //wait for the next frame to animate in
							if(self.afterCurrentFrameAnimatesOut !== "function () {}" || (self.settings.transitionThreshold === true && ignoreTransitionThreshold !== true)) { //if the afterCurrentFrameAnimatesOut is being used...
								self._waitForAnimationsToComplete(self.currentFrame, self.currentFrameChildren, "out", true, 1); //wait for the current frame to animate out as well
							}
						}, 50);

						//final class changes to make animations happen
						setTimeout(function() { //50ms timeout to give the browser a chance to modify the DOM sequentially
							if(self.settings.transitionThreshold === false || self.settings.transitionThreshold === 0 || ignoreTransitionThreshold === true) { //if not using a transitionThreshold...
								self.currentFrame.toggleClass("animate-out animate-in"); //remove the "animate-in" class and add the "animate-out" class to the current frame
								self.nextFrame.addClass("animate-in"); //add the "animate-in" class
							}else { //if using a transitionThreshold...
								self.currentFrame.toggleClass("animate-out animate-in"); //remove the "animate-in" class and add the "animate-out" class to the current frame
								if(self.settings.transitionThreshold !== true) { //if there's no transitionThreshold or the dev specified a transitionThreshold in milliseconds
									self.transitionThresholdTimer = setTimeout(function() { //cause the next frame to animate in after a certain period
										self.nextFrame.addClass("animate-in"); //add the "animate-in" class
									}, transitionThreshold);
								}
							}
						}, 50);
					}else if(self.settings.reverseAnimationsWhenNavigatingBackwards && self.direction === -1) { //if the user hit prev button
						setTimeout(function() { //50ms timeout to give the browser a chance to modify the DOM sequentially
							//remove any inline styles from the elements so styles via the "animate-in" and "animate-out" class can take full effect
							self._resetElements(self.transitionPrefix, self.currentFrameChildren, "");
							self._resetElements(self.transitionPrefix, self.nextFrameChildren, "");
							self._reverseTransitionProperties(); //reverse the transition-duration, transition-delay and transition-timing-function

							self._waitForAnimationsToComplete(self.nextFrame, self.nextFrameChildren, "in"); //wait for the next frame to animate in
							if(self.afterCurrentFrameAnimatesOut !== "function () {}" || (self.settings.transitionThreshold === true && ignoreTransitionThreshold !== true)) { //if the afterCurrentFrameAnimatesOut is being used...
								self._waitForAnimationsToComplete(self.currentFrame, self.currentFrameChildren, "out", true, -1); //wait for the current frame to animate out as well
							}
						}, 50);

						//final class changes to make animations happen
						setTimeout(function() { //50ms timeout to give the browser a chance to modify the DOM sequentially
							if(self.settings.transitionThreshold === false || self.settings.transitionThreshold === 0 || ignoreTransitionThreshold === true) { //if not using a transitionThreshold...
								self.currentFrame.removeClass("animate-in"); //remove the "animate-in" class from the current frame
								self.nextFrame.toggleClass("animate-out animate-in"); //add the "animate-out" class and remove the "animate-in" class from the next frame
							}else{ //if using a transitionThreshold...
								self.currentFrame.removeClass("animate-in");
								if(self.settings.transitionThreshold !== true) { //if there's no transitionThreshold or the dev specified a transitionThreshold in milliseconds
									self.transitionThresholdTimer = setTimeout(function() { //cause the next frame to animate in after a certain period
										self.nextFrame.toggleClass("animate-out animate-in"); //add the "animate-in" class and remove the "animate-out" class
									}, transitionThreshold);
								}
							}
						}, 50);
					}
				}else{ //if the browser doesn't support CSS3 transitions...
					function animationComplete() {
						self._setHashTag();
						self.active = false;
						self._resetAutoPlay(true, self.settings.autoPlayDelay);
					}

					switch(self.settings.fallback.theme) {
						case "fade": //if using the fade fallback theme...
							self.frames.css({"position": "relative"}); //this allows for fadein/out in IE
							self.beforeCurrentFrameAnimatesOut();
							self.currentFrame = self.frames.eq(self.currentFrameID-1);
							self.currentFrame.animate({"opacity": 0}, self.settings.fallback.speed, function() { //hide the current frame
								self.currentFrame.css({"display": "none", "z-index": "1"});
								self.afterCurrentFrameAnimatesOut();
								self.beforeNextFrameAnimatesIn();
								self.nextFrame.css({"display": "block", "z-index": self.numberOfFrames}).animate({"opacity": 1}, 500, function() {
									self.afterNextFrameAnimatesIn();
								}); //make the next frame the current one and show it
								animationComplete();
							});

							self.frames.css({"position": "relative"}); //this allows for fadein/out in IE
						break;

						case "slide": //if using the slide fallback theme...
						default:
							//create objects which will save the .css() and .animation() objects
							var animateOut = {};
							var animateIn = {};
							var moveIn = {};

							//construct the .css() and .animation() objects
							if(self.direction === 1) {
								animateOut.left = "-100%";
								animateIn.left = "100%";
							}else{
								animateOut.left = "100%";
								animateIn.left = "-100%";
							}

							moveIn.left = "0";
							moveIn.opacity = 1;

							self.currentFrame = self.frames.eq(self.currentFrameID-1);
							self.beforeCurrentFrameAnimatesOut();
							self.currentFrame.animate(animateOut, self.settings.fallback.speed, function() {
								self.currentFrame.css({"display": "none", "z-index": "1"});
								self.afterCurrentFrameAnimatesOut();
							}); //cause the current frame to animate out
							self.beforeNextFrameAnimatesIn(); //callback
							self.nextFrame.show().css(animateIn);
							self.nextFrame.css({"display": "block", "z-index": self.numberOfFrames}).animate(moveIn, self.settings.fallback.speed, function() { //cause the next frame to animate in
								animationComplete();
								self.afterNextFrameAnimatesIn(); //callback
							});
						break;
					}
				}
				self.currentFrameID = id; //make the currentFrameID the same as the one that is to animate in
			}
		},

		/* 
			removes Sequence from the element it's attached to

			callback: a callback to run once .destroy() has finished (or see the sequence.destroyed() callback)
		*/
		destroy: function(callback) {
			var self = this;

			self.container.addClass('sequence-destroyed'); //add a class of "destroyed" in case the developer wants to animate opacity etc

			//REMOVE EVENTS
			if(self.nextButton !== undefined) { //remove the next button click event if a next button is defined
				self.nextButton.unbind('click.sequence');
			}
			if(self.prevButton !== undefined) { //remove the previous button click event if a previous button is defined
				self.prevButton.unbind('click.sequence');
			}
			if(self.pauseButton !== undefined) { //remove the pause button click event if a pause button is defined
				self.pauseButton.unbind('click.sequence');
			}

			if(self.pagination !== undefined) {
				self.paginationLinks.unbind('click.sequence');
			}

			$(document).unbind('keydown.sequence'); //unbind key events
			self.canvas.unbind('mouseenter.sequence, mouseleave.sequence, touchstart.sequence, touchmove.sequence'); //unbind mouse and touch events
			$(window).unbind('hashchange.sequence'); //unbind hashchange

			//CLEAR TIMERS
			self.stopAutoPlay();
			clearTimeout(self.transitionThresholdTimer);

			//TIDY UP THE DOM
			self.canvas.children('li').remove(); //because Sequence rearranges frames so the active one is always on top, remove them all...
			self.canvas.prepend(self.frames); //then add them back in, in their original order
			self.frames.removeClass('animate-in animate-out').removeAttr('style'); //remove classes and inline styles from all frames
			self.frames.eq(self.currentFrameID-1).addClass('animate-in'); //keep the current frame in it's animate-in position

			//HIDE UI ELEMENTS
			if(self.nextButton !== undefined && self.nextButton !== false) { //if a next button is defined and was shown on initiation, hide it
				self.nextButton.hide();
			}
			if(self.prevButton !== undefined && self.prevButton !== false) { //if a prev button is defined and was shown on initiation, hide it
				self.prevButton.hide();
			}
			if(self.pauseButton !== undefined && self.pauseButton !== false) { //if a pause button is defined and was shown on initiation, hide it
				self.pauseButton.hide();
			}
			if(self.pauseIcon !== undefined && self.pauseIcon !== false) { //if a pause icon is defined, hide it
				self.pauseIcon.hide();
			}
			if(self.pagination !== undefined && self.pagination !== false) { //if pagination is defined and was shown on initiation, hide it
				self.pagination.hide();
			}

			//CALLBACKS - a callback can either be passed into the destroy() function or by using the sequence.destroyed() publc method
			if(callback !== undefined) {
				callback(); //callback past into the function
			}

			self.destroyed(); //callback
			self.container.removeData(); //remove data
		},
		//END PUBLIC METHODS

		//PRIVATE METHODS

		//trigger keyEvents, customKeyEvents and swipeEvents
		_initCustomKeyEvent: function(event) {
			var self = this;

			switch(event) {
				case "next":
				self.next();
				break;
				case "prev":
				self.prev();
				break;
				case "pause":
				self.pause(true);
				break;
			}
		},

		/*
		reset the transition-duration and transition-delay properties of an element
		
		elementToReset = the element that is to have it's properties reset
		cssValue = the value to be given to the transition-duration and transition-delay properties
		*/
		_resetElements: function(prefix, elementToReset, cssValue) {
			var self = this;

			elementToReset.css(
				self._prefixCSS(prefix, {
					"transition-duration": cssValue,
					"transition-delay": cssValue,
					"transition-timing-function": ""
				})
			);
		},

		/*
		when navigating backwards and reverseAnimationsWhenNavigatingBackwards is true, take the transition properties for forward animation and manipulate the animated elements to create a perfect reversal
		*/
		_reverseTransitionProperties: function() {
			var self = this;

			var currentFrameChildrenDurations = []; //saves the duration for each of the current frame's element
			var nextFrameChildrenDurations = []; //saves the duration for each of the next frame's element

			self.currentFrameChildren.each(function() { //get the overall duration (including delay) for each animated element in the current frame
				currentFrameChildrenDurations.push(parseFloat($(this).css(self.transitionPrefix+'transition-duration').replace('s', '')) + parseFloat($(this).css(self.transitionPrefix+'transition-delay').replace('s', '')));
			});

			self.nextFrameChildren.each(function() { //get the overall duration (including delay) for each animated element in the current frame
				nextFrameChildrenDurations.push(parseFloat($(this).css(self.transitionPrefix+'transition-duration').replace('s', '')) + parseFloat($(this).css(self.transitionPrefix+'transition-delay').replace('s', '')));
			});

			var maximumCurrentFrameDuration = Math.max.apply(Math, currentFrameChildrenDurations); //find which transition duration is the longest
			var maximumNextFrameDuration = Math.max.apply(Math, nextFrameChildrenDurations); //find which transition duration is the longest
			var transitionDifference = maximumCurrentFrameDuration - maximumNextFrameDuration; //get the overal transition difference between the current and next frame
			var currentDelay = 0;
			var nextDelay = 0;

			if(transitionDifference < 0 && !self.settings.preventDelayWhenReversingAnimations) { //if the current frame has a greater duration than the next frame...
				/* note: because the current frame will take longer to animate out than the next to animate in, when this animation is reversed, the current frame will have a delay applied before it animates out. By default, Sequence will aim to avoid this (via the preventDelayWhenReversingAnimations option) because a delay on the current frame may confuse the user. The delay is removed, which means the reversal of animation is slightly out of sync */
				currentDelay = Math.abs(transitionDifference);
			}else if(transitionDifference > 0) { //if the next frame has a greater duration than the current frame, add the difference on as a delay
				nextDelay = Math.abs(transitionDifference);
			}

			var reverseEachProperty = function(transitionProperties, currentFrameChildren, maximumFrameDuration, frameDelay) {

				function convertTimingFunctionToCubicBezier(timingFunction) {

					timingFunction = timingFunction.split(',')[0]; //only use one timing function

					var timingFunctionToCubicBezier = {
					    "linear" : "cubic-bezier(0.0,0.0,1.0,1.0)",
					    "ease"   : "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
					    "ease-in": "cubic-bezier(0.42, 0.0, 1.0, 1.0)",
					    "ease-in-out": "cubic-bezier(0.42, 0.0, 0.58, 1.0)",
					    "ease-out": "cubic-bezier(0.0, 0.0, 0.58, 1.0)"
					};

					if(timingFunction.indexOf("cubic-bezier") < 0) { //if the timing-function returned isn't a cubic-bezier()
					  timingFunction = timingFunctionToCubicBezier[timingFunction]; //convert it to one
					}

					return timingFunction; //return a cubic-bezier()
				}

				currentFrameChildren.each(function() {

					var duration = parseFloat($(this).css(self.transitionPrefix+'transition-duration').replace('s', '')); //get the elements transition-duration
					var delay = parseFloat($(this).css(self.transitionPrefix+'transition-delay').replace('s', '')); //get the elements transition-delay
					var transitionFunction = $(this).css(self.transitionPrefix+'transition-timing-function'); //get the elements transiion-timing-function
					
					if(transitionFunction.indexOf('cubic') === -1) { //if the function isn't a cubic-bezier (the Blink engine returns keywords instead)...
						var transitionFunction = convertTimingFunctionToCubicBezier(transitionFunction); //convert the keyword to cubic-bezier()
					}

					var cubicBezier = transitionFunction.replace('cubic-bezier(', '').replace(')', '').split(','); //remove the CSS function and just get the array
					$.each(cubicBezier, function(index, value) { //for each point that makes up the cubic bezier...
						cubicBezier[index] = parseFloat(value); //turn the point into a number (rather than text)
					});

					//reverse the cubic bezier
					var reversedCubicBezier = [
					1 - cubicBezier[2],
					1 - cubicBezier[3],
					1 - cubicBezier[0],
					1 - cubicBezier[1]
					];
					transitionFunction = 'cubic-bezier('+reversedCubicBezier+')'; //add the reversed cubic bezier back into a CSS function

					var frameDuration = duration + delay; //get the overall duration of the element

					transitionProperties["transition-duration"] = duration + 's'; //reapply the element's transition-duration (to override any inline styles)
					transitionProperties["transition-delay"] = (maximumFrameDuration - frameDuration + frameDelay) + 's'; //add a delay if required
					transitionProperties["transition-timing-function"] = transitionFunction; //reapply the reversed transition function
					$(this).css(
						self._prefixCSS(self.transitionPrefix, transitionProperties) //set the new transition properties
						);
				});
			};

			reverseEachProperty(self.transitionProperties, self.currentFrameChildren, maximumCurrentFrameDuration, currentDelay); //reverse properties for each of the current frame's elements
			reverseEachProperty(self.transitionProperties, self.nextFrameChildren, maximumNextFrameDuration, nextDelay); //reverse properties for each of the next frame's elements
		},

		/*
		adds the browser vendors prefix onto multiple CSS properties
		
		prefix = the prefix for the browser Sequence is being viewed in (-webkit- for example)
		properties = the properties to be prefixed (transition-duration for example)
		*/
		_prefixCSS: function(prefix, properties) {
			var self = this;

			var css = {};
			for(var property in properties) { //for each property to be modified...
				css[prefix + property] = properties[property]; //add the prefix to the property name
			}
			return css; //return the prefixed CSS
		},

		/*
		internal function used to start and stop autoPlay
		start: if true, autoPlay will be started, else it'll be stopped
		delay: a time in ms before starting the autoPlay feature (if unspecified, the default will be used)
		*/
		_resetAutoPlay: function(start, delay) {
			var self = this;

			if(start === true) { //if starting autoPlay
				if(self.settings.autoPlay && !self.isSoftPaused) { //if using autoPlay and Sequence isn't paused...
					clearTimeout(self.autoPlayTimer); //stop the autoPlay timer
					self.autoPlayTimer = setTimeout(function() { //start a new autoPlay timer and...
						if(self.settings.autoPlayDirection === 1) { //go to either the next or previous frame
							self.next();
						}else{
							self.prev();
						}
					}, delay); //after a specified delay
				}
			}else{ //if stopping autoPlay
				clearTimeout(self.autoPlayTimer); //stop the autoPlay timer
			}
		},

		/*functionality to initiate the preloader, next/previous buttons and so on
	
		devOption: true = the developer wants to use the default selector. false = don't use a uiElement. string = the developer defined selector to use for the UI element
		defaultOption: the default selector to use for the UI element, when the developer specifies false for devOption
		*/
		_renderUiElements: function(devOption, defaultOption) {
			var self = this;

			switch(devOption) {
				case false: //don't set up a uiElement
				return undefined;

				case true: //use the default uiElement
					if(defaultOption === ".sequence-preloader") { //if setting up the preloader...
						self._defaultPreloader(self.container, self.transitionsSupported, self.animationPrefix); //get the default preloader
					}
					return $(defaultOption); //return the default element

				default: //if using a developer defined selector...
					return $(devOption); //return the developer defined element
			}
		},

		/*
		prevents the next frame from animating until the current frame has finished animating

		frame: the frame <li> which is animating
		self.currentFrameChildren: the animated direct child elements of the frame
		transitionPhase: whether the elements are animating "in" to an active position or "out" of an active position
		inAfterwards: whether the next frame should animate in afterwards
		direction: the direction of animation
		*/
		_waitForAnimationsToComplete: function(frame, currentFrameChildren, transitionPhase, inAfterwards, direction) {
			var self = this;

			if(transitionPhase === "out") { //if waiting on a frame's element to animate out...
				var onceComplete = function() {
					self.afterCurrentFrameAnimatesOut(); //callback

					if(self.settings.transitionThreshold === true) {
						if(direction === 1) {
							self.nextFrame.addClass("animate-in"); //add the "animate-in" class
						}else if(direction === -1) {
							self.nextFrame.toggleClass("animate-out animate-in");
						}
					}
				};
			}else if(transitionPhase === "in") { //if waiting on a frame's element to animate in...
				var onceComplete = function() {
					self.afterNextFrameAnimatesIn(); //callback
					self._setHashTag(); //set the hashtag to represent the newly active frame

					self.active = false; //Sequence is not animating

					if(!self.isHardPaused && !self.isBeingHoveredOver) { //if Sequence isn't hard paused (via a pause button for example) or being hovered over...
						if(!self.delayUnpause) { //if unpausing isn't delayed (Sequence wasn't animating when unpause was invoked)...
							self.unpause(false); //unpause Sequence but don't run the unpause callback
						}else{ //if unpausing was delay because Sequence was animating when unpause was invoked...
							self.delayUnpause = false;
							self.unpause(); //unpause Sequence
						}
					}
				};
			}

			currentFrameChildren.data('animationEnded', false); // set the data attribute of each animated element to indicate that the animation has not yet ended
			frame.bind(self.transitionEnd, function(e) { //when an element finishes animating...
				$(e.target).data('animationEnded', true); // set the data attrbiute to indicate that the element has finished it's animation

				// now check if all elements have finished animating
				var allAnimationsEnded = true;
				currentFrameChildren.each(function() { //for each element being animated within a frame...
					if($(this).data('animationEnded') === false) { //if the animation hasn't ended...
						allAnimationsEnded = false; //not all animations have ended yet
						return false; //break out of the animationEnded check early
					}
				});

				if(allAnimationsEnded) { //if all animations have ended...
					frame.unbind(self.transitionEnd); //stop waiting for animations to end
					onceComplete();
				}
			});
		},

		_setHashTag: function() {
			var self = this;

			if(self.settings.hashTags) { //if hashTags is enabled...
				self.currentHashTag = self.nextFrame.prop(self.getHashTagFrom); //get the hashtag name
				self.frameHashIndex = $.inArray(self.currentHashTag, self.frameHashID); //get the index of the frame that matches the hashtag
				if(self.frameHashIndex !== -1 && (self.settings.hashChangesOnFirstFrame || (!self.isStartingFrame || !self.transitionsSupported))) { //if the hashtag matches a Sequence frame ID...
					self.nextFrameID = self.frameHashIndex + 1;
					document.location.hash = "#"+self.currentHashTag;
				}else{
					self.nextFrameID = self.settings.startingFrameID;
					self.isStartingFrame = false;
				}
			}
		},

		/* Modernizr 2.6.1 (Custom Build) | MIT & BSD
		 * Build: http://modernizr.com/download/#-svg-prefixed-testprop-testallprops-domprefixes
		 */
		_modernizrForSequence: function() {
			;window.ModernizrForSequence=function(a,b,c){function x(a){i.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.1",e={},f=b.documentElement,g="modernizrForSequence",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={svg:"http://www.w3.org/2000/svg"},p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=self;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(self instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.svg=function(){return!!b.createElementNS&&!!b.createElementNS(o.svg,"svg").createSVGRect};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return B([a])},e.testAllProps=D,e.prefixed=function(a,b,c){return b?D(a,b,c):D(a,"pfx")},e}(self,self.document);
		},

		/* Set up Sequence's default preloader
		 * prependTo = which element to prepend the preloader to
		 * transitions = whether CSS3 transitions are supported
		 * prefix = the prefix for the browser Sequence is being viewed in
		 */
		_defaultPreloader: function(prependTo, transitions, prefix) {
			var icon = '<div class="sequence-preloader"><svg class="preloading" xmlns="http://www.w3.org/2000/svg"><circle class="circle" cx="6" cy="6" r="6" /><circle class="circle" cx="22" cy="6" r="6" /><circle class="circle" cx="38" cy="6" r="6" /></svg></div>';

			$("head").append("<style>.sequence-preloader{height: 100%;position: absolute;width: 100%;z-index: 999999;}@"+prefix+"keyframes preload{0%{opacity: 1;}50%{opacity: 0;}100%{opacity: 1;}}.sequence-preloader .preloading .circle{fill: #ff9442;display: inline-block;height: 12px;position: relative;top: -50%;width: 12px;"+prefix+"animation: preload 1s infinite; animation: preload 1s infinite;}.preloading{display:block;height: 12px;margin: 0 auto;top: 50%;margin-top:-6px;position: relative;width: 48px;}.sequence-preloader .preloading .circle:nth-child(2){"+prefix+"animation-delay: .15s; animation-delay: .15s;}.sequence-preloader .preloading .circle:nth-child(3){"+prefix+"animation-delay: .3s; animation-delay: .3s;}.preloading-complete{opacity: 0;visibility: hidden;"+prefix+"transition-duration: 1s; transition-duration: 1s;}div.inline{background-color: #ff9442; margin-right: 4px; float: left;}</style>");
			prependTo.prepend(icon);
			if(!ModernizrForSequence.svg && !transitions) { //if SVG isn't supported, remain calm and add this fallback instead...
				$(".sequence-preloader").prepend('<div class="preloading"><div class="circle inline"></div><div class="circle inline"></div><div class="circle inline"></div></div>');
				setInterval(function() {
					$(".sequence-preloader .circle").fadeToggle(500);
				}, 500);
			}else if(!transitions) { //if transitions aren't supported, toggle the opacity instead
				setInterval(function() {
					$(".sequence-preloader").fadeToggle(500);
				}, 500);
			}
		},

		//a quick test to work out if Opera supports transitions properly (to work around the fact that Opera 11 supports transitions but doesn't return a transition value properly)
		_operaTest: function() {
			$("body").append('<span id="sequence-opera-test"></span>');
			var $operaTest = $("#sequence-opera-test");
			$operaTest.css("-o-transition", "1s"); //add a transition value to the Opera test
			if($operaTest.css("-o-transition") !== "1s") { //if the expected value isn't returned...
				$operaTest.remove();
				return false; //cause Opera to go into the fallback theme
			}else{
				$operaTest.remove();
				return true;
			}
		}
		//END PRIVATE METHODS

	}; //END PROTOTYPE

	var defaults = {
		//General Settings
		startingFrameID: 1, //The frame (the list item `<li>`) that should first be displayed when Sequence loads
		cycle: true, //Whether Sequence should navigate to the first frame after the last frame and vice versa
		animateStartingFrameIn: false, //Whether the first frame should animate in to its active position
		transitionThreshold: false, //The delay between a frame animating out and the next animating in (false = no delay, true = the next frame will animate in only once the current frame has animated out)
		reverseAnimationsWhenNavigatingBackwards: true, //Whether animations should be reversed when a user navigates backwards by clicking a previous button/swiping/pressing the left key
		preventDelayWhenReversingAnimations: false, //Whether a delay should be removed when animations are reversed. This delay is removed by default to prevent user confusion
		moveActiveFrameToTop: true, //Whether a frame should be given a higher `z-index` than other frames whilst it is active, to bring it above the others

		//Autoplay Settings
		autoPlay: false, //Cause Sequence to automatically change between frames over a period of time, as defined in autoPlayDelay
		autoPlayDirection: 1, //The direction in which Sequence should auto play
		autoPlayDelay: 5000, //The duration in milliseconds at which frames should remain on screen before animating to the next

		//Frame Skipping Settings
		navigationSkip: true, //Whether the user can navigate through frames before each frame has finished animating
		navigationSkipThreshold: 250, //Amount of time that must pass before the next frame can be navigated to
		fadeFrameWhenSkipped: true, //If a frame is skipped before it finishes animating, it will quickly fade out
		fadeFrameTime: 150, //If fadeFrameWhenSkipped is true, how quickly a frame should fade out when skipped (in milliseconds)
		preventReverseSkipping: false, //Whether the user can change the direction of navigation during frames animating (if navigating forward, the user can only skip forwards when other frames are animating).

		//Next/Prev Button Settings
		nextButton: false, //if true, Sequence will use an element with class ".sequence-next" as the next button, else specify your own selector. false = don't use an in-built next button
		showNextButtonOnInit: true, //if true, Sequence will make the next button display: block; once Sequence has loaded (give the next button selector display: none; in the CSS to hide it until its usable)
		prevButton: false, //if true, Sequence will use an element with class ".sequence-prev" as the previous button, else specify your own selector. false = don't use an in-built previous button
		showPrevButtonOnInit: true, //if true, Sequence will make the previous button display: block; once Sequence has loaded (give the previous button selector display: none; in the CSS to hide it until its usable)

		//Pause Settings
		pauseButton: false, //if true, Sequence will use an element with class ".sequence-pause" as the pause button, else specify your own selector. false = don't use an in-built pause button
		unpauseDelay: null, //the time to wait before navigating to the next frame when Sequence is unpaused. Note that if an unpauseDelay is not specified, the default is the same as the autoPlayDelay setting
		pauseOnHover: true, //pause Sequence when the Sequence container is hovered over
		pauseIcon: false, 	//if true, Sequence will use an element with class ".sequence-pause-icon" as the pause icon, else specify your own selector. false = don't use an in-built pause icon (the pause icon will display when Sequence is paused)
		showPauseButtonOnInit: true, //if true, Sequence will make the pause button display: block; once Sequence has loaded (give the pause button selector display: none; in the CSS to hide it until its usable)

		//Pagination Settings
		pagination: false, //if true, Sequence will use an element with class ".sequence-pagination" as the paginated navigation, else specify your own selector. false = don't use in-built pagination
		showPaginationOnInit: true,  //if true, Sequence will make the pagination display: block; once Sequence has loaded (give the pagination selector display: none; in the CSS to hide it until its usable)

		//Preloader Settings
		preloader: false,
		preloadTheseFrames: [1], //all images in these frames will load before Sequence initiates
		preloadTheseImages: [ //specify particular images to load before Sequence initiates
			/* Example usage
			"images/catEatingSalad.jpg",
			"images/meDressedAsBatman.png"
			*/
		],
		/*Note: You can use preloadTheseFrames and preloadTheseImages together. You might want to load all images in frame 1 and just one big image from frame 2 for example*/
		hideFramesUntilPreloaded: true,
		prependPreloadingComplete: true,
		hidePreloaderUsingCSS: true,
		hidePreloaderDelay: 0,

		//Keyboard settings
		keyNavigation: true, //false prevents the following keyboard settings
		numericKeysGoToFrames: true,
		keyEvents: {
			left: "prev",
			right: "next"
		},
		customKeyEvents: {
			/* Example usage
			65: "prev",	//a
			68: "next",	//d
			83: "prev",	//s
			87: "next"	//w
			*/
		},

		//Touch Swipe Settings
		swipeNavigation: true,
		swipeThreshold: 20,
		swipePreventsDefault: false, //be careful if setting this to true
		swipeEvents: {
			left: "prev",
			right: "next",
			up: false,
			down: false
		},

		//hashTags Settings
		//when using hashTags, please include a reference to Ben Alman's jQuery HashChange plugin above your reference to Sequence.js

		//info: http://benalman.com/projects/jquery-hashchange-plugin/
		//plugin: https://raw.github.com/cowboy/jquery-hashchange/v1.3/jquery.ba-hashchange.min.js
		//GitHub: https://github.com/cowboy/jquery-hashchange
		hashTags: false, //when a frame is navigated to, change the hashtag to the frames ID
		hashDataAttribute: false, //false = the hashTag is taken from a frames ID attribute | true = the hashTag is taken from the data attribute "data-sequence-hash"
		hashChangesOnFirstFrame: false, //false = the hashTag won't change for the first frame but will for those after

		//Fallback Theme Settings (For browsers that don't support CSS3 transitions)
		fallback: {
			theme: "slide",
			speed: 500
		}
	};

	$.fn.sequence = function(options) {
		return this.each(function() {
			if (!$.data(this, 'sequence')) { //prevent multiple initiations on the same element
				$.data(this, 'sequence', new Sequence($(this), options, defaults));
      }
		});
	};
})(jQuery);