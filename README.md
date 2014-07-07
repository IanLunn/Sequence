Sequence [![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=IanLunn&url=https://github.com/IanLunn/Sequence&title=Sequence&language=english&tags=github&category=software)
=====================

> CSS animation framework for creating responsive sliders, presentations, banners, and other step-based applications.

See the [introduction](http://ianlunn.github.io/Sequence/) and [pre-made themes](http://sequencejs.com/).

## Features

- Create animated themes using CSS transitions
- Fully supports responsive design
- Supported on mobile, tablet and desktop devices
- No limitations on CSS or HTML you can use
- Animate canvas and content
- 60FPS animations
- Auto play
- next/previous/pause buttons and pagination support
- Touch support via [Hammer.js](http://eightmedia.github.io/hammer.js/)
- Preloader via [ImagesLoaded](http://imagesloaded.desandro.com/)
- Hash tag support
- Keyboard navigation
- API for custom functionality
- Top quality documentation
- Supports all major browsers with a fallback mode for legacy browsers ([detailed browser support](https://github.com/IanLunn/Sequence/wiki/Sequence-v2-Browser-Support))
- [Yeoman generator](https://github.com/IanLunn/generator-sequence) available for quick scaffolding of themes

## Philosophy

The key philosophy for Sequence is to aid you in creating your animated step-based application without getting in the way of how you or a web browser work. Create content and then animate it using the HTML and CSS you're used to. There's no special syntax to learn, no limitations on the elements you can use, and no heavy JavaScript implementations recreating what the browser is already capable of.

## Demo Themes

The following themes are packaged with the Sequence download package:

- [Intro](http://ianlunn.github.io/Sequence/themes/intro-theme/) - The theme used to introduce Sequence
- [Modern Slide In](http://ianlunn.github.io/Sequence/themes/modern-slide-in/) - A minimalist theme for showcasing products
- [Pop Slide](http://ianlunn.github.io/Sequence/themes/pop-slide/) - A colourful slider with highlighted pagination
- [Cube](http://ianlunn.github.io/Sequence/themes/cube) - A basic 3D cube that spins on the Y axis
- [Basic](http://ianlunn.github.io/Sequence/themes/basic/) - A basic slider that moves side to side
- [Test Theme](http://ianlunn.github.io/Sequence/themes/test-theme/) - Used for Testing Sequence.js and its API
- [Multiple Test Theme](http://ianlunn.github.io/Sequence/themes/mmultiple-test/) - A theme to test multiple instances of Sequence

Additional themes are made available on the [Sequence Theme Store](http://sequencejs.com/themes/)

Head to the [showcase](https://github.com/IanLunn/Sequence/wiki/Showcase) to see themes others have created.

## Getting Started

To get started [download](https://github.com/IanLunn/Sequence#download) Sequence and then head to the [documentation](https://github.com/IanLunn/Sequence/blob/master/DOCUMENTATION.md). If you'd like to contribute to Sequence's development, please see the [contributing](https://github.com/IanLunn/Sequence/blob/master/contributing.md) guidelines.

### Download

- [Download Sequence](https://github.com/IanLunn/Sequence/archive/master.zip)

Sequence can also be installed using the [Bower](http://bower.io/) command:

```
bower install sequencejs
```

or [NPM](https://www.npmjs.org/):

```
npm install sequencejs
```

## Authors

[Ian Lunn](https://ianlunn.co.uk/) and [contributors](https://github.com/IanLunn/Sequence/graphs/contributors).

Follow [@IanLunn](https://twitter.com/IanLunn/) on Twitter for updates on Sequence as well as news and opinions on front-end web development.

## History

Sequence v1 was first conceived in 2011 by [Ian Lunn](http://ianlunn.co.uk/) whilst he was recreating an animated effect used on the Apple iPhone 4 website. In creating the demo he realised the limited script had far more
potential if its animations could be written via CSS instead of JavaScript. This would allow developers to easily create their own animations that were completely separate from the logic of the script itself.

CSS animations were still quite new at the time so after a lot of battling with browser support, Ian released the first version of Sequence in February 2012 under an open-source MIT License.

Sequence grew in popularity and was updated with bug fixes and minor features for the next 18 months.

In early 2014, Ian began working on Sequence 2.0.0. This addressed version 1's biggest limitations and issues; the requirement of having to animate all top-level elements, improved touch support, and so on.

Sequence 2.0.0 was released in July 2014.

For a complete list of changes, see the [CHANGELOG](https://github.com/IanLunn/Sequence/blob/master/CHANGELOG.md).

## Limitations

Sometimes when choosing a library, its better to know what it *doesn't* do to enable you to make the decision to use it in a project. Although we've made Sequence as good as it can possibly be, we've tried to keep its scope tight, as such, there are some limitations:

### AJAX Support

If you're planning on using AJAX in your project, know that Sequence can be initiated and destroyed whenever necessary, meaning it can be loaded on a page via AJAX after the page load event. However, at present Sequence doesn't allow for loading additional steps via AJAX.

### 3D Transform Support

At present, some browsers don't fully support CSS 3D transforms.
 Internet Explorer 10 and 11 don't support `preserve-3d` and as such, are forced into fallback mode when the use of CSS 3D transforms are detected.

## License

Sequence is made available under a [MIT License](https://github.com/IanLunn/Sequence/blob/master/LICENSE.md).

Sequence themes included in the download are made available under a [MIT License](https://github.com/IanLunn/Sequence/blob/master/LICENSE.md) unless otherwise stated. Themes available on [SequenceJS.com](http://www.sequencejs.com/) have their own licenses, please respect them accordingly.

[SequenceJS.com](http://www.sequencejs.com/), Sequence, and its dependencies are &copy; 2014 [Ian Lunn](https://www.ianlunn.co.uk/) unless otherwise stated.

## Support Sequence Development

To support the future development of Sequence and other open source projects created by [Ian Lunn](https://github.com/IanLunn), please consider making a contribution.

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

[![Analytics](https://ga-beacon.appspot.com/UA-11991680-6/sequence)](https://github.com/ianlunn/sequence)
