# Changelog #

Older versions can be found in the documentation changelogs.

## 1.3.0 ##

* Added ARIA support to all components with supported documentation
* Added CSS vendor prefixing support through [autoprefixer](https://github.com/ai/autoprefixer)
* Removed is and has state prefixing from the CSS and JS layers
* Removed `$state-is-prefix` and `$state-has-prefix` Sass variables
* Removed individual JavaScript distribution files
* Removed Compass dependency in favor of autoprefixer
* jQuery
    * Updated `$.fn.item()` to return an empty jQuery collection if index out of range
    * Removed `$.hyphenate()`
* Toolkit
    * Added `aria()` collection method that can set ARIA attributes
    * Removed `Toolkit.options.isPrefix` and `Toolkit.options.hasPrefix`
    * Renamed `Toolkit.options.vendor` to `Toolkit.vendor`
    * Renamed `Toolkit.createComponent()` to `Toolkit.create()`
* Component
    * Added static `count` property to each component that tracks the number of instances in the page
    * Added `uid` property that represents the current instance count
    * Added `cssClass` property that represents the component name in CSS class form
    * Added `id()` method to generate unique CSS class names
    * Removed error and loading template generation from components (wasn't being used)
* Carousel
    * Merged `itemsElement` and `itemElement` options
    * Merged `tabsElement` and `tabElement` options
    * Removed `itemsWrapper`, `itemsList`, `tabsWrapper` properties
* Drop
    * Added a global `.drop` class that all menus require
* Grid
    * Added `%row` placeholder to extend row styles from
    * Added `%col` placeholder to extend column styles from
    * Removed `.row` (reserved now for another component)
* Pin
    * Added `lock` option to disable pinning if element is taller than the viewport
    * Fixed a bug where the pin element margin was not included in the total height