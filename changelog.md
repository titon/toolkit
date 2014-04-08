# Changelog #

Older versions can be found in the documentation changelogs.

## 1.3.2 ##
* Updated `clickout` events to trigger for `touchstart` events
* Button, Form
    * Reset browser specific styles, specifically in iOS
* Modal
    * Added mobile specific styles that span the width of the viewport
* TypeAhead
    * Turned off `autocapitalize`, `autocorrect`, and `spellcheck` on the input field

## 1.3.1 ##
* Updated `event.target` to `event.currentTarget` where applicable

## 1.3.0 ##
This minor release includes 2 new components, automatic ARIA support for all applicable components,
replacing Compass with autoprefixer, removal of state prefixing, and many more bug fixes and improvements.

* Added new Step component for step based navigation
* Added new Switch component for visual checkbox switches
* Added ARIA support to all components with supported documentation
* Added CSS vendor prefixing support through [autoprefixer](https://github.com/ai/autoprefixer)
* Added namespace event triggering support to the activating node
* Removed is and has state prefixing from the CSS and JS layers
* Removed `$state-is-prefix` and `$state-has-prefix` Sass variables
* Removed individual JavaScript distribution files
* Removed Compass dependency in favor of autoprefixer
* Updated to normalize.css v3.0.1
* jQuery
    * Updated `$.fn.item()` to return an empty jQuery collection if index out of range
    * Refactored the `clickout` event to support delegated elements
    * Removed `$.hyphenate()`
    * Removed event helper methods like `clickout()`, `swipeleft()`, etc
* Toolkit
    * Added `aria` property to toggle support
    * Added `aria()` collection method that can set ARIA attributes
    * Removed `Toolkit.options.isPrefix` and `Toolkit.options.hasPrefix`
    * Renamed `Toolkit.options.vendor` to `Toolkit.vendor`
    * Renamed `Toolkit.createComponent()` to `Toolkit.create()`
* Component
    * Added global `cache` option to toggle AJAX response caching
    * Added static `count` property to each component that tracks the number of instances in the page
    * Added `uid` property that represents the current instance count
    * Added `cssClass` property that represents the component name in CSS class form
    * Added `id()` method to generate unique CSS class names
    * Removed error and loading template generation from components (wasn't being used)
* Carousel
    * Fixed a bug where `swipedown` would not trigger
    * Merged `itemsElement` and `itemElement` options
    * Merged `tabsElement` and `tabElement` options
    * Removed `itemsWrapper`, `itemsList`, `tabsWrapper` properties
* Drop
    * Added a global `.drop` class that all menus require
* Grid
    * Added `%row` placeholder to extend row styles from
    * Added `%col` placeholder to extend column styles from
    * Removed `.row` (reserved now for another component)
* Modal
    * Fixed a bug where a modal opened on the same modal causes the blackout to persist
* Pin
    * Added `lock` option to disable pinning if element is taller than the viewport
    * Added `$pin-transition` variable
    * Fixed a bug where the pin element margin was not included in the total height