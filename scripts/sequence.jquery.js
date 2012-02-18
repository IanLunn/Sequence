/*
Sequence.js (www.sequencejs.com)
Version: 0.1 Beta
Author: Ian Lunn @IanLunn
Author URL: http://www.ianlunn.co.uk/
Github: https://github.com/IanLunn/Sequence

This is a FREE script and is dual licensed under the following:
http://www.opensource.org/licenses/mit-license.php | http://www.gnu.org/licenses/gpl.html

Sequence.js and its dependencies are (c) Ian Lunn Design 2012 unless otherwise stated.
Aside from these comments, you may modify and distribute this file as you please. Have fun!
*/

/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-prefixed-testprop-testallprops-domprefixes
 */
;window.Modernizr=function(a,b,c){function z(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+m.join(c+" ")+c).split(" ");return y(d,b)}function y(a,b){for(var d in a)if(j[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function x(a,b){return!!~(""+a).indexOf(b)}function w(a,b){return typeof a===b}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function u(a){j.cssText=a}var d="2.0.6",e={},f=b.documentElement,g=b.head||b.getElementsByTagName("head")[0],h="modernizr",i=b.createElement(h),j=i.style,k,l=Object.prototype.toString,m="Webkit Moz O ms Khtml".split(" "),n={},o={},p={},q=[],r,s={}.hasOwnProperty,t;!w(s,c)&&!w(s.call,c)?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],c)};for(var A in n)t(n,A)&&(r=A.toLowerCase(),e[r]=n[A](),q.push((e[r]?"":"no-")+r));u(""),i=k=null,e._version=d,e._domPrefixes=m,e.testProp=function(a){return y([a])},e.testAllProps=z,e.prefixed=function(a){return z(a,"pfx")};return e}(this,this.document);

(function($){	
	function Sequence(element, options){
		//GLOBAL PARAMETERS
		this.container = $(element);
		this.sequence = this.container.children("ul");
		var self = this,
		prefixes = {
		    'WebkitTransition' : '-webkit-',
		    'MozTransition'    : '-moz-',
		    'OTransition'      : '-o-',
		    'msTransition'     : '-ms-',
		    'transition'       : ''
		},
		transitions = {
		    'WebkitTransition' : 'webkitTransitionEnd webkitAnimationEnd',
		    'MozTransition'    : 'transitionend animationend',
		    'OTransition'      : 'oTransitionEnd oAnimationEnd',
		    'msTransition'     : 'MSTransitionEnd MSAnimationEnd',
		    'transition'       : 'transitionend animationend'
		};
		this.prefix = prefixes[Modernizr.prefixed('transition')],
		this.transitionEnd = transitions[Modernizr.prefixed('transition')],
		this.transitionProperties = {},
		this.numberOfFrames = this.sequence.children("li").length,
		this.transitionsSupported = (this.prefix != undefined) ? true : false, //determine if transitions are supported
		this.hasTouch = ("ontouchstart" in window) ? true : false, //determine if this is a touch enabled device
		this.sequenceTimer,
		this.paused = false,
		this.hoverEvent;

		this.init = {
			navButtons: function(optionButton, direction){
				prependNextButtonTo = (self.settings.prependNextButton == true) ? self.container : self.settings.prependNextButton;
				prependPrevButtonTo = (self.settings.prependPrevButton == true) ? self.container : self.settings.prependPrevButton;
				
				switch(optionButton){
					case true: //set up default nav button
					case undefined:
						if(direction == ".next"){
							this.CSSSelectorToHTML($(prependNextButtonTo),  $.fn.sequence.defaults.nextButton);
						}else{
							this.CSSSelectorToHTML($(prependPrevButtonTo),  $.fn.sequence.defaults.prevButton);
						}			
					break;
					
					case false: //don't use a nav button
					break;
					
					default: //set up the dev defined button	
						if(direction == ".next"){
							this.CSSSelectorToHTML($(prependNextButtonTo),  optionButton);
							$(optionButton).show(); //this will most likely be removed in future versions
							return $(optionButton);
						}else{
							this.CSSSelectorToHTML($(prependPrevButtonTo),  optionButton);
							$(optionButton).show(); //this will most likely be removed in future versions
							return $(optionButton);
						}
					break;
				}
			},
			
			pauseIcon: function(pauseIcon, pauseIconSrc){
				prependPauseIconTo = (self.settings.prependPauseIcon == true) ? self.container : self.settings.prependPauseIcon;
				switch(pauseIcon){
					case true:
					case undefined:
						this.CSSSelectorToHTML($(prependPauseIconTo), $.fn.sequence.defaults.pauseIcon, pauseIconSrc);
						$($.fn.sequence.defaults.pauseIcon).hide();
						return $($.fn.sequence.defaults.pauseIcon);
					break;
					
					case false:
					break;
					
					default:
						this.CSSSelectorToHTML($(prependPauseIconTo), self.settings.pauseIcon, pauseIconSrc);
						$(self.settings.pauseIcon).hide();
						return $(self.settings.pauseIcon);
					break;
				}
			},
			
			CSSSelectorToHTML: function(prependTo, selector, pauseIconSrc){
				switch(selector.charAt(0)){
					case ".":
						buttonSelector = 'class="'+selector.split(".")[1]+'"';
						break;
					
					case "#":
						buttonSelector = 'id="'+selector.split("#")[1]+'"';
						break;
					
					default:
						buttonSelector = selector;
						break;
				}
				
				if(pauseIconSrc != undefined && (self.settings.pauseIcon != true || self.settings.pauseIcon != undefined)){				
					$(prependTo).prepend('<div '+buttonSelector+'><img src="'+pauseIconSrc+'" alt="Pause" /></div>');
				}else{
					$(prependTo).prepend('<div '+buttonSelector+'></div>');
				}
			},
		},		
		
		//INIT
		this.settings = $.extend({}, $.fn.sequence.defaults, options);
		this.sequence.children("li").children().removeClass("animate-in");
		this.settings.nextButton = this.init.navButtons(options.nextButton, $.fn.sequence.defaults.nextButton);
		this.settings.prevButton = this.init.navButtons(options.prevButton, $.fn.sequence.defaults.prevButton);
		this.settings.prependPauseIcon = (this.settings.prependPauseIcon != undefined) 
			? this.settings.prependPauseIcon 
			: this.container;
		if(this.hasTouch){
			this.settings.calculatedSwipeThreshold = self.container.width() * (this.settings.swipeThreshold / 100);
		}
		this.settings.pauseIcon = this.init.pauseIcon(this.settings.pauseIcon, this.settings.pauseIconSrc);
		
		this.currentFrame = this.sequence.children("li:nth-child("+this.settings.startingFrameID+")").addClass("current");	
		this.currentFrameChildren = this.currentFrame.children();
		this.currentFrameID = this.settings.startingFrameID;
		this.nextFrameID = this.currentFrameID;
		this.sequence.children("li").children().removeClass("animate-in");
		this.direction;
		
		this.sequence.css({"width": "100%", "height": "100%"}); //set the sequence list to 100% width/height just incase it hasn't been specified in the CSS
		
		if(this.transitionsSupported){ //initiate the full featured Sequence if transitions are supported...
			whenFirstAnimateInEnds = function(){
				animationComplete = function(){
					self.settings.afterNextFrameAnimatesIn();
					self.active = false;
					if(self.settings.autoPlay){
						autoPlaySequence = function(){self.autoPlaySequence()};
						clearTimeout(self.sequenceTimer);
						self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					}
				}
				self.waitForAnimationsToComplete(self.currentFrameChildren, animationComplete);
			}
						
			if(!this.settings.animateStartingFrameIn){ //start first frame in animated in position
				self.modifyElements(self.currentFrameChildren, "0s");
				self.currentFrameChildren.addClass("animate-in");
				
				setTimeout(function(){	
				self.modifyElements(self.currentFrameChildren, "");
				}, 100);
				
				if(self.settings.autoPlay){
					autoPlaySequence = function(){self.autoPlaySequence()};
					clearTimeout(self.sequenceTimer);
					self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
				}
			}else if(this.settings.autoPlayDirection -1 && this.settings.animateStartingFrameIn){
				this.active = true;		
				
				self.modifyElements(self.currentFrameChildren, "0s");
				self.currentFrameChildren.addClass("animate-out");				
				
				this.settings.beforeNextFrameAnimatesIn();
				
				setTimeout(function(){	
					self.modifyElements(self.currentFrameChildren, "");
					self.currentFrameChildren.removeClass("animate-out");
					self.currentFrameChildren.addClass("animate-in");
				}, 100);
				
				whenFirstAnimateInEnds();
			}else{
				this.active = true;	
				self.settings.beforeCurrentFrameAnimatesIn();
				setTimeout(function(){			
					self.modifyElements(self.currentFrameChildren, "");
					self.currentFrameChildren.addClass("animate-in");
				}, 100);
				
				whenFirstAnimateInEnds();
			}
		}else{ //initiate a basic slider for browsers that don't support CSS3 transitions
			this.sequence.children("li").children().addClass("animate-in");
			this.currentFrame.css("z-index", this.numberOfFrames);
			this.sequence.children(":not(li:nth-child("+this.settings.startingFrameID+"))").css({"display": "none", "opacity": 0});
			if(self.settings.autoPlay){
				autoPlaySequence = function(){self.autoPlaySequence()};
				clearTimeout(self.sequenceTimer);
				self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
			}
		}
		//END INIT
				
		//EVENTS
		if(this.settings.nextButton != undefined){
			this.settings.nextButton.click(function(){
				self.next();
			});
		}
		
		if(this.settings.prevButton != undefined){
			this.settings.prevButton.click(function(){
				self.prev();
			});
		}
		
		if(this.settings.keysNavigate){
			$(window).keydown(function(e){
				if(e.keyCode == 39){
					self.next();
				}
				if(e.keyCode == 37){
					self.prev();
				}
			});
		}
		if(this.settings.pauseOnHover && this.settings.autoPlay){
			this.hoverEvent = this.sequence.hover(function(){
				self.settings.autoPlay = false;
				clearTimeout(self.sequenceTimer);
				$(self.settings.pauseIcon).show();
			}, function(){
				self.settings.autoPlay = true;
				autoPlaySequence = function(){self.autoPlaySequence()};
				clearTimeout(self.sequenceTimer);
				self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
				$(self.settings.pauseIcon).hide();
			});
		}
		
		if(this.settings.touchEnabled && this.hasTouch){
			var touch,
				touches = {
					"touchstart": -1,
					"touchmove" : -1, 
					"swipeDirection" : ""
				};
			this.sequence.bind("touchstart touchmove touchend", function(e){
				e.preventDefault(); 
				switch(e.originalEvent.type){
					case "touchstart":
					case "touchmove":
						touches[e.originalEvent.type] = e.originalEvent.touches[0].pageX;
						break;
					case 'touchend':
						if(touches["touchstart"] > -1 && touches["touchmove"] > self.settings.calculatedSwipeThreshold){
							if(touches["touchstart"] < touches["touchmove"]){
								self.next();
							}else{
								self.prev();
							}
						}
					default:
						break;
				}
			});
		}
		$(window).resize(function(){ //if the window is resized...
			self.settings.calculatedSwipeThreshold = self.container.width() * (self.settings.swipeThreshold / 100); //recalculate the swipe threshold
		});
		//END EVENTS
	} //END CONSTRUCTOR
	
	Sequence.prototype = {
		autoPlaySequence: function(direction){
			var self = this;
			if(self.settings.autoPlayDirection == 1){
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
					"transition-delay": cssValue,
				})
			)
		},
		
		//adds the browser vendors prefix onto multiple CSS properties
		prefixCSS: function(prefix, properties){
			css = {};
			for(property in properties){
				css[prefix + property] = properties[property];
			}
			return css;
		},
		
		//Opera workaround: currently Opera has a bug that prevents retrieving a prefixed CSS property from the DOM, meaning we have to search through the CSS file instead. It's not ideal in terms of performance but hopefully it'll be fixed in the future
		getStyleBySelector: function(selector){
			css = {};
			var sheetList = document.styleSheets, ruleList, i, j;
			for(i = sheetList.length - 1; i >= 0; i--){
				error = false;
				try{
					ruleList = sheetList[i].cssRules;
				}
				catch(e){
					error = true;
				}
				if(!error){
					for(j = 0; j < ruleList.length; j++){
						if(ruleList[j].type == CSSRule.STYLE_RULE && ruleList[j].selectorText == selector){
							css["-o-transition-duration"] = ruleList[j].style.OTransitionDuration;
							css["-o-transition-delay"] = ruleList[j].style.OTransitionDelay;
							return css;
						}
					}
				}
			}
			return null;
		},
		
		startAutoPlay: function(wait, newAutoPlayDelay){
			var self = this;
			wait = (wait == undefined) ? 0 : wait;
			self.settings.autoPlayDelay = (newAutoPlayDelay == undefined) ? self.settings.autoPlayDelay : newAutoPlayDelay;
			self.settings.autoPlay = true;
			autoPlaySequence = function(){self.autoPlaySequence()};
			clearTimeout(self.sequenceTimer);
			self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
			if(self.settings.pauseOnHover){
				self.hoverEvent = self.sequence.hover(function(){
					self.settings.autoPlay = false;
					clearTimeout(self.sequenceTimer);
					$(self.settings.pauseIcon).show();
				}, function(){
					self.settings.autoPlay = true;
					autoPlaySequence = function(){self.autoPlaySequence()};
					clearTimeout(self.sequenceTimer);
					self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					$(self.settings.pauseIcon).hide();
				});
			}
		},
		
		stopAutoPlay: function(){
			var self = this;
			self.settings.autoPlay = false;
			clearTimeout(self.sequenceTimer);
			if(self.hoverEvent != undefined){
				self.hoverEvent.unbind();
			}
		},
		
		next: function(){
			var self = this;
			if(!self.active){
				if(self.settings.cycle || (!self.settings.cycle && self.currentFrame.index() + 1 != self.numberOfFrames)){
					if(self.paused){
						self.paused = false;
						self.startAutoPlay();
					}
					self.nextFrameID = (self.currentFrame.index() + 1 != self.numberOfFrames) ? self.currentFrameID + 1 : 1;
					self.goTo(self.nextFrameID, 1); //go to the next frame
				}else if(self.settings.autoPlayDirection == 1){
					self.paused = true;
					self.stopAutoPlay();
				}
			}
		},
		
		prev: function(){
			var self = this;
			if(!self.active){
				if(self.settings.cycle || (!self.settings.cycle && self.currentFrame.index() + 1 != 1)){
					if(self.paused){
						self.paused = false;
						self.startAutoPlay();
					}
					self.nextFrameID = (self.currentFrame.index() + 1 == 1) ? self.numberOfFrames : self.currentFrameID - 1;
					self.goTo(self.nextFrameID, -1); //go to the prev frame
				}else if(self.settings.autoPlayDirection == -1){
					self.paused = true;
					self.stopAutoPlay();
				}
			}
		},
		
		goTo: function(id, direction){ //where the magic happens
			var self = this;
			if(id == self.numberOfFrames){
				self.settings.beforeLastFrameAnimatesIn();
			}else if(id == 1){
				self.settings.beforeFirstFrameAnimatesIn();
			}
			if(id == self.currentFrame.index() + 1){
				return false;
			}else if(!self.active){ //if there are no animations running...
				self.active = true; //set the sequence as active
				self.currentFrame = self.sequence.children(".current"); //find which frame is active
				nextFrame = self.sequence.children("li:nth-child("+id+")"); //grab the next frame
				
				if(direction == undefined){ //if no direction is specified...
					self.direction = (id > self.currentFrameID) ? 1 : -1; //work out which way to go based on what frame is currently active
				}else{
					self.direction = direction;
				}
				
				frameChildren = self.currentFrame.children(); //save the child elements
				nextFrameChildren = nextFrame.children(); //save the child elements				
				
				if(self.transitionsSupported){ //if the browser supports CSS3 transitions...
					self.settings.beforeCurrentFrameAnimatesOut();		
					self.animateOut(self.direction);
					animateIn = function(){
						self.animateIn(self.direction);
						self.currentFrameID = id;
					}
						
					switch(self.settings.delayDuringOutInTransitions){
						case true:
							self.waitForAnimationsToComplete(frameChildren, animateIn);
							break;
						
						case false:
							animateIn();
							break;
						
						default:
							setTimeout(animateIn, self.settings.delayDuringOutInTransitions);
							break;
					}
				}else{ //if the browser doesn't support CSS3 transitions...
					self.sequence.children("li").css({"position": "relative"}); //this allows for fadein/out in IE
					self.currentFrame.animate({"opacity": 0}, self.settings.fallbackTheme.speed, function(){ //hide the current frame
						self.currentFrame.css({"display": "none", "z-index": "1"});
						self.currentFrame.removeClass("current");
						nextFrame.addClass("current").css({"display": "block", "z-index": self.numberOfFrames}).animate({"opacity": 1}, 500); //make the next frame the current one and show it
						self.currentFrame = nextFrame;
						self.currentFrameID = self.currentFrame.index() + 1;
						self.active = false;
						if(self.settings.autoPlay){
							autoPlaySequence = function(){self.autoPlaySequence()};
							clearTimeout(self.sequenceTimer);
							self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
						}
					});
				}			
			}
		},
		
		animateOut: function(direction){
			var self = this;
			self.settings.beforeCurrentFrameAnimatesIn();
			if(direction == 1){ //if user hit next button...
				//reset the position of the next frames elements ready for animating in again
				self.modifyElements(nextFrameChildren, "0s");
				nextFrameChildren.removeClass("animate-out");
				
				//make the current frames elements animate out
				self.modifyElements(frameChildren, "");
				if(!self.settings.disableAnimateOut){
					frameChildren.addClass("animate-out").removeClass("animate-in");
				}
			}
			
			if(direction == -1){ //if the user hit prev button
				self.modifyElements(nextFrameChildren, "0s");	
				if(!self.settings.disableAnimateOut){				
					nextFrameChildren.addClass("animate-out");		
				}else{
					self.active = false;
				}
				self.modifyElements(frameChildren, "");
					
				frameChildren.each(function(){
					if(self.prefix == "-o-"){
						selector = "." + $(this).attr("class").replace(" ", ".");
						previousFrameTransitionProperties = self.getStyleBySelector(selector);
						self.transitionProperties["transition-duration"] = previousFrameTransitionProperties["-o-transition-duration"];
						self.transitionProperties["transition-delay"] = previousFrameTransitionProperties["-o-transition-delay"];
						self.transitionProperties["transition-delay"] = (self.transitionProperties["transition-delay"] == "") ? "0s" : self.transitionProperties["transition-delay"];
					}else{
						self.transitionProperties["transition-duration"] = $(this).css(self.prefix + "transition-duration");
						self.transitionProperties["transition-delay"] = $(this).css(self.prefix + "transition-delay");
					}
					

					$(this).css(
						self.prefixCSS(self.prefix, self.transitionProperties)
					).removeClass("animate-in");
				})
			}
		},
		
		waitForAnimationsToComplete: function(elements, onceComplete){
			var self = this;
			elementsAnimated = {};
			elements.each(function(){
				elementsAnimated[$(this).attr("class")] = false;
			});
									
			self.currentFrame.bind(self.transitionEnd, function(e){ //wait for elements to finish animating...				
				elementsAnimated[e.target.className] = true;
				total = 0;
				for(element in elementsAnimated){
					if(elementsAnimated[element] == true){
						total++;
					}
				}
								
				if(total == elements.length){
					onceComplete();
				}
			});	
		},
		
		animateIn: function(direction){
			var self = this;
			self.currentFrame.removeClass("current");	//remove the active class
			self.currentFrame.unbind(self.transitionEnd); //remove the animation end event
			nextFrame.addClass("current"); //activate the next frame
			self.currentFrame = nextFrame; //the next frame is now the current one
			if(direction == 1){
				self.currentFrameID = (self.currentFrameID != self.numberOfFrames) ? self.currentFrameID + 1 : 1;
			}else{
				self.currentFrameID = (self.currentFrameID != 1) ? self.currentFrameID - 1 : self.numberOfFrames;
			}
																														
			nextFrameChildren = nextFrame.children(); //save the child elements
			frameChildren = self.currentFrame.children(); //save the child elements (the ones we'll animate) in an array
									
			self.settings.beforeNextFrameAnimatesIn();
							
			if(direction == 1){ //if user hit next button...
				//reset the position of the next frames elements ready for animating in again
				self.modifyElements(nextFrameChildren, "0s");
				nextFrameChildren.removeClass("animate-out");
				
				setTimeout(function(){
					frameChildren.removeClass("animate-out");
					self.modifyElements(frameChildren, "");
					frameChildren.addClass("animate-in");
					whenAnimationEnds();
				}, 50);
			}
			
			if(direction == -1){ //if the user hit prev button
				setTimeout(function(){
					self.modifyElements(frameChildren, "");
					frameChildren.addClass("animate-in").removeClass("animate-out");
					whenAnimationEnds();					
				}, 50);				
			}
			
			whenAnimationEnds = function(){
				unbind = function(){
					self.settings.afterNextFrameAnimatesIn();
					
					if(self.currentFrameID == self.numberOfFrames){
						self.settings.afterLastFrameAnimatesIn();
					}else if(self.currentFrameID == 1){
						self.settings.afterFirstFrameAnimatesIn();
					}
					self.currentFrame.unbind(self.transitionEnd); //unbind waiting for the frame to finish as it's no longer needed
					self.active = false; //set the sequence as inactive to allow the next frames to be activated
					if(self.settings.autoPlay){
						autoPlaySequence = function(){self.autoPlaySequence()};
						clearTimeout(self.sequenceTimer);
						self.sequenceTimer = setTimeout(autoPlaySequence, self.settings.autoPlayDelay, self);
					}
				}
				
				self.waitForAnimationsToComplete(nextFrameChildren, unbind);
			}
			
		}
	}; //END PROTOTYPE

	$.fn.sequence = function(options){
		return this.each(function(){
			var sequence = new Sequence($(this), options);
			$(this).data("sequence", sequence);
		});
	};
	
	$.fn.sequence.defaults = {
		nextButton: ".next",
		prependNextButton: true,
		prevButton: ".prev",
		prependPrevButton: true,
		startingFrameID: 1,
		autoPlay: true,
		autoPlayDirection: 1,
		animatestartingFrameIn: false,
		autoPlayDelay: 5000,
		pauseOnHover: true,
		pauseIcon: false,
		prependPauseIcon: true,
		pauseIconSrc: "images/pause-icon.png",
		keysNavigate: true,
		delayDuringOutInTransitions: 1000,
		touchEnabled: true,
		swipeThreshold: 15,
		cycle: true,
		disableAnimateOut: false,
		
		fallbackTheme: {
			speed: 500
		},
		
		//Callbacks are a work in progress and not it's possible not all of them will make it into v1.0
		beforeCurrentFrameAnimatesOut: function(){},	//triggers before current frame begins to animate out
		beforeNextFrameAnimatesIn: function(){},		//triggers before next frame begins to animate in
		afterNextFrameAnimatesIn: function(){},			//triggers after next frame animates in (and becomes the current frame)
		beforeCurrentFrameAnimatesIn: function(){},
		beforeFirstFrameAnimatesIn: function(){},		//triggers before the first frame animates in
		afterFirstFrameAnimatesIn: function(){},		//triggers after the first frame animates in
		beforeLastFrameAnimatesIn: function(){},		//triggers before the last frame animates in
		afterLastFrameAnimatesIn: function(){}			//triggers after the last frame animates in
	};
	$.fn.sequence.settings = {};
})(jQuery);