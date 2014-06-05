# Changelog #

Older versions can be found in the documentation changelogs.

## 2.0.0 ##

* Dropped MooTools support
* Dropped IE8 support
* Upgraded to jQuery 2
* Sass
    * Added `$enable-small-size` and `$enable-large-size` to toggle size classes in CSS output
    * Moved `.span-*` classes from the Grid component into the shared base file
    * Updated all component CSS class names to use Sass variables for more configuration control
    * Updated all modifiers to not use `@extend` to reduce CSS output (requires full class declarations now)
    * Updated all modifiers to be toggleable through Sass variables
    * Updated `:before` and `:after` pseudo elements to use double colon `::` syntax
    * Updated `$size-*` and `$shape-*` variables to be prefixed by default with a `.`
    * Refactored effects into their respective components that can be toggled through Sass variables
    * Refactored the visual effects into modifiers for the Button component
    * Removed `is-active()`, `is-disabled()`, and `is-*()` state mixins
* JavaScript
    * Removed `$.cookie()` and `$.removeCookie()` methods (use a third-party instead)
* Components
    * Grid
        * Fixed a bug where `.push-*` and `.pull-*` classes were being generated if `$grid-push-pull` was disabled
    * Icon
        * Added a `$icon-sizes` list variable to control the CSS output