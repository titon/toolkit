<?php
$class = '';

if ($mod = value('modifier')) {
    $class = 'is-' . $mod;
} ?>

<pre<?php if ($class) echo ' class="' . $class . '"'; ?>><code>window.Toolkit = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Options */
    options: {
        vendor: '',
        isPrefix: 'is-',
        hasPrefix: 'has-'
    },

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** Does the browser support transforms? */
    hasTransform: (function() {
        var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
            style = document.createElement('div').style;

        for (var i = 0; i &lt; prefixes.length; i++) {
            if (prefixes[i] in style) {
                return prefixes[i];
            }
        }

        return false;
    })(),

    /** Does the browser support transitions? */
    hasTransition: (function() {
        var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' '),
            style = document.createElement('div').style;

        for (var i = 0; i &lt; prefixes.length; i++) {
            if (prefixes[i] in style) {
                return prefixes[i];
            }
        }

        return false;
    })(),

    /** Detect touch devices */
    isTouch: !!('ontouchstart' in window)
};</code></pre>

<div class="example-title">Inline</div>

<p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <code>Inline Code</code>
    Aliquam dapibus tempor risus, a ultricies libero posuere ut. <br>
    <samp>Sample Text</samp> Proin vitae enim fermentum, vulputate justo id. <kbd>esc</kbd>
    Curabitur pellentesque convallis lectus a porta. <var>Variable</var>
</p>