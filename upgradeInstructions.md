#Upgrading Sequence Versions

During the beta period of Sequence (versions prior to v1.0), backwards compatibility is not a priority. Some newer versions of the Sequence beta may not be compatible with existing implementations. Should you want to upgrade to the latest version, please follow the below instructions to upgrade for each subsequent release.

##Upgrading to v1.0 (Required)

1. In the version 1.0 release, sequence.jquery.js and sequence.jquery-min.js were renamed to jquery.sequence.js and jquery.sequence-min.js. Any existing themes that are being upgraded to v1.0 will need to have these filenames changed.

##Upgrading to v0.9.1

The option `autoPlay` is now `false` by default. If you're existing theme relies on the autoPlay feature and you haven't specified `autoPlay: true` in your options, you'll need to do so with v0.9.1. Example:

var options = {
	autoPlay: true
}

##Upgrading to v0.9 (Required)

1.	Lots of class names are now prefixed with `sequence-`. If you're using any of the following class names with Sequence, you'll need to prefix them with `sequence-`: 
	- `.next`
	- `.prev`
	- `.pause`
	- `.paused`
	- `.pause-icon`
	- `.pagination`
	- `.destroyed`
	- `.preloader`

	Example: `.next` will become `.sequence-next`, and so on.

2.	The top level `<ul>` within the Sequence element **must** now be given a class of `.sequence-canvas`. This is to allow for other `<ul>` elements to be placed within the Sequence element. Example:
	
		<div id="sequence">
			<ul class="sequence-canvas">
				<li>Frame 1</li>
				<li>Frame 2</li>
			</ul>
		</div>

##Upgrading to v0.8.5
In v0.8.5, the following two lines were removed from sequence.jquery.js:

	self.sequence.css({"width": "100%", "height": "100%", "position": "relative"}); //set the sequence list to 100% width/height just incase it hasn't been specified in the CSS
	self.sequence.children("li").css({"width": "100%", "height": "100%", "position": "absolute", "z-index": 1}); //do the same for the frames and make them absolute

These were removed to clean up the DOM (so there's not as many inline styles making your code look messy). If they aren't already in your CSS and you'd like to update existing Sequence themes to use sequence.jquery.js v0.8.5, the following CSS should be added:

	#sequence {
		position: relative;
		height: 100%; 
		width: 100%;
	}

	#sequence > ul > li {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	#sequence > ul li > * {
		position: absolute;
	}


##Upgrading to v0.8.3 
The following callbacks were removed:

- `beforeFirstFrameAnimatesIn()`
- `afterFirstFrameAnimatesIn()`
- `beforeLastFrameAnimatesIn()`
- `afterLastFrameAnimatesIn()`

This functionality can still be used with existing callbacks and public variables. Use this code as an example:

	sequence.beforeNextFrameAnimatesIn = function() {
    	if(sequence.nextFrameID == 1) {
    	    //do something before the first frame animates in
    	}

    	if(sequence.nextFrameID == sequence.numberOfFrames) {
    	    //do something before the last frame animates in
    	}
	}

##Upgrading to v0.8 (Required)
0.8 changed the way in which Sequence applies the `animate-in` and `animate-out` classes to elements. Prior to this version, Sequence gave each element to be animated these class names, instead, they are now given to the frame (the `<li>` element) instead.

- The CSS used for a Sequence theme should be modified to reflect this change. Take the following examples of how the `.animate-in` and `.animate-out` should be changed:

Existing HTML:

	<div id="sequence">
		<ul>
			<li>
				<div class="title">Title</div>
			</li>
			<li>
				<img class="model" src="images/model.png" />
			</li>
		</ul>
	</div>
	

Existing CSS to select the title and model in the above HTML:

`.title.animate-in`

`li .model.animate-out`

The above CSS selectors should be changed to the following to reflect the fact that `animate-in` and `animate-out` now apply to the frame (`<li>`) elements instead of the elements within frames:

`.animate-in .title`

`li.animate-out .model`

##Upgrading to v0.7.4.1
0.7.4.1 changed the default value of the `preloader` setting from `true` to `false`.

- If using the preloader functionality, please include `preloader: true` in your Sequence options, like so:

		var options = {
			autoPlay: true,
			preloader: true
		}

		var sequence = $("#sequence").sequence(options).data("sequence");

##Upgrading to v0.7.2
0.7.2 changed the way in which callbacks are used and renamed the `paused` public variable.

- `paused` should be changed to `isPaused`
- Prior to this version, callback functionality was added to Sequence options, like so:

	var options = {
		autoPlay: true,
		beforeNextFrameAnimatesIn: function() {
			//code to run before the next frame animates in
		}
	}

	var sequence = $("#sequence").sequence(options).data("sequence");

Callbacks are now added outside of the Sequence options, like so:

	var options = {
		autoPlay: true
	}

	var sequence = $("#sequence").sequence(options).data("sequence");

	sequence.beforeNextFrameAnimatesIn = function() {
		//code to run before the next frame animates in
	}
	

##Upgrading to v0.6.7
0.6.7 renamed the `afterPreload` setting.

- `afterPreload` should be changed to `afterLoaded`

##Upgrading to v0.6.5
0.6.5 renamed the `delayDuringOutInTransitions` setting.

- `delayDuringOutInTransitions` should be changed to `transitionThreshold`

##Upgrading to v0.6.2
0.6.2 renamed the `touchEnabled` and `keysNavigate` settings.

- `touchEnabled` should be changed to `swipeNavigation`
- `keysNavigate` should be changed to `keyNavigation`

##Upgrading to v0.6

0.6 renamed the before/after callbacks and the `current` class to `current-frame`.

- before/after callbacks should be renamed to the following `beforeNextFrameAnimatesIn`, `afterNextFrameAnimatesIn` and `beforeCurrentFrameAnimatesOut`.

- Any instance of the class `current`, should be renamed to `current-frame`.

