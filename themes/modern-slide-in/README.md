# Modern Slide In

> A minimalist theme for showcasing products

Modern Slide In is powered by [Sequence.js](http://sequencejs.com/) - CSS animation framework for creating responsive sliders, presentations, banners, and other step-based applications.

Author: [Ian Lunn](https://ianlunn.co.uk/)  
Email: [hello@ianlunn.co.uk](mailto://hello@ianlunn.co.uk)

License: [MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Ian Lunn

## Getting Started

1. Move the `modern-slide-in` directory to the same directory as the page you'd like the theme to appear on.
2. Add the stylesheet within the `<head></head>` tags on your page below existing stylesheets, using the following:
`<link rel="stylesheet" href="modern-slide-in/css/sequence-theme.modern-slide-in.css" />`
3. From index.html in the downloaded theme, copy everything inside the <body></body> tags, then paste into the page you'd like the theme to appear on.
4. Add a reference to the Sequence library, its third-party dependencies, and the theme options just before the closing `</body>` element on your page:
```javascript
<script src="scripts/third-party/imagesloaded.pkgd.min.js"></script>
<script src="scripts/third-party/hammer.min.js"></script>
<script src="scripts/sequence.min.js"></script>
<script src="scripts/sequence-theme.modern-slide-in.js"></script>
```
5. From index.html in the downloaded theme, copy everything inside the <body></body> tags, then paste into the page you'd like the theme to appear on.
6. Save your file and upload newly added/modified files to your web server. You're done!

A theme's options can be changed in `scripts/sequence-theme.modern-slide-in.js`. See Options in the [documentation](http://www.sequencejs.com/developers/documentation/).

## Support

For theme support, please use the following contact details:

Email: [info@sequencejs.com](mailto://info@sequencejs.com)  
Website: [http://sequencejs.com/](http://sequencejs.com/)

## Sequence.js License

The [Sequence.js](http://sequencejs.com/) library is made available under the following open-source [MIT license](http://opensource.org/licenses/MIT):

> Copyright (c) 2014 Ian Lunn Design Limited

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Sequence themes are made available under their own licenses. Please respect them accordingly.

## Release History

### v2.0.0
*04/06/2014*

- Built from ground-up to work with Sequence v2

### v1.3
*11/03/2013*

- Updated to work with Sequence.js v0.9
- Added height: 100% and width: 100% to the top level UL to allow for detection of mouseenter/mouseleave
- The pagination will now move up a little when hovered over rather than fade in
- Added transition-property to animated elements
