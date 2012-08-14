/*
Sequence.js (www.sequencejs.com)
Version: 0.6.9 Beta
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
		'OTransition'      : 'oTransitionEnd oAnimationEnd otransitionend oanimationend',
		'msTransition'     : 'MSTransitionEnd MSAnimationEnd',
		'transition'       : 'transitionend animationend'
		};
		
		self.prefix = prefixes[Modernizr.prefixed('transition')],
		self.transitionEnd = transitions[Modernizr.prefixed('transition')],
		self.transitionProperties = {},
		self.numberOfFrames = self.sequence.children("li").length,
		self.transitionsSupported = (self.prefix !== undefined) ? true : false, //determine if transitions are supported
		self.hasTouch = ("ontouchstart" in window) ? true : false, //determine if this is a touch enabled device
		self.sequenceTimer,
		self.paused = false,
		self.hoverEvent,
		self.defaultPreloader,
		self.init = {
			preloader: function(optionPreloader){
				self.prependTo = (self.settings.prependPreloader == true) ? self.container : self.settings.prependPreloader;
				
				switch(optionPreloader){
					case true:
					case undefined:
						get.defaultPreloader(self.prependTo, self.transitionsSupported, self.prefix);
						if(!self.transitionsSupported || self.prefix === "-o-"){
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
						return $(defaultOption);

					default:
						return $(devOption);
				}
			},
			
			CSSSelectorToHTML: function(selector){
				switch(selector.charAt(0)){
					case ".":
						return 'class="'+selector.split(".")[1]+'"';
					
					case "#":
						return 'id="'+selector.split("#")[1]+'"';
					
					default:
						return selector;
				}
			}
		},
		
		//INIT
		self.settings = $.extend({}, defaults, options),
		self.settings.preloader = self.init.preloader(self.settings.preloader);
		self.firstFrame = (self.settings.animateStartingFrameIn) ? true : false;
		
		if(self.settings.hideFramesUntilPreloaded && self.settings.preloader){
		    self.sequence.children("li").hide();
		}

		self.sequence.children("li").children().removeClass("animate-in");
		
		$(window).bind("load", function(){
			self.settings.afterLoaded();
			if(self.settings.hideFramesUntilPreloaded && self.settings.preloader){
			    self.sequence.children("li").show();
			}
			if(self.settings.preloader){
				if(self.settings.hidePreloaderUsingCSS && self.transitionsSupported && self.prefix !== "-o-"){
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
			$(this).unbind("load");
		});
		
		function init(){
			$(self.settings.preloader).remove();
						
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
			}
						
			if(self.hasTouch){
				self.settings.calculatedSwipeThreshold = self.container.width() * (self.settings.swipeThreshold / 100);
			}
			
			self.nextFrameID = self.settings.startingFrameID;
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
					
					setTimeout(function(){
						self.modifyElements(self.currentFrameChildren, "");
					}, 100);
					
					if(self.settings.autoPlay){
						var autoPlaySequence = function(){self.autoPlaySequence();};
						clearTimeout(self.sequenceTimer);
						self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					}
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
    			self.settings.beforeNextFrameAnimatesIn();
    			self.settings.afterNextFrameAnimatesIn();
    			self.currentFrameChildren = self.currentFrame.children();
    			self.currentFrameID = self.settings.startingFrameID;			    			        
                self.sequence.children("li").children().addClass("animate-in");
                self.sequence.children(":not(li:nth-child("+self.settings.startingFrameID+"))").css({"display": "none", "opacity": 0});
                if(self.settings.autoPlay){
                	var autoPlaySequence = function(){self.autoPlaySequence();};
                	clearTimeout(self.sequenceTimer);
                	self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
                }			        			    
			}
			//END INIT
			//EVENTS
			if(self.settings.nextButton !== undefined){
				self.settings.nextButton.click(function(){
					self.next();
				});
			}
									
			if(self.settings.prevButton !== undefined){
				self.settings.prevButton.click(function(){
					self.prev();
				});
			}
						
			if(self.settings.pauseButton !== undefined){
				self.settings.pauseButton.click(function(){
					self.pause();
				});
			}
			
			if(self.settings.keyNavigation){
				var defaultKeys = {
					'left'	: 37,
					'right'	: 39
				};
				
				$(document).keydown(function(e){
					function keyEvents(keyPressed, keyDirections){
						var keyCode;
						for(keyCodes in keyDirections){
							if(keyCodes === "left" || keyCodes === "right"){
								keyCode = defaultKeys[keyCodes];
							}else{
								keyCode = keyCodes;
							}
							if(keyPressed === keyCode){
								self.initCustomKeyEvent(keyDirections[keyCodes]);
							}
						}
					}
					
					//if numeric keys should go to a specific frame...
					var char = parseFloat(String.fromCharCode(e.keyCode));
					if((char > 0 && char <= self.numberOfFrames) && (self.settings.numericKeysGoToFrames)){
						self.nextFrameID = char;
						self.goTo(char); //go to specified frame
					}
					
					keyEvents(e.keyCode, self.settings.keyEvents); //run default keyevents
					keyEvents(e.keyCode, self.settings.customKeyEvents); //run custom keyevents
				});
			}
			
			function hoverDetect(e){
				self.containerLeft = self.container.position().left;
				self.containerRight = (self.containerLeft + self.container.width());
				self.containerTop = self.container.position().top;
				self.containerBottom = (self.containerTop + self.container.height());
				var pageX = e.pageX;
				var pageY = e.pageY;
				if(pageX >= self.containerLeft && pageX <= self.containerRight && pageY >= self.containerTop && pageY <= self.containerBottom){
					self.settings.autoPlay = false;
					clearTimeout(self.sequenceTimer);
					$(self.settings.pauseIcon).show();
					if(self.settings.pauseButton !== undefined){
						self.settings.pauseButton.addClass("paused");
					}
					self.settings.paused();
					self.sequence.unbind("mousemove");
				}
			}
						
			if(self.settings.pauseOnHover && !self.settings.pauseOnElementsOutsideContainer && self.settings.autoPlay){
				
				self.hoverEvent = self.sequence.mousemove(function(e){
					hoverDetect(e);
				});
				
				self.sequence.mouseleave(function(e){
						self.settings.autoPlay = true;
						var autoPlaySequence = function(){self.autoPlaySequence();};
						clearTimeout(self.sequenceTimer);
						self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
						$(self.settings.pauseIcon).hide();
						if(self.settings.pauseButton !== undefined){
							self.settings.pauseButton.removeClass("paused");
						}
						self.settings.unpaused();
						
						if(self.sequence.data("events").mousemove === undefined){
							self.sequence.mousemove(function(e){
								hoverDetect(e);
							});
						}
				});
			}else if(self.settings.pauseOnHover && self.settings.autoPlay){
				self.hoverEvent = self.sequence.hover(function(e){
					self.settings.autoPlay = false;
					clearTimeout(self.sequenceTimer);
					$(self.settings.pauseIcon).show();
					if(self.settings.pauseButton !== undefined){
						self.settings.pauseButton.addClass("paused");
					}
					self.settings.paused();
				}, function(){
					self.settings.autoPlay = true;
					var autoPlaySequence = function(){self.autoPlaySequence();};
					clearTimeout(self.sequenceTimer);
					self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					$(self.settings.pauseIcon).hide();
					if(self.settings.pauseButton !== undefined){
						self.settings.pauseButton.removeClass("paused");
					}
					self.settings.unpaused();
				});
			}
			
			if(self.settings.swipeNavigation && self.hasTouch){
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
					self.pause();
					break;
			}
		},
		
		autoPlaySequence: function(direction){
			var self = this;
			if(self.settings.autoPlayDirection === 1){
				self.next();
			}else{
				self.prev();
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
		
		//Opera workaround: currently Opera has a bug that prevents retrieving a prefixed CSS property from the DOM, meaning we have to search through the CSS file instead. It's not ideal in terms of performance but hopefully it'll be fixed in the future
		getStyleBySelector: function(selector){
			var css = {};
			var sheetList = document.styleSheets, ruleList, i, j;
			for(i = sheetList.length - 1; i >= 0; i--){
				var error = false;
				try{
					ruleList = sheetList[i].cssRules;
				}
				catch(e){
					error = true;
				}
				if(!error){
					for(j = 0; j < ruleList.length; j++){
						if(ruleList[j].type === CSSRule.STYLE_RULE && ruleList[j].selectorText === selector){
							css["-o-transition-duration"] = ruleList[j].style.OTransitionDuration;
							css["-o-transition-delay"] = ruleList[j].style.OTransitionDelay;
							return css;
						}
					}
				}
			}
			return null;
		},
		
		setTransitionProperties: function(frameChildren){
			var self = this;
			self.modifyElements(self.frameChildren, "");
			self.frameChildren.each(function(){
				if(self.prefix === "-o-"){
					var selector = "." + $(this).attr("class").replace(" ", ".");
					var previousFrameTransitionProperties = self.getStyleBySelector(selector);
					self.transitionProperties["transition-duration"] = previousFrameTransitionProperties["-o-transition-duration"];
					self.transitionProperties["transition-delay"] = previousFrameTransitionProperties["-o-transition-delay"];
					self.transitionProperties["transition-delay"] = (self.transitionProperties["transition-delay"] === "") ? "0s" : self.transitionProperties["transition-delay"];
				}else{
					self.transitionProperties["transition-duration"] = $(this).css(self.prefix + "transition-duration");
					self.transitionProperties["transition-delay"] = $(this).css(self.prefix + "transition-delay");
				}

				$(this).css(
					self.prefixCSS(self.prefix, self.transitionProperties)
				);
			});
		},
		
		//toggle start/stopAutoPlay
		pause: function(){
			var self = this;
			if(self.settings.autoPlay){ //pause Sequence
				if(self.settings.pauseButton !== undefined){
					self.settings.pauseButton.addClass("paused");
					self.settings.pauseIcon.show();
				}
				self.settings.paused();
				self.stopAutoPlay();
			}else{ //start autoPlay
				if(self.settings.pauseButton !== undefined){
					self.settings.pauseButton.removeClass("paused");
					self.settings.pauseIcon.hide();
				}
				self.settings.unpaused();
				self.startAutoPlay(self.settings.unpauseDelay);
			}
		},
		
		//start Sequence causing frames to change every x amount of seconds
		startAutoPlay: function(wait, newAutoPlayDelay){
			var self = this;
			wait = (wait === undefined) ? 0 : wait;
			self.settings.autoPlayDelay = (newAutoPlayDelay === undefined) ? self.settings.autoPlayDelay : newAutoPlayDelay;
			self.settings.autoPlay = true;
			var autoPlaySequence = function(){self.autoPlaySequence();};
			clearTimeout(self.sequenceTimer);
			self.sequenceTimer = setTimeout(autoPlaySequence, wait, self);
			if(self.settings.pauseOnHover){
				self.hoverEvent = self.sequence.hover(function(){
					self.settings.autoPlay = false;
					clearTimeout(self.sequenceTimer);
					$(self.settings.pauseIcon).show();
					if(self.settings.pauseButton !== undefined){
						self.settings.pauseButton.addClass("paused");
					}
					self.settings.paused();
				}, function(){
					self.settings.autoPlay = true;
					var autoPlaySequence = function(){self.autoPlaySequence();};
					clearTimeout(self.sequenceTimer);
					self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					$(self.settings.pauseIcon).hide();
					if(self.settings.pauseButton !== undefined){
						self.settings.pauseButton.removeClass("paused");
					}
					self.settings.unpaused();
				});
			}
		},
		
		//stop causing Sequence to automatically change frame every x amount of seconds
		stopAutoPlay: function(){
			var self = this;
			self.settings.autoPlay = false;
			clearTimeout(self.sequenceTimer);
			if(self.hoverEvent !== undefined){
				self.hoverEvent.unbind();
			}
		},
		
		//go to the frame ahead of the current one
		next: function(){
			var self = this;
			
			if(!self.active){
				if(self.settings.cycle || (!self.settings.cycle && self.currentFrameID !== self.numberOfFrames)){
					if(self.paused){
						self.paused = false;
						self.startAutoPlay();
					}
					
					self.nextFrameID = (self.currentFrameID !== self.numberOfFrames) ? self.currentFrameID + 1 : 1;
					self.goTo(self.nextFrameID, 1); //go to the next frame
				}else if(self.settings.autoPlayDirection === 1){
					self.paused = true;
					self.stopAutoPlay();
				}
			}
		},
		
		//go to the frame prior to the current one
		prev: function(){
			var self = this;
			if(!self.active){
				if(self.settings.cycle || (!self.settings.cycle && self.currentFrameID !== 1)){
					if(self.paused){
						self.paused = false;
						self.startAutoPlay();
					}
					self.nextFrameID = (self.currentFrameID === 1) ? self.numberOfFrames : self.currentFrameID - 1;
					
					self.goTo(self.nextFrameID, -1); //go to the prev frame
				}else if(self.settings.autoPlayDirection === -1){
					self.paused = true;
					self.stopAutoPlay();
				}
			}
		},
		
		//go to a specific frame
		goTo: function(id, direction){
			var self = this;
			if(id === self.numberOfFrames){
				self.settings.beforeLastFrameAnimatesIn();
			}else if(id === 1){
				self.settings.beforeFirstFrameAnimatesIn();
			}
									
			if(self.currentFrame !== undefined && id === self.currentFrame.index() + 1){ //if the user is trying to go to the frame that is already active...
				return false; //...don't go to that frame
			}else if(!self.active){ //if there are no animations running...
				self.active = true; //set the sequence as active
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
						self.settings.beforeCurrentFrameAnimatesOut();
						self.animateOut(self.direction);
					}

					var animateIn = function(){
						self.animateIn(self.direction);
						self.currentFrameID = id;
					};
										
					if(!self.firstFrame){
						switch(self.settings.transitionThreshold){
							case true:
								self.waitForAnimationsToComplete(self.currentFrame, self.frameChildren, "out");
								break;
							
							case false:
								animateIn();
								break;
							
							default:
								setTimeout(animateIn, self.settings.transitionThreshold);
								break;
						}
					}else{					
						animateIn();
						self.firstFrame = false;
					}
				}else{ //if the browser doesn't support CSS3 transitions...				    
				    switch(self.settings.fallback.theme){
				        //run the slide fallback theme
				        case "slide":
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
				            
				            self.settings.beforeCurrentFrameAnimatesOut();
				            self.currentFrame.removeClass("current-frame").animate(animateOut, self.settings.fallback.speed, function(){
				            });
				            
				            self.settings.beforeNextFrameAnimatesIn();
				            self.nextFrame.addClass("current-frame").show().css(animateIn).animate(moveIn, self.settings.fallback.speed, function(){
				                self.settings.afterNextFrameAnimatesIn();
				                self.currentFrame = self.nextFrame;
				                self.currentFrameID = self.currentFrame.index() + 1;
				                self.active = false;
				                if(self.settings.autoPlay){
				                	var autoPlaySequence = function(){self.autoPlaySequence();};
				                	clearTimeout(self.sequenceTimer);
				                	self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
				                }
				            });				            
				            
				            				            
				        break;
				        
				        //run the fade fallback theme
				        case "fade":
				        default:
				            self.sequence.children("li").css({"position": "relative"}); //this allows for fadein/out in IE
				            self.settings.beforeCurrentFrameAnimatesOut();
				            self.currentFrame.animate({"opacity": 0}, self.settings.fallback.speed, function(){ //hide the current frame
				            	self.currentFrame.css({"display": "none", "z-index": "1"});
				            	self.currentFrame.removeClass("current-frame");
				            	self.settings.beforeNextFrameAnimatesIn();
				            	self.nextFrame.addClass("current-frame").css({"display": "block", "z-index": self.numberOfFrames}).animate({"opacity": 1}, 500, function(){
				            		self.settings.afterNextFrameAnimatesIn();
				            	}); //make the next frame the current one and show it
				            	self.currentFrame = self.nextFrame;
				            	self.currentFrameID = self.currentFrame.index() + 1;
				            	self.active = false;
				            	if(self.settings.autoPlay){
				            		var autoPlaySequence = function(){self.autoPlaySequence();};
				            		clearTimeout(self.sequenceTimer);
				            		self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
				            	}
				            });
				            
				            self.sequence.children("li").css({"position": "relative"}); //this allows for fadein/out in IE
				        break;
				    }
				}
			}
		},
		
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
			
			if(self.settings.transitionThreshold){
				self.waitForAnimationsToComplete(self.currentFrame, self.currentFrame.children(), "out", true);
			}
		},
		
		animateIn: function(direction){
			var self = this;
			self.currentFrame.unbind(self.transitionEnd); //remove the animation end event
			self.currentFrame = self.nextFrame; //the next frame is now the current one
			
			if(direction === 1){
				self.currentFrameID = (self.currentFrameID !== self.numberOfFrames) ? self.currentFrameID + 1 : 1;
			}else{
				self.currentFrameID = (self.currentFrameID !== 1) ? self.currentFrameID - 1 : self.numberOfFrames;
			}

			self.nextFrameChildren = self.nextFrame.children(); //save the child elements
			self.frameChildren = self.currentFrame.children(); //save the child elements (the ones we'll animate) in an array
			
			self.settings.beforeNextFrameAnimatesIn();
			if(self.settings.moveActiveFrameToTop){
			    self.nextFrame.css({"z-index": self.numberOfFrames});
			}
							
			if(!self.settings.reverseAnimationsWhenNavigatingBackwards || direction === 1){ //if user hit next button...
			
				//reset the position of the next frames elements ready for animating in again
				//self.modifyElements(self.nextFrameChildren, "0s");
				//self.nextFrameChildren.removeClass("animate-out");
				
				setTimeout(function(){
					//self.frameChildren.removeClass("animate-out");
					
					self.modifyElements(self.frameChildren, "");
					self.frameChildren.addClass("animate-in");
					self.waitForAnimationsToComplete(self.nextFrame, self.nextFrameChildren, "in");
					if(self.settings.transitionThreshold !== true && self.settings.afterCurrentFrameAnimatesOut != "function () {}"){
						self.waitForAnimationsToComplete(self.currentFrame, self.currentFrame.children(), "out");
					}
				}, 50);
			}else if(self.settings.reverseAnimationsWhenNavigatingBackwards && direction === -1){ //if the user hit prev button
				setTimeout(function(){
					self.setTransitionProperties(self.frameChildren);
					self.frameChildren.addClass("animate-in").removeClass("animate-out");
					self.waitForAnimationsToComplete(self.nextFrame, self.nextFrameChildren, "in");
					if(self.settings.transitionThreshold !== true && self.settings.afterCurrentFrameAnimatesOut != "function () {}"){
						self.waitForAnimationsToComplete(self.currentFrame, self.currentFrame.children(), "out");
					}
				}, 50);
			}
		},
		
		waitForAnimationsToComplete: function(frame, elements, direction, inAfterwards){
			var self = this;
			if(direction === "out"){
				
				//animate out complete
				var onceComplete = function(){
					self.active = false;
					frame.unbind(self.transitionEnd);
					self.settings.afterCurrentFrameAnimatesOut();

					if(inAfterwards){
						self.animateIn(self.direction);	
					}		
				};
			}else if(direction === "in"){
				//animate in complete
				var onceComplete = function(){
					frame.unbind(self.transitionEnd);
					self.settings.afterNextFrameAnimatesIn();
					
					if(self.currentFrameID === self.numberOfFrames){
						self.settings.afterLastFrameAnimatesIn();
					}else if(self.currentFrameID === 1){
						self.settings.afterFirstFrameAnimatesIn();
					}
					
					self.nextFrame.removeClass("next-frame").addClass("current-frame");
					self.active = false;
		
					if(self.settings.autoPlay){
						var autoPlaySequence = function(){self.autoPlaySequence();};
						clearTimeout(self.sequenceTimer);
						self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					}				
				};
			
			}
		
			elements.each(function(){
				$(this).data('animationEnded', false); // set the data attribute to indicate that the elements animation has not yet ended
			});
	
			self.currentFrame.bind(self.transitionEnd, function(e){
				$(e.target).data('animationEnded', true); // this element has finished it's animation
			
				// now we'll check if all elements are finished animating
				var allAnimationsEnded = true;
					elements.each(function(){
						if($(this).data('animationEnded') === false){
							allAnimationsEnded = false;
						}
					});
			
				if(allAnimationsEnded){
					onceComplete();
				}
			});
		}
	}; //END PROTOTYPE

	$.fn.sequence = function(options){
		return this.each(function(){
			var sequence = new Sequence($(this), options, defaults, get);
			$(this).data("sequence", sequence); 
		});
	};
	
	//some external functions
	var get = {
		/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
		* Build: http://www.modernizr.com/download/#-prefixed-testprop-testallprops-domprefixes*/
		modernizr: function(){
		;window.Modernizr = function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(prefixes.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b){for(var d in a)if(i[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}function C(a,b,c){var d=a.charAt(0).toUpperCase()+a.substr(1),e=(a+" "+m.join(d+" ")+d).split(" ");return y(b,"string")||y(b,"undefined")?A(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),B(e,b,c))}var d="2.5.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={},p={},q={},r=[],s=r.slice,t,u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=self;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(self instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e});for(var D in o)v(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return w(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return A([a])},e.testAllProps=C,e.prefixed=function(a,b,c){return b?C(a,b,c):C(a,"pfx")},e}(self,self.document)
		},
		
		defaultPreloader: function(prependTo, transitions, prefix){
			var opacity = (transitions) ? 0 : 1;
			$("head").append("<style>.sequence-preloader{height: 100%;position: absolute;width: 100%;z-index: 999999;}@"+prefix+"keyframes preload{0%{opacity: 0;}50%{opacity: 1;}100%{opacity: 0;}}.sequence-preloader img{background: #ff9933;border-radius: 6px;display: inline-block;height: 12px;opacity: "+opacity+";position: relative;top: -50%;width: 12px;"+prefix+"animation: preload 1s infinite; animation: preload 1s infinite;}.preloading{height: 12px;margin: 0 auto;top: 50%;position: relative;width: 48px;}.sequence-preloader img:nth-child(2){"+prefix+"animation-delay: .15s; animation-delay: .15s;}.sequence-preloader img:nth-child(3){"+prefix+"animation-delay: .3s; animation-delay: .3s;}.preloading-complete{opacity: 0;visibility: hidden;"+prefix+"transition-duration: 1s; transition-duration: 1s;}</style>");
			$(prependTo).prepend('<div class="sequence-preloader"><div class="preloading"><img src="images/sequence-preloader.png" alt="Sequence is loading, please wait..." />    <img src="images/sequence-preloader.png" alt="Sequence is loading, please wait..." />    <img src="images/sequence-preloader.png" alt="Sequence is loading, please wait..." /></div></div>');
		}
	},
	
	defaults = {
		//General Settings
		startingFrameID: 1,
		cycle: true,
		animateStartingFrameIn: false,
		transitionThreshold: 1000,
		reverseAnimationsWhenNavigatingBackwards: true,
		moveActiveFrameToTop: true,
		
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
		unpauseDelay: 0, //the time to wait before navigating to the next frame when Sequence is unpaused from the pause button
		pauseOnHover: true,
		pauseIcon: false, //this is an indicator to show Sequence is paused
		pauseOnElementsOutsideContainer: false,
		
		//Preloader Settings
		preloader: true,
		prependPreloader: true,
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
		
		//Fallback Theme Settings (For browsers that don't support CSS3 transitions)
		fallback: {
			theme: "slide",
			mode: "horizontal",
			speed: 500
		},
		
		//Callbacks
		paused: function() {},							//triggers when Sequence is paused
		unpaused: function() {},							//triggers when Sequence is unpaused
		
		beforeNextFrameAnimatesIn: function() {},		//triggers before the next frame animates in
		afterNextFrameAnimatesIn: function() {},			//triggers after the next frame animates in
		beforeCurrentFrameAnimatesOut: function() {},	//triggers before the current frame animates out
		afterCurrentFrameAnimatesOut: function() {},		//triggers after the current frame animates out
		
		beforeFirstFrameAnimatesIn: function() {},		//triggers before the first frame animates in
		afterFirstFrameAnimatesIn: function() {},		//triggers after the first frame animates in
		beforeLastFrameAnimatesIn: function() {},		//triggers before the last frame animates in
		afterLastFrameAnimatesIn: function() {},			//triggers after the last frame animates in
		
		afterLoaded: function() {}						//triggers after Sequence is initiated
	};
})(jQuery);