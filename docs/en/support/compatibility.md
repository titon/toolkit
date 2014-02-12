# Browser Compatibility #

Toolkit was engineered for latest in mobile and desktop browsers, but this doesn't stop it from degrading gracefully for older browsers.
Degrading allows for components in older browsers to function as normal by removing animations, reducing the amount of CSS styles being used,
or by simplifying JavaScript functionality.

## Supported Browsers ##

For the most part, the latest versions of the following modern browsers are supported.
We will officially support the last 3 versions of every browser.
Anything older will not be supported (depending on context and severity of issue).

* Chrome (Windows, Mac, iOS, Android)
* Firefox (Windows, Mac)
* Safari (Mac, iOS)
* Internet Explorer (Windows)
* Opera (Windows)

While older versions are not officially supported, Toolkit will function to some extent.
The following minimum versions should support most (if not all) of Toolkits functionality.

* Chrome 11+
* Firefox 10+
* Safari 5.1+
* Internet Explorer 9+
* Opera 12+

## Internet Explorer 8 & 9 ##

Although IE 8 and 9 are partially supported, they do not support many of the features implemented by modern browsers, which is represented in the table below.
Support is determined through [caniuse.com](http://caniuse.com/) and can be verified by clicking on the table row titles.

<table class="table compatibility-table">
    <thead>
        <tr>
            <th>Feature</th>
            <th>Internet Explorer 8</th>
            <th>Internet Explorer 9</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a href="http://caniuse.com/#feat=html5semantic">HTML5 Elements</a></td>
            <td class="is-error">Can be enabled with <a href="http://modernizr.com">modernizr</a> or <a href="http://necolas.github.io/normalize.css/">normalize.css</a></td>
            <td class="is-success">&check;</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=css-animation">CSS3 Animations</a></td>
            <td class="is-error" colspan="2">Falls back to element display toggling as the JavaScript layer does not use animations</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=css-transitions">CSS3 Transitions</a></td>
            <td class="is-error" colspan="2">Any transition effects will be instant</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=css3-boxsizing">CSS3 Box Sizing</a></td>
            <td class="is-info">Has partial support</td>
            <td class="is-success">&check;</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=css3-colors">CSS3 Colors</a></td>
            <td class="is-error">No rgba() or hsla() support</td>
            <td class="is-success">&check;</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=css3-sel3">CSS3 Selectors</a></td>
            <td class="is-error">No advanced selector support</td>
            <td class="is-success">&check;</td>
        </tr>
        <tr>
            <td>Em Scaling</td>
            <td class="is-success">&check;</td>
            <td class="is-success">&check;</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=rem">Rem Scaling</a></td>
            <td class="is-error">Instances of <code>rem</code> will need to be overwritten</td>
            <td class="is-success">&check;</td>
        </tr>
        <tr>
            <td><a href="http://caniuse.com/#feat=css-mediaqueries">Media Queries</a></td>
            <td class="is-error">Can be enabled with <a href="https://github.com/scottjehl/Respond">respond.js</a></td>
            <td class="is-success">&check;</td>
        </tr>
    </tbody>
</table>

<div class="notice is-warning">
    If you need to support IE8, quite a bit of manual work will be required to make the components work correctly.
</div>

However, the following libraries will aide in supporting older Internet Explorer browsers.
But at what point does this become too much?

* [HTML5 Shiv](https://github.com/aFarkas/html5shiv)
* [Selectivizr](https://github.com/keithclark/selectivizr)
* [Modernizr](http://modernizr.com/)
* [IE8](https://github.com/WebReflection/ie8)
* [DOM4](https://github.com/WebReflection/dom4)

### Unsupported Components ###

On top of the features above not being supported, the following Toolkit components are not supported in IE 8.

* [Input](../components/input.md)
* [Matrix](../components/matrix.md)

### Compatibility Mode ###

Toolkit is not supported in older Internet Explorer compatibility modes.
Be sure that the latest rendering mode for IE is being used by including the following meta tag in your page.

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```