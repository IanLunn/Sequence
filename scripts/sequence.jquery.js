/*
Sequence.js (www.sequencejs.com)
Version: 0.7.4 Beta
Author: Ian Lunn @IanLunn
Author URL: http://www.ianlunn.co.uk/
Github: https://github.com/IanLunn/Sequence

This is a FREE script and is dual licensed under the following:
http://www.opensource.org/licenses/mit-license.php | http://www.gnu.org/licenses/gpl.html

Sequence.js and its dependencies are (c) Ian Lunn Design 2012 unless otherwise stated.
Aside from these comments, you may modify and distribute this file as you please. Have fun!
*/

(function($){
	function Sequence(element, options, defaults, get){
		var self = this;
		self.container = $(element),
		self.sequence = self.container.children("ul");
		
		try{ //is Modernizr.prefixed installed?
			Modernizr.prefixed;
			if(Modernizr.prefixed === undefined){
				throw "undefined";
			}
		}
		catch(err){ //if not...get the custom build necessary for Sequence
			get.modernizr();
		}
		
		var prefixes = {
		'WebkitTransition' : '-webkit-',
		'MozTransition'    : '-moz-',
		'OTransition'      : '-o-',
		'msTransition'     : '-ms-',
		'transition'       : ''
		},
		transitions = {
		'WebkitTransition' : 'webkitTransitionEnd webkitAnimationEnd',
		'MozTransition'    : 'transitionend animationend',
		'OTransition'      : 'otransitionend oanimationend',
		'msTransition'     : 'MSTransitionEnd MSAnimationEnd',
		'transition'       : 'transitionend animationend'
		};
		
		self.prefix = prefixes[Modernizr.prefixed('transition')],
		self.transitionEnd = transitions[Modernizr.prefixed('transition')],
		self.transitionProperties = {},
		self.numberOfFrames = self.sequence.children("li").length,
		self.transitionsSupported = (self.prefix !== undefined) ? true : false, //determine if transitions are supported
		self.hasTouch = ("ontouchstart" in window) ? true : false, //determine if this is a touch enabled device
		self.autoPlayTimer, //the timer used for the autoPlay feature
		self.isPaused = false, //whether Sequence is paused via being hovered over
		self.isHardPaused = false, //whether Sequence is paused via a pause button
		self.defaultPreloader,
		self.init = {
			preloader: function(optionPreloader){
				self.prependTo = (self.settings.prependPreloader == true) ? self.container : self.settings.prependPreloader;
				
				switch(optionPreloader){
					case true:
					case undefined:
						get.defaultPreloader(self.prependTo, self.transitionsSupported, self.prefix);
						if(!self.transitionsSupported){
							self.preloaderFallback();
						}
						return $(".sequence-preloader");
					
					case false:
						break;
					
					default:
						this.CSSSelectorToHTML(optionPreloader);
						return $(optionPreloader);
				}
			},
			
			uiElements: function(devOption, defaultOption){
				switch(devOption){
					case false:
						return undefined;

					case true:
					    if(defaultOption === ".sequence-preloader"){ //if setting up the preloader
					        get.defaultPreloader(self.container, self.transitionsSupported, self.prefix);
					    };
						return $(defaultOption);

					default:
						return $(devOption);
				}
			}
		};

		//Callbacks
		self.paused = function() {},						//executes when Sequence is paused
		self.unpaused = function() {},						//executes when Sequence is unpaused
		
		self.beforeNextFrameAnimatesIn = function() {},		//executes before the next frame animates in
		self.afterNextFrameAnimatesIn = function() {},		//executes after the next frame animates in
		self.beforeCurrentFrameAnimatesOut = function() {},	//executes before the current frame animates out
		self.afterCurrentFrameAnimatesOut = function() {},	//executes after the current frame animates out
		
		self.beforeFirstFrameAnimatesIn = function() {},	//executes before the first frame animates in
		self.afterFirstFrameAnimatesIn = function() {},		//executes after the first frame animates in
		self.beforeLastFrameAnimatesIn = function() {},		//executes before the last frame animates in
		self.afterLastFrameAnimatesIn = function() {},		//executes after the last frame animates in

		self.afterLoaded = function() {};					//executes after Sequence is initiated
		
		//INIT
		self.settings = $.extend({}, defaults, options),
		self.settings.preloader = self.init.uiElements(self.settings.preloader, ".sequence-preloader");
		self.firstFrame = (self.settings.animateStartingFrameIn) ? true : false;
		self.settings.unpauseDelay = (self.settings.unpauseDelay === null) ? self.settings.autoPlayDelay : self.settings.unpauseDelay; //if the unpauseDelay is not specified, make it the same as the autoPlayDelay speed
		self.currentHashTag; //the current hash tag taken from the URL
		self.getHashTagFrom = (self.settings.hashDataAttribute) ? "data-sequence-hashtag": "id"; //get the hashtag from the ID or data attribute?  
		self.frameHashID = []; //array that matches frames with has IDs
		
		if(self.settings.hideFramesUntilPreloaded && self.settings.preloader){ //if using a preloader and hiding frames until preloading has completed...
		    self.sequence.children("li").hide(); //hide Sequence's frames
		}
		
		if(self.prefix === "-o-"){ //if Opera prefixes are required...
		    self.transitionsSupported = get.operaTest(); //run a test to see if Opera correctly supports transitions (Opera 11 has bugs relating to transitions)
		}
        
        self.modifyElements(self.sequence.children("li").children(), "0s"); //reset transition time to 0s
		self.sequence.children("li").children().removeClass("animate-in"); //remove any instance of "animate-in", which should be used incase JS is disabled
		
		function oncePreloaded(){
		    self.afterLoaded();
		    if(self.settings.hideFramesUntilPreloaded && self.settings.preloader){
		        self.sequence.children("li").show();
		    }
		    if(self.settings.preloader){
		    	if(self.settings.hidePreloaderUsingCSS && self.transitionsSupported){
		    		self.prependPreloadingCompleteTo = (self.settings.prependPreloadingComplete == true) ? self.settings.preloader : $(self.settings.prependPreloadingComplete);
		    		self.prependPreloadingCompleteTo.addClass("preloading-complete");
		    		setTimeout(init, self.settings.hidePreloaderDelay);
		    	}else{
		    		self.settings.preloader.fadeOut(self.settings.hidePreloaderDelay, function(){
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

		if(self.settings.preloader && 
		(preloadTheseFramesLength !== 0 || preloadTheseImagesLength !== 0)){ //if using the preloader and the dev has specified some images should preload...
		    function saveImagesToArray(length, srcOnly){
		    	var imagesToPreload = []; //saves the images that are to be preloaded
			    	if(!srcOnly){
			    		for(var i = length; i > 0; i--){ //for each frame to be preloaded...
			    			self.sequence.children("li:nth-child("+self.settings.preloadTheseFrames[i-1]+")").find("img").each(function(){ //find <img>'s in specific frames, and for each found...
			    				imagesToPreload.push($(this)[0]); //add it to the array of images to be preloaded
			    			});
		            	}
			    	}else{
			    		for(var i = length; i > 0; i--){ //for each frame to be preloaded...
		            		imagesToPreload.push($("body").find('img[src="'+self.settings.preloadTheseImages[i-1]+'"]')[0]); //find any <img> with the given source and add it to the array of images to be preloaded
			    		}
			    	}			    
		        return imagesToPreload;
		    }
	
            var frameImagesToPreload = saveImagesToArray(preloadTheseFramesLength); //get images from particular Sequence frames to be preloaded
           	var individualImagesToPreload = saveImagesToArray(preloadTheseImagesLength, true); //get images with specific source values to be preloaded
            var imagesToPreload = $(frameImagesToPreload.concat(individualImagesToPreload)); //combine frame images and individual images
			var imagesToPreloadLength = imagesToPreload.length;

			//reliable .load() alternative from here: https://gist.github.com/797120/b7359a8ba0ab5be298875215d07819fe61f87399
			if(!imagesToPreload.length){ //if there are no images to preload...
				oncePreloaded();
			}else{
				imagesToPreload.bind("load",function(){
					if(--imagesToPreloadLength <= 0){ 
					  oncePreloaded();
					}
				}).each(function(){
					// cached images don't fire load sometimes, so we reset src.
					if (this.complete || this.complete === undefined){
					  var src = this.src;				  
					  this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
					  this.src = src;
					}  
				}); 
			}
    	}else{
		    $(window).bind("load", function(){
		    	oncePreloaded();
		    	$(this).unbind("load");
		    });
		}		
		
		function init(){
			$(self.settings.preloader).remove(); //remove the preloader element
						
			self.settings.nextButton = self.init.uiElements(self.settings.nextButton, ".next");			
			self.settings.prevButton = self.init.uiElements(self.settings.prevButton, ".prev");
			self.settings.pauseButton = self.init.uiElements(self.settings.pauseButton, ".pause");
			
			if((self.settings.nextButton !== undefined && self.settings.nextButton !== false) && self.settings.showNextButtonOnInit){self.settings.nextButton.show();}
			if((self.settings.prevButton !== undefined && self.settings.prevButton !== false) && self.settings.showPrevButtonOnInit){self.settings.prevButton.show();}			
			if((self.settings.pauseButton !== undefined && self.settings.pauseButton !== false)){self.settings.pauseButton.show();}
						
			if(self.settings.pauseIcon !== false){
				self.settings.pauseIcon = self.init.uiElements(self.settings.pauseIcon, ".pause-icon");
				if(self.settings.pauseIcon !== undefined){
					self.settings.pauseIcon.hide();
				}
			}else{
			    self.settings.pauseIcon = undefined;
			}
						
			if(self.hasTouch){
				self.settings.calculatedSwipeThreshold = self.container.width() * (self.settings.swipeThreshold / 100);
			}
			
			self.nextFrameID = self.settings.startingFrameID;
			self.nextFrame = self.sequence.children("li:nth-child("+self.nextFrameID+")");
			
			if(self.settings.hashTags){ //if using hashtags...
			    self.sequence.children("li").each(function(){ //for each frame...
			        self.frameHashID.push($(this).attr(self.getHashTagFrom)); //add the hashtag to an array
			    });
			    			    
			    self.currentHashTag = location.hash.replace("#", ""); //get the current hashtag
			    if(self.currentHashTag === undefined || self.currentHashTag === ""){ //if there is no hashtag...
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
									
			self.nextFrame = self.sequence.children("li:nth-child("+self.nextFrameID+")");
			self.nextFrameChildren = self.nextFrame.children();
			self.direction;
			
			self.sequence.css({"width": "100%", "height": "100%", "position": "relative"}); //set the sequence list to 100% width/height just incase it hasn't been specified in the CSS
			self.sequence.children("li").css({"width": "100%", "height": "100%", "position": "absolute"}); //do the same for the frames and make them absolute

			if(self.transitionsSupported){ //initiate the full featured Sequence if transitions are supported...
				if(!self.settings.animateStartingFrameIn){ //start first frame in animated in position				    
					self.currentFrame = self.nextFrame.addClass("current-frame");
					if(self.settings.moveActiveFrameToTop){
					    self.currentFrame.css("z-index", self.numberOfFrames);
					}
					self.currentFrameChildren = self.currentFrame.children();
					self.currentFrameID = self.nextFrameID;
					self.modifyElements(self.currentFrameChildren, "0s");
					self.currentFrameChildren.addClass("animate-in");
					if(self.settings.hashChangesOnFirstFrame){
					    self.currentHashTag = self.currentFrame.attr(self.getHashTagFrom);
					    document.location.hash = "#"+self.currentHashTag;
					}
					
					setTimeout(function(){
						self.modifyElements(self.currentFrameChildren, "");
					}, 100);
					
					self.startAutoPlay(self.settings.autoPlayDelay);
				}else if(self.settings.reverseAnimationsWhenNavigatingBackwards && self.settings.autoPlayDirection -1 && self.settings.animateStartingFrameIn){ //animate in backwards
					self.modifyElements(self.nextFrameChildren, "0s");
					self.nextFrameChildren.addClass("animate-out");
					self.goTo(self.nextFrameID, -1);
				}else{ //animate in forwards
					self.goTo(self.nextFrameID, 1);
				}
			}else{ //initiate a basic slider for browsers that don't support CSS3 transitions
    			self.container.addClass("sequence-fallback");
    			self.currentFrame = self.nextFrame;
    			self.currentFrame.addClass("current-frame");
    			self.beforeNextFrameAnimatesIn();
    			self.afterNextFrameAnimatesIn();
    			if(self.settings.hashChangesOnFirstFrame){
    			    self.currentHashTag = self.currentFrame.attr(self.getHashTagFrom);
    			    document.location.hash = "#"+self.currentHashTag;
    			}
    			self.currentFrameChildren = self.currentFrame.children();
    			self.currentFrameID = self.nextFrameID;			    		
                self.sequence.children("li").children().addClass("animate-in");
                self.sequence.children(":not(li:nth-child("+self.nextFrameID+"))").css({"display": "none", "opacity": 0});
                self.startAutoPlay(self.settings.autoPlayDelay);
			}
			//END INIT
			//EVENTS
			if(self.settings.nextButton !== undefined){ //if a next button is defined...
				self.settings.nextButton.click(function(){ //when the next button is clicked...
					self.next(); //go to the next frame
				});
			}
									
			if(self.settings.prevButton !== undefined){ //if a previous button is defined...
				self.settings.prevButton.click(function(){ //when the previous button is clicked...
					self.prev(); //go to the previous frame
				});
			}
						
			if(self.settings.pauseButton !== undefined){ //if a pause button is defined...
				self.settings.pauseButton.click(function(){ //when the pause button is clicked...
					self.pause(true); //pause Sequence and set hardPause to true
				});
			}
			
			if(self.settings.keyNavigation){
				var defaultKeys = {
					'left'	: 37,
					'right'	: 39
				};

				function keyEvents(keyPressed, keyDirections){
						var keyCode;

						for(keyCodes in keyDirections){
							if(keyCodes === "left" || keyCodes === "right"){
								keyCode = defaultKeys[keyCodes];
							}else{
								keyCode = keyCodes;
							}

							if(keyPressed === parseFloat(keyCode)){ //if the key pressed is associated with a function...
								self.initCustomKeyEvent(keyDirections[keyCodes]); //initiate the function
							}
						}
					}
				
				$(document).keydown(function(e){ //when a key is pressed...					
					var char = String.fromCharCode(e.keyCode);
					if((char > 0 && char <= self.numberOfFrames) && (self.settings.numericKeysGoToFrames)){
						self.nextFrameID = char;
						self.goTo(self.nextFrameID); //go to specified frame
					}
					
					keyEvents(e.keyCode, self.settings.keyEvents); //run default keyevents
					keyEvents(e.keyCode, self.settings.customKeyEvents); //run custom keyevents
				});
			}

			if(self.settings.pauseOnHover && self.settings.autoPlay){ //if using pauseOnHover and autoPlay
				self.sequence.on({
				    mouseenter: function() { //when the mouse enter the Sequence element...
				        if(!self.isHardPaused) { //if Sequence is hard paused (via a pause button)...
				        	self.pause(); //pause autoPlay
				        }
				    },
				    mouseleave: function() { //when the mouse leaves the Sequence element...
				        if(!self.isHardPaused) { //if Sequence is hard paused (via a pause button)...
				        	self.unpause(); //unpause autoPlay
				        }
				    }
				});
			}
			
			if(self.settings.hashTags){ //if hashchange is enabled in the settings...
    			$(window).hashchange(function(){ //when the hashtag changes...
    			    newTag = location.hash.replace("#", ""); //grab the new hashtag
    			    
    			    if(self.currentHashTag !== newTag){ //if the last hashtag is not the same as the current one...
    			        self.currentHashTag = newTag; //save the new tag
    			        self.frameHashIndex = $.inArray(self.currentHashTag, self.frameHashID); //get the index of the frame that matches the hashtag
    			        if(self.frameHashIndex !== -1){ //if the hashtag matches a Sequence frame ID...
    			            self.nextFrameID = self.frameHashIndex + 1; //set that frame as the next one
                            self.goTo(self.nextFrameID); //go to the next frame
    			        }
    			    }
    			});
			}
			
			if(self.settings.swipeNavigation && self.hasTouch){ //if using swipeNavigation and the device has touch capabilities...
        		var touches = {
        		"touchstartX": -1,
        		"touchstartY": -1,
        		"touchmoveX": -1,
        		"touchmoveY": -1
        		};
		
        		self.sequence.on("touchstart touchmove touchend", function(e){
            		if(self.settings.swipePreventsDefault){
            			e.preventDefault();
            		}
            		switch(e.originalEvent.type){
            			case "touchmove":
            			case "touchstart":
            			touches[e.originalEvent.type + "X"] = e.originalEvent.touches[0].pageX;
            			touches[e.originalEvent.type + "Y"] = e.originalEvent.touches[0].pageY;
            			break;
            			case 'touchend':
            			if(touches.touchmoveX !== -1){
            				//find out which way the user moved their finger the most
            				var xAmount = touches.touchmoveX - touches.touchstartX;
            				var yAmount = touches.touchmoveY - touches.touchstartY;
            				
            				if(Math.abs(xAmount) > Math.abs(yAmount) && (xAmount > self.settings.calculatedSwipeThreshold)){
            				//user swiped right
            				self.initCustomKeyEvent(self.settings.swipeEvents.right);
            				}else if(Math.abs(xAmount) > Math.abs(yAmount) && (Math.abs(xAmount) > self.settings.calculatedSwipeThreshold)){
            				//user swiped left
            				self.initCustomKeyEvent(self.settings.swipeEvents.left);
            				}else if(Math.abs(yAmount) > Math.abs(xAmount) && (yAmount > self.settings.calculatedSwipeThreshold)){
            				//user swiped down
            				self.initCustomKeyEvent(self.settings.swipeEvents.down);
            				}else if(Math.abs(yAmount) > Math.abs(xAmount) && (Math.abs(yAmount) > self.settings.calculatedSwipeThreshold)){
            				//user swiped up
            				self.initCustomKeyEvent(self.settings.swipeEvents.up);
            				}
            		
            				touches = {
            					"touchstartX": -1,
            					"touchstartY": -1,
            					"touchmoveX": -1,
            					"touchmoveY": -1
            				};
            			}
            			break;
            			default:
            			break;
            		}
		        });
			}
			
			$(window).resize(function(){ //if the window is resized...
				self.settings.calculatedSwipeThreshold = self.container.width() * (self.settings.swipeThreshold / 100); //recalculate the swipe threshold
			});
			//END EVENTS
		}
	} //END CONSTRUCTOR
	
	Sequence.prototype = {
		preloaderFallback: function(){ //if transitions aren't supported, call this fallback to show the default preloading animations
			var self = this, i = 0;
			function preload(){
				i = (i === 1) ? 0 : 1;
				$(".sequence-preloader img:nth-child(1)").animate({"opacity": i}, 100);
				$(".sequence-preloader img:nth-child(2)").animate({"opacity": i}, 350);
				$(".sequence-preloader img:nth-child(3)").animate({"opacity": i}, 600);
			}
			preload();
			self.defaultPreloader = setInterval(function(){
				preload();
			}, 600);
		},
		
		initCustomKeyEvent: function(event){ //trigger keyEvents, customKeyEvents and swipeEvents
			var self = this;
			switch(event){
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
		
		modifyElements: function($elementToReset, cssValue){
			var self = this;
				$elementToReset.css(
				self.prefixCSS(self.prefix, {
					"transition-duration": cssValue,
					"transition-delay": cssValue
				})
			);
		},
		
		//adds the browser vendors prefix onto multiple CSS properties
		prefixCSS: function(prefix, properties){
			var css = {};
			for(property in properties){
				css[prefix + property] = properties[property];
			}
			return css;
		},
		
		setTransitionProperties: function(frameChildren){
			var self = this;
			self.modifyElements(self.frameChildren, "");
			self.frameChildren.each(function(){
				self.transitionProperties["transition-duration"] = $(this).css(self.prefix + "transition-duration");
				self.transitionProperties["transition-delay"] = $(this).css(self.prefix + "transition-delay");

				$(this).css(
					self.prefixCSS(self.prefix, self.transitionProperties)
				);
			});
		},

		//start autoPlay after a specified delay
		startAutoPlay: function(delay){
			var self = this;
			if(self.settings.autoPlay && !self.isPaused){ //if using autoPlay and Sequence isn't paused...
				self.stopAutoPlay(); //stop autoPlay before starting it again
				self.autoPlayTimer = setTimeout(function(){ //start a new autoPlay timer and...
					self.settings.autoPlayDirection === 1 ? self.next(): self.prev(); //go to either the next or previous frame
				}, delay); //after a specified delay
			}
		},
		
		//stop causing Sequence to automatically change frame every x amount of seconds
		stopAutoPlay: function(){
			var self = this;
			clearTimeout(self.autoPlayTimer);
		},

		/*
		Toggle startAutoPlay (unpausing autoPlay) and stopAutoPlay (pausing autoPlay)

		hardPause: if true, Sequence's pauseOnHover will not execute. Useful for pause buttons.

		Note: Sequence 0.7.3 and below didn't have an .unpause() function -- .pause() would pause/unpause
		based on the current state. .unpause() is now included for clarity but the .pause() function will
		still toggle between paused and unpaused states.
		*/
		pause: function(hardPause){
			var self = this;
			if(!self.isPaused){ //if pausing Sequence...
				if(self.settings.pauseButton !== undefined){ //if a pause button is defined...
					self.settings.pauseButton.addClass("paused"); //add the class of "paused" to the pause button
					if(self.settings.pauseIcon !== undefined){ //if a pause icon is defined...
						self.settings.pauseIcon.show(); //show the pause icon
					}
				}
				self.paused(); //callback when Sequence is paused
				self.isPaused = true;
				self.isHardPaused = (hardPause) ? true : false; //if hardPausing, set hardPause to true
				self.stopAutoPlay();
			}else{ //if unpausing Sequence...
				self.unpause();
			}
		},

		//Start the autoPlay feature, as well as deal with any changes to pauseButtons, pauseIcons and public variables etc
		unpause: function(hardPause) {
			var self = this;
			if(self.settings.pauseButton !== undefined){ //if a pause button is defined...
				self.settings.pauseButton.removeClass("paused"); //remove the class of "paused" from the pause button
				if(self.settings.pauseIcon !== undefined){ //if a pause icon is defined...
					self.settings.pauseIcon.hide(); //hide the pause icon
				}
			}
			self.unpaused(); //callback when Sequence is unpaused
			self.isPaused = false;
			self.isHardPaused = false;
			self.startAutoPlay(self.settings.unpauseDelay); //start autoPlay after a delay specified via the unpauseDelay setting
		},
		
		//Go to the frame ahead of the current one
		next: function(){
			var self = this;
			if(!self.active && (self.settings.cycle || (!self.settings.cycle && self.currentFrameID !== self.numberOfFrames))){
				self.nextFrameID = (self.currentFrameID !== self.numberOfFrames) ? self.currentFrameID + 1 : 1; //work out the next frame
				self.goTo(self.nextFrameID, 1); //go to the next frame
			}
		},
		
		//Go to the frame prior to the current one
		prev: function(){
			var self = this;
			if(!self.active && (self.settings.cycle || (!self.settings.cycle && self.currentFrameID !== 1))){
				self.nextFrameID = (self.currentFrameID === 1) ? self.numberOfFrames : self.currentFrameID - 1; //work out the prev frame
				self.goTo(self.nextFrameID, -1); //go to the prev frame
			}
		},
		
		/*
		Go to a specific frame
		
		id: number of the frame to go to
		direction: direction to get to that frame (1 = forward, -1 = reverse)
		*/
		goTo: function(id, direction){	
			var self = this;
			id = parseFloat(id); //convert the id to a number just in case
			if(id === self.numberOfFrames){
				self.beforeLastFrameAnimatesIn();
			}else if(id === 1){
				self.beforeFirstFrameAnimatesIn();
			}

			if(id === self.currentFrameID){ //if the user is trying to go to the frame that is already active...
				return false; //don't go to that frame
			}else if(!self.active){ //if there are no animations running...
				self.active = true;
				self.currentFrame = self.sequence.children(".current-frame"); //find which frame is active
				self.nextFrame = self.sequence.children("li:nth-child("+id+")"); //grab the next frame
				
				if(direction === undefined){ //if no direction is specified...
					self.direction = (id > self.currentFrameID) ? 1 : -1; //work out which way to go based on what frame is currently active
				}else{
					self.direction = direction;
				}
								
				self.frameChildren = self.currentFrame.children(); //save the child elements
				self.nextFrameChildren = self.nextFrame.children(); //save the child elements
				
				if(self.transitionsSupported){ //if the browser supports CSS3 transitions...
					if(self.currentFrame.length !== 0){
						self.beforeCurrentFrameAnimatesOut();
						self.animateOut(self.direction);
					}
															
					if(!self.firstFrame){ //if this isn't the first frame to be shown...
						switch(self.settings.transitionThreshold){
							case true:
								self.waitForAnimationsToComplete(self.currentFrame, self.frameChildren, "out"); //wait for the current frame to stop animating out
								break;
							
							case false:
								self.animateIn(self.direction); //cause the next frame to animate in
								break;
							
							default:
								setTimeout(function(){ //cause the next frame to animate in after a certain period
									self.animateIn(self.direction);
								}, self.settings.transitionThreshold);
								break;
						}
					}else{ //if this is the first frame to be shown...
						self.animateIn(self.direction); //cause the next frame to animate in
						self.firstFrame = false; //no longer the first frame
					}
				}else{ //if the browser doesn't support CSS3 transitions...
					function animationComplete() {
			    		self.currentFrame = self.nextFrame;				                
			            self.setHashTag();	                
			            self.currentFrameID = self.currentFrame.index() + 1;
			            self.active = false;
			            self.startAutoPlay(self.settings.autoPlayDelay);
				    }

				    self.beforeCurrentFrameAnimatesOut(); //callback	

				    switch(self.settings.fallback.theme) {
				    	case "fade": //if using the fade fallback theme...
				            self.sequence.children("li").css({"position": "relative"}); //this allows for fadein/out in IE
				            self.currentFrame.animate({"opacity": 0}, self.settings.fallback.speed, function(){ //hide the current frame
				            	self.currentFrame.css({"display": "none", "z-index": "1"});
				            	self.currentFrame.removeClass("current-frame");
				            	self.beforeNextFrameAnimatesIn();
				            	self.nextFrame.addClass("current-frame").css({"display": "block", "z-index": self.numberOfFrames}).animate({"opacity": 1}, 500, function(){
				            		self.afterNextFrameAnimatesIn();
				            	}); //make the next frame the current one and show it
				            	animationComplete();
				            });
				            
				            self.sequence.children("li").css({"position": "relative"}); //this allows for fadein/out in IE
				        break;

				        case "slide": //if using the slide fallback theme...
				        default:
                            //create objects which will save the .css() and .animation() objects
				            var animateOut = {};
				            var animateIn = {};
				            var moveIn = {};
				            				            
				            //construct the .css() and .animation() objects
				            if(self.direction === 1){
				                animateOut["left"] = "-100%";
				                animateIn["left"] = "100%";
				            }else{
				                animateOut["left"] = "100%";
				                animateIn["left"] = "-100%";
				            }
				            
				            moveIn["left"] = "0%";
				            moveIn["opacity"] = 1;
				            
				            self.currentFrame.removeClass("current-frame").animate(animateOut, self.settings.fallback.speed); //cause the current frame to animate out
				            self.beforeNextFrameAnimatesIn(); //callback
				            self.nextFrame.addClass("current-frame").show().css(animateIn).animate(moveIn, self.settings.fallback.speed, function(){ //cause the next frame to animate in
				                animationComplete();
				                self.afterNextFrameAnimatesIn();
				            });				            
				        break;
				    }
				}
			}
		},
		
		//cause an active frame to animate out
		animateOut: function(direction){
			var self = this;
			if(self.settings.moveActiveFrameToTop){
			    self.currentFrame.css("z-index", 1);
			}
			
		    self.currentFrame.removeClass("current-frame");
			
			self.nextFrame.addClass("next-frame")
			if(!self.settings.reverseAnimationsWhenNavigatingBackwards || direction === 1){ //if user hit next button...
				//reset the position of the next frames elements ready for animating in again
				self.modifyElements(self.nextFrameChildren, "0s");
				self.nextFrameChildren.removeClass("animate-out");
				
				//make the current frames elements animate out
				self.modifyElements(self.frameChildren, "");				
				self.frameChildren.addClass("animate-out").removeClass("animate-in");
			}
			
			if(self.settings.reverseAnimationsWhenNavigatingBackwards && direction === -1){ //if the user hit prev button
				self.modifyElements(self.nextFrameChildren, "0s");
				self.nextFrameChildren.addClass("animate-out");
				self.setTransitionProperties(self.frameChildren);
				self.frameChildren.removeClass("animate-in");
			}
			
			if(self.settings.transitionThreshold === true){
				self.waitForAnimationsToComplete(self.currentFrame, self.currentFrame.children(), "out", true);
			}
		},
		
		//case the next frame to animate in
		animateIn: function(direction){
			var self = this;
			self.active = true;

			self.currentFrame.unbind(self.transitionEnd); //remove the animation end event
			self.currentFrame = self.nextFrame; //the next frame is now the current one

			if(direction === 1){
				self.currentFrameID = (self.currentFrameID !== self.numberOfFrames) ? self.currentFrameID + 1 : 1;
			}else{
				self.currentFrameID = (self.currentFrameID !== 1) ? self.currentFrameID - 1 : self.numberOfFrames;
			}

			self.nextFrameChildren = self.nextFrame.children(); //save the child elements
			self.frameChildren = self.currentFrame.children(); //save the child elements (the ones we'll animate) in an array
			
			self.beforeNextFrameAnimatesIn();
			if(self.settings.moveActiveFrameToTop){
			    self.nextFrame.css({"z-index": self.numberOfFrames});
			}
							
			if(!self.settings.reverseAnimationsWhenNavigatingBackwards || direction === 1){ //if user hit next button...
				setTimeout(function(){					
					self.modifyElements(self.frameChildren, "");
					self.frameChildren.addClass("animate-in");
					self.waitForAnimationsToComplete(self.nextFrame, self.nextFrameChildren, "in");
					if(self.settings.transitionThreshold !== true && self.afterCurrentFrameAnimatesOut !== "function () {}"){
						self.waitForAnimationsToComplete(self.currentFrame, self.currentFrame.children(), "out");
					}
				}, 50);
			}else if(self.settings.reverseAnimationsWhenNavigatingBackwards && direction === -1){ //if the user hit prev button
				setTimeout(function(){
					self.setTransitionProperties(self.frameChildren);
					self.frameChildren.addClass("animate-in").removeClass("animate-out");
					self.waitForAnimationsToComplete(self.nextFrame, self.nextFrameChildren, "in");
					if(self.settings.transitionThreshold !== true && self.afterCurrentFrameAnimatesOut != "function () {}"){
						self.waitForAnimationsToComplete(self.currentFrame, self.currentFrame.children(), "out");
					}
				}, 50);
			}
		},
		
		/*
			initiates functionality once a frame has finished animating
			frame: the frame <li> which is animating
			frameChildren: the animated direct child elements of the frame
			direction: whether the elements are animating in to an active position or out of an active position
			inAfterwards: whether a frame will animate in once another has finished animating out
		*/
		waitForAnimationsToComplete: function(frame, frameChildren, direction, inAfterwards){
			var self = this;
			if(direction === "out"){
				//animate out complete
				var onceComplete = function(){
					self.active = false;
					frame.unbind(self.transitionEnd);
					self.afterCurrentFrameAnimatesOut();

					if(inAfterwards === true){
						self.animateIn(self.direction);	
					}		
				};
			}else if(direction === "in"){
				//animate in complete
				var onceComplete = function(){
					frame.unbind(self.transitionEnd);
					self.afterNextFrameAnimatesIn();
					self.setHashTag();
					self.currentFrameID = self.currentFrame.index() + 1;
					
					if(self.currentFrameID === self.numberOfFrames){
						self.afterLastFrameAnimatesIn();
					}else if(self.currentFrameID === 1){
						self.afterFirstFrameAnimatesIn();
					}
					
					self.nextFrame.removeClass("next-frame").addClass("current-frame");
					self.active = false;
					if(!self.isHardPaused) {
						self.startAutoPlay(self.settings.autoPlayDelay);
					}
				};
			}
		
			frameChildren.each(function(){
				$(this).data('animationEnded', false); // set the data attribute to indicate that the elements animation has not yet ended
			});
	
			self.currentFrame.bind(self.transitionEnd, function(e){
				$(e.target).data('animationEnded', true); // this element has finished it's animation
			
				// now check if all elements have finished animating
				var allAnimationsEnded = true;
					frameChildren.each(function(){
						if($(this).data('animationEnded') === false){
							allAnimationsEnded = false;
						}
					});
			
				if(allAnimationsEnded){
					onceComplete();
				}
			});
		},

		setHashTag: function() {
			var self = this;
			if(self.settings.hashTags){ //if hashTags is enabled...
			    self.currentHashTag = self.currentFrame.attr(self.getHashTagFrom); //get the hashtag name
			    self.frameHashIndex = $.inArray(self.currentHashTag, self.frameHashID); //get the index of the frame that matches the hashtag
			    //if the hashtag matches a Sequence frame ID...
			    if(self.frameHashIndex !== -1 && (self.settings.hashChangesOnFirstFrame || !self.firstFrame)){
			        self.nextFrameID = self.frameHashIndex + 1;
                    document.location.hash = "#"+self.currentHashTag;
			    }else{
			        self.nextFrameID = self.settings.startingFrameID;
			        self.firstFrame = false;
			    }					    
			}
		}
	}; //END PROTOTYPE

	$.fn.sequence = function(options){
		var self = this;
		return self.each(function(){
			var sequence = new Sequence($(this), options, defaults, get);
			$(this).data("sequence", sequence); 
		});
	};
	
	//some external functions
	var get = {
		/* Modernizr 2.6.1 (Custom Build) | MIT & BSD
		 * Build: http://modernizr.com/download/#-svg-prefixed-testprop-testallprops-domprefixes
		 */
		modernizr: function(){
		
		;window.Modernizr=function(a,b,c){function x(a){i.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.1",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={svg:"http://www.w3.org/2000/svg"},p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=self;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(self instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.svg=function(){return!!b.createElementNS&&!!b.createElementNS(o.svg,"svg").createSVGRect};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return B([a])},e.testAllProps=D,e.prefixed=function(a,b,c){return b?D(a,b,c):D(a,"pfx")},e}(self,self.document);
		},
		
		defaultPreloader: function(prependTo, transitions, prefix){
			var icon = '<div class="sequence-preloader"><svg class="preloading" xmlns="http://www.w3.org/2000/svg"><circle class="circle" cx="6" cy="6" r="6" /><circle class="circle" cx="22" cy="6" r="6" /><circle class="circle" cx="38" cy="6" r="6" /></svg></div>';
			
			$("head").append("<style>.sequence-preloader{height: 100%;position: absolute;width: 100%;z-index: 999999;}@"+prefix+"keyframes preload{0%{opacity: 1;}50%{opacity: 0;}100%{opacity: 1;}}.sequence-preloader .preloading .circle{fill: #ff9442;display: inline-block;height: 12px;position: relative;top: -50%;width: 12px;"+prefix+"animation: preload 1s infinite; animation: preload 1s infinite;}.preloading{display:block;height: 12px;margin: 0 auto;top: 50%;margin-top:-6px;position: relative;width: 48px;}.sequence-preloader .preloading .circle:nth-child(2){"+prefix+"animation-delay: .15s; animation-delay: .15s;}.sequence-preloader .preloading .circle:nth-child(3){"+prefix+"animation-delay: .3s; animation-delay: .3s;}.preloading-complete{opacity: 0;visibility: hidden;"+prefix+"transition-duration: 1s; transition-duration: 1s;}div.inline{background-color: #ff9442; margin-right: 4px; float: left;}</style>");
			prependTo.prepend(icon);
			if(!Modernizr.svg && !transitions){ //if SVG isn't supported, remain calm and add this fallback instead...
			    $(".sequence-preloader").prepend('<div class="preloading"><div class="circle inline"></div><div class="circle inline"></div><div class="circle inline"></div></div>');
			    setInterval(function(){
			        $(".sequence-preloader .circle").fadeToggle(500);
			    }, 500);
			}else if(!transitions){ //if transitions aren't supported, toggle the opacity instead  
			    setInterval(function(){
			        $(".sequence-preloader").fadeToggle(500);
			    }, 500);
			}
		},
		
		//a quick test to work out if Opera supports transitions properly (to work around the fact that Opera 11 supports transitions but doesn't return a transition value properly)
		operaTest: function(){
		    $("body").append('<span id="sequence-opera-test"></span>');
		    var $operaTest = $("#sequence-opera-test");
		    $operaTest.css("-o-transition", "1s");
		    //if the expected value isn't returned...
		    if($operaTest.css("-o-transition") != "1s"){
		        //cause Opera to go into the fallback theme
		        return false;
		    }else{
		        return true;
		    }
		    $operaTest.remove();
		}
	};
	
	var defaults = {
		//General Settings
		startingFrameID: 1, //The frame (the list item `<li>`) that should first be displayed when Sequence loads
		cycle: true, //Whether Sequence should navigate to the first frame after the last frame and vice versa
		animateStartingFrameIn: false, //Whether the first frame should animate in to its active position
		transitionThreshold: 1000, //Whether there should be a delay between a frame animating out and the next animating in
		reverseAnimationsWhenNavigatingBackwards: true, //Whether animations should be reversed when a user navigates backwards by clicking a previous button/swiping/pressing the left key
		moveActiveFrameToTop: true, //Whether a frame should be given a higher `z-index` than other frames whilst it is active, to bring it above the others
		
		//Autoplay Settings
		autoPlay: true,
		autoPlayDirection: 1,
		autoPlayDelay: 5000,
		
		//Next/Prev Button Settings
		nextButton: false, //if dev settings are true, the nextButton will be ".next"
		showNextButtonOnInit: true,
		prevButton: false, //if dev settings are true, the prevButton will be ".prev"
		showPrevButtonOnInit: true,
		
		//Pause Settings
		pauseButton: false, //if dev settings are true, the pauseButton will be ".pause"
		unpauseDelay: null, //the time to wait before navigating to the next frame when Sequence is unpaused. Note that if an unpauseDelay is not specified, the default is the same as the autoPlayDelay setting
		pauseOnHover: true,
		pauseIcon: false, //this is an indicator to show Sequence is paused
		
		//Preloader Settings
		preloader: true,
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
		swipeThreshold: 15,
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
		hashChangesOnFirstFrame: false,	
        		
		//Fallback Theme Settings (For browsers that don't support CSS3 transitions)
		fallback: {
			theme: "slide",
			speed: 500
		}
	};
})(jQuery);