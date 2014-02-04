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

    /** Detect IE <= 8 versions */
    ie8: !!(window.attachEvent && !window.addEventListener),

    /** Detect IE9 version */
    ie9: !!(window.addEventListener && navigator.userAgent.match(/MSIE/i)),

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