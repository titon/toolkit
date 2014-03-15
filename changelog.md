# Changelog #

Older versions can be found in the documentation changelogs.

## 1.3.0 ##

* Added ARIA support to all components with supported documentation
* Removed is and has state prefixing from the CSS and JS layers
* Removed `$state-is-prefix` and `$state-has-prefix` Sass variables
* jQuery
    * Removed `$.hyphenate()`
* Toolkit
    * Added `aria()` collection method that can set ARIA attributes
    * Removed `Toolkit.options.isPrefix` and `Toolkit.options.hasPrefix`
    * Renamed `Toolkit.options.vendor` to `Toolkit.vendor`
    * Renamed `Toolkit.createComponent()` to `Toolkit.create()`
* Component
    * Added static `count` property that tracks the number of instances in the page
    * Added `uid` property that represents the current instance count
    * Added `cssClass` property that represents the component name in CSS class form
    * Added `id()` method to generate unique CSS class names
    * Removed error and loading template generation from components (wasn't being used)