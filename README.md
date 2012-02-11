#Documentation
##Basic Set Up
###Add Files

Place a link to jQuery and the sequence.js file in the `<head>` of your document:
	
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="scripts/sequence.js"></script>
	
###Initiate a Sequence Slider

Once you've added the necessary files for Sequence, within the `<head>` of your document, inititate an instance of Sequence like so:
	
	<script type="text/javascript">	
		$(document).ready(function(){
			var sequence = $("#sequence").sequence(options);
		}
	</script>

Let's break this down:

Firstly, we are saving an instance of Sequence into a variable ("var") called `sequence`. The variable name is entirely up to you and, if necessary, will allow us to interact with Sequence via custom JavaScript which is explained in the [Developer Option's](#).

After the variable name, we specify a jQuery selector `$("#sequence")`, which is the element we want to act as the Sequence container. We will create a `div` in the HTML shortly with an ID of "sequence".

The Sequence function (`.sequence(options)`), will accept many options that allow for modifying how Sequence works. These options are explained in the [Developer Option's](#) section. If options are not specified, Sequence will rely on its default settings.

It is possible to place multiple instances of Sequence on the same page, like so:

	<script type="text/javascript">	
		$(document).ready(function(){
			var sequence = $("#sequence").sequence(options);
			var sequence2 = $("#sequence2").sequence(options2);
		}
	</script>

###Add an HTML Slider

Add Sequence's simple HTML structure like so:

	<div id="sequence">
		<ul>
			<li>
				<!--Frame 1 content here-->
			</li>
			<li>
				<!--Frame 2 content here-->
			</li>
			<li>
				<!--Frame 3 content here-->
			</li>
		</ul>
	</div>
	
Sequence consists of a container (a div with a unique ID) and an unordered list. Sequence refers to each list item within that unordered list as a "frame". Frames hold the content of your Sequence slider.

###Add Content

To add content to a frame, simply put HTML within each list item:

	<div id="sequence">
		<ul>
			<li>
				<div class="info1">
					<p>Frame 1</p>
				</div>
			</li>
			<li>
				<div class="info2">
					<p>Frame 2</p>
				</div>
			</li>
			<li>
				<div class="info3">
					<p>Frame 3</p>
				</div>
			</li>
		</ul>
	</div>	

Here we've added a `div` to each frame with unique classes. We will shortly write some CSS that will allow each `div` to animate in and out of the Sequence container.

Note that each frame can contain as many elements as necessary but only first level elements will be animated by Sequence.

###Setup a No-JavaScript Fallback

In a small percentage of browsers, JavaScript may be disabled which is the technology Sequence is built upon. To prevent an empty container from showing, nominate a frame to be displayed by giving each of its content elements a class of "animate-in":

	<div id="sequence">
		<ul>
			<li>
				<div class="info1 animate-in">
					<p>Frame 1 information</p>
				</div>
				<img class="my-image animate-in" src="my-image.jpg" alt="An image of me" />
			</li>
			<li>
				<div class="info2">
					<p>Frame 2 information</p>
				</div>
			</li>
			<li>
				<div class="info3">
					<p>Frame 3 information</p>
				</div>
			</li>
		</ul>
	</div>
	
Here we've nominated the first frame to be displayed if JavaScript is disabled. I've added an image to the first frame to demonstrate that each content element within the nominated frame should be given the "animate-in" class.

##Creating an Animated Theme using CSS3
###Setting up the Sequence Container and Frames

Let's start by styling our Sequence container:

	#sequence{
		border: black solid 3px;
		height: 370px;
		margin: 40px auto;
		position: relative;
		width: 450px;
	}
	
Here we've given the container some basic dimensional properties and a border. We've also given the container a relative position. This is an important property as all of the content elements with a Sequence slider will be given an absolute position, like so:

	#sequence li > *{
		position: absolute;
	}

This way, when we come to position elements with the Sequence container, a position top of 0 pixels will be the top of the Sequence container, and a position left of 0 pixels will be the left hand side of the Sequence container.

###How Sequence's Animations Work

Each first level element within a frame will be animated by Sequence, but how that animation happens is entirely your choice and created using [CSS3 transitions](#). By default, Sequence initially displays the first frame's content, so let's start by animating the first element from our example above.

In the HTML, we've given the `div` a class of "info1" and made sure it will be displayed in the absence of JavaScript by also giving it a class of "animate-in".

Should JavaScript be enabled (in almost all cases it will be), Sequence will begin by removing the "animate-in" class. So the HTML will look like this:

	<div class="info1">
		<p>Frame 1</p>
	</div>

This element is in its "start" position. Sequence will automatically add a class of "animate-in" to it, which will trigger the CSS3 transitions we will shortly write. The HTML will look like this:

	<div class="info1 animate-in">
		<p>Frame 1</p>
	</div>

When the "animate-in" position is reached, Sequence will then remove the "animate-in" class, and add a class of "animate-out", which again, we can control via CSS3 transitions. The HTML will look like this:

	<div class="info1 animate-out">
		<p>Frame 1</p>
	</div>

When the "animate-out" position is reached, Sequence will then start automatically applying these transitional phases to the next frames elements. Once the last frame's elements have reached the "animate-out" position, Sequence will go back to the first frame, remove the "animate-out" class (reseting the element to it's starting position), and the whole process will continue indefinetly.

SEQUENCE DEMO HERE

SEQUENCE TRANSITIONAL PHASES DEFINTION LIST HERE

###Animating Backwards

Sequence contains options that allow for a user to control the animation of frames using next/previous buttons, the keyboard left/right arrow keys or swiping on touch devices (version 1.0 onwards). You can also make Sequence play in reverse via the [developer options](#). Sequence will apply the above mentioned transitional phase classes in reverse.

Let's assume frame 2 has one element that is currently in the "animate-in" position. If a user were to click a "previous" button, Sequence would remove the "animate-in" class, resetting the element to its starting position and the previous frame's element (frame 1), would be given the class of "animate-out" (reseting it to the "animate-out" position), followed by a class of "animate-in" to then make it transition into its "animate-in" position.

SEQUENCE DEMO HERE (IN REVERSE)

###Animating Frame Elements using CSS3 Transitions

Now we know how Sequence works, we can manipulate the transition of frame elements using CSS3 transitions. Just before we begin adding transitional properties, let's style the `div` within each frame:

	.info1, .info2, .info3{
		background: #3f7ad6;
		color: white;
		height: 95px;
		padding: 5px;
		width: 95px;
	}

We've made each `div` 95px wide and tall and given them a background colour. Now, let's begin applying transitional properties:

	.info1{
		left: -150px;
		top: 10px;
		-webkit-transition-duration: 1s;
		-moz-transition-duration: 1s;
		-o-transition-duration: 1s;
		-ms-transition-duration: 1s;
		transition-duration: 1s;
	}
	
Remember that an element with no transitional phase class is in its "start" position. We've started this element 150px outside of the Sequence container (to the left), and 10px from the top.

*Note #1*: we've given the element a transition duration but, this is NOT the duration it will take to go from the "start" position to the "animate-in" position. Instead, it is the duration it will take to go from the "animate-in" position to the "start" position when Sequence is [animating backwards](#).

*Note #2*: Sequence has been built to work across all modern browsers which means it is necessary to use [vendor prefixes](#) for CSS3 attributes such as `transition-duration`. Please see the section ["Making your Sequence Theme Cross Browser Compatible"](#) for advice on how to make using vendor prefixes as easy as possible.

As we saw in [How Sequence's Animations Work](#), Sequence will add a class of "animate-in" to any active frame elements to make it transition to its "animate-in" position. So, let's style the transition between the "start" and "animate-in" positions:

	.info1.animate-in{
		left: 165px;
		-webkit-transition-duration: 1s;
		-moz-transition-duration: 1s;
		-o-transition-duration: 1s;
		-ms-transition-duration: 1s;
		transition-duration: 1s;
	}

We've made it so that the `div` with class "info1", will move from its "start" position of  `left: -150px`, to `left: 165px`. We haven't specified a top position so that will remain the same as the "start" position (`top: 10px`). By adding a transition-duration, the time it will take to go between the "start" and "animate-in" positions will be 1 second (1s). Again, we've used [vendor prefixes](#) to make the theme work across all modern browsers.

	.info1.animate-out{
		left: 500px;
		-webkit-transition-duration: 1s;
		-moz-transition-duration: 1s;
		-o-transition-duration: 1s;
		-ms-transition-duration: 1s;
		transition-duration: 1s;
	}
	
Once all of the frame's elements have finished animating in, Sequence will then change the "animate-in" class to "animate-out". As we did with the "animate-in" transition, we've changed the left value to make the element move outside of the Sequence container and specified a 1 second transition duration.

From here on, we can apply transition durations to the remaining elements within the second and third frame. For the purpose of this demo and the sake of simplicity, we can modify the CSS we've just written to apply the same transition durations to the other frame elements, like so:

	.info1, .info2, .info3{
		left: -150px;
		top: 10px;
		-webkit-transition-duration: 1s;
		-moz-transition-duration: 1s;
		-o-transition-duration: 1s;
		-ms-transition-duration: 1s;
		transition-duration: 1s;
	}
	
Here we've given start positions to the `div` elements within the second and third frames.

	.info2{
		top: 130px;
	}
	
	.info3{
		top: 250px;
	}

This CSS overwrites the top positions for each element so one is positioned below the next.

	.info1.animate-in, .info2.animate-in, .info3.animate-in{
		left: 165px;
		-webkit-transition-duration: 1s;
		-moz-transition-duration: 1s;
		-o-transition-duration: 1s;
		-ms-transition-duration: 1s;
		transition-duration: 1s;
	}
	
	.info1.animate-out, .info2.animate-out, .info3.animate-out{
		left: 500px;
		-webkit-transition-duration: 1s;
		-moz-transition-duration: 1s;
		-o-transition-duration: 1s;
		-ms-transition-duration: 1s;
		transition-duration: 1s;
	}	
	
And finally we've included the second and third `div` elements in our "animate-in" and "animate-out" transitional positions.

What we've learnt in this demonstration are the basics to creating an animated theme for Sequence. You should now be able to create your own theme. Keep reading though, Sequence boasts even more useful features to help you make a truly amazing and unique theme.

###Transitional CSS Examples

When specifying properties for transitional classes, in most cases you will use a transition-duration (unless you just want frame elements to immediately snap to the next/previous phase) but the remaining properties to transition between are entirely up to you. In this demo, we've only transitioned between numerous `left` properties, making an element move in and out of a Sequence container. Here's just a few more examples you may like to experiment with:

SCALE DEMO

ROTATE DEMO

COLOR DEMO

3D TRANSFORM DEMO

OPACITY DEMO

##Developer's Options
###Options

Sequence comes with many options that allow you to easily control its features.

####Specifying Options

As explained in [Initiate a Sequence Slider](#), each instance of a Sequence slider can be passed developer defined options that override Sequence's default settings. Options are stored in an object passed to the `.sequence()` function, like so:

	<script type="text/javascript">	
		$(document).ready(function(){
			var options = {
				autoPlay: true,
				autoPlayDelay: 3000
			}
			var sequence = $("#sequence").sequence(options);
		}
	</script>

Multiple instances of Sequence can be passed the same options:

	<script type="text/javascript">	
		$(document).ready(function(){
			var options = {
				autoPlay: true,
				autoPlayDelay: 3000
			}
			var sequence = $("#sequence").sequence(options);
			var sequence2 = $("#sequence2").sequence(options);
		}
	</script>
	
Or differing options:

	<script type="text/javascript">	
		$(document).ready(function(){
			var options = {
				autoPlay: true,
				autoPlayDelay: 3000
			}
			
			var options2 = {
				autoPlay: true,
				autoPlayDelay: 5000
			}
			var sequence = $("#sequence").sequence(options);
			var sequence2 = $("#sequence2").sequence(options2);
		}
	</script>

The following is the complete set of options implemented within Sequence:

SEQUENCE OPTIONS (TABLE WITH OPTIONS, DESCRIPTIONS, DEFAULTS, VERSION HISTORY ETC)

###Callbacks



###Public Methods

##Packaging and Distributing a Theme


