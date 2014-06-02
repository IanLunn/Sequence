Sequence v2 (Pre-alpha) [![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=IanLunn&url=https://github.com/IanLunn/Sequence&title=Sequence&language=english&tags=github&category=software)
=====================

## The CSS Animation Framework

*Pre-alpha warning: Sequence.js v2 is not yet ready for production and is only made available for testing and development. Many features are yet to be implemented and those that have are yet to be tested. If you're looking for a production ready version, checkout [Sequence v1](http://sequencejs.com/).*

Sequence allows you to create your own unique animated themes for sliders, presentations, banners, accordions, and other step-based applications.

## Philosophy

The key philosophy for Sequence is to aid you in creating your animated application without getting in the way of how you or a web browser work. Create content and then animate it using the HTML and CSS you're used to. There's no special syntax to learn, no limitations on the elements you can use, and no heavy JavaScript implementations recreating what the browser is already capable of.

## Demo Themes



**TBA**

## Features

Sequence is packed full of features:

-
-

To get started, head to the [documentation](https://github.com/IanLunn/Sequence/blob/v2/DOCUMENTATION.md).

## How to Contribute

Sequence.js is nearing version 2 and we need your help to get there. You can contribute in the following ways:

- Create themes using the early versions of Sequence v2 and provide the following types of feedback:
  - [Report bugs](https://github.com/IanLunn/Sequence/issues)
  - Ease of use (Did you find Sequence v2 easy to use? Can it be made easier?)
  - Feature suggestions
  - Documentation improvements (Did you feel anything in the documentation was unclear or missing?)
- Complete tasks on the [Todo list](#todo-list)
- Fix bugs (visit the [v2 milestone on GitHub](https://github.com/IanLunn/Sequence/issues?milestone=11&state=open) for a complete list)
- Master Sequence v2 and consider becoming a [Premium Theme Partner](#premium-theme-partnership)
- Consider [supporting the future of Sequence v2 financially](#support-sequence-development)

Feedback can be provided on the project's [GitHub page](https://github.com/IanLunn/Sequence/), to [@IanLunn on Twitter](https://twitter.com/IanLunn) or [via email](mailto://hello@ianlunn.co.uk).

## Todo List

Where possible, `src/sequence.js` contains `// TODO` comments showing functionality that has not yet been implemented.

The following is a complete list of the work still needed to be carried out to reach a stable version ready for launch:

1. Clear all [listed bugs](https://github.com/IanLunn/Sequence/issues?milestone=11&state=open)
2. keyNavigation should only work when Sequence has focus
3. Implement reverse animations for the `reverseWhenNavigatingBackwards` option
4. Remove event for hashChange when using IE
5. Implement ability to remove the Hammer event
6. Implement `swipeHammerOptions` option
7. Implement `destroy()`
8. Implement AMD/Require.js support
9. Make `_getAnimationMap.destroyClone()` IE7 compatible
10. Make `_ui.getElement()` IE7 compatible
11. Implement fallback functionality for `_ui.show()` and `_ui.hide()` when the browser doesn't support CSS transitions
12. Implement fallback functionality for `_animation.moveCanvas()` when the browser doesn't support CSS transitions
13. Implement `_animation.stepSkipped()` functionality to stop a step from animating when it is skipped
14. Browser/Device Test - Sequence v2 has been developed in Firefox on a Mac. No other browsers/devices have been tested yet
15. Add "current" class to pagination links when used
16. Build Yeoman generator for Sequence themes

## Premium Theme Partnership

When v2 launches, we will be looking for people who we can partner with to sell Sequence themes on the [official marketplace](http://sequencejs.com). If this is of interest, please [get in touch](http://sequencejs.com/contact/).

We will release further information about the premium theme partnership in the near future.

## Support Sequence Development

To support the future development of Sequence.js and other open source projects created by [Ian Lunn](https://github.com/IanLunn), please consider making a contribution.

Your contribution is not-for-profit (or beer!), and will allow Ian to spend a little less time on client projects and more time supporting and creating open source software.

Thank you.

### Flatter

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=IanLunn&url=https://github.com/IanLunn/Sequence&title=Sequence&language=english&tags=github&category=software)

### Bitcoin

Bitcoin contributions may be sent to the following address:

<div style="text-align: center;">
<a href="bitcoin:1KEbFvcXL8m6LogG2wjSUFz2xH6PeN6jRd?label=Sequence.js%20Development"><img src="http://ianlunn.co.uk/images/btc-donate.jpg" /></a>
<p>1KEbFvcXL8m6LogG2wjSUFz2xH6PeN6jRd</p>
</div>
