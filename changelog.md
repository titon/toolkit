# Changelog #

Older versions can be found in the documentation changelogs.

## 2.0.0 ##

* Dropped MooTools support
* Dropped IE8 support
* Upgraded to jQuery 2
* Upgraded to Gulp from Grunt
* Upgraded to RequireJS for JS dependency management and compilation
* Sass
    * Added `$enable-small-size` and `$enable-large-size` to toggle size classes in CSS output
    * Added `$enable-all-effects`, `$enable-all-modifiers`, and `$enable-all-animations` for easier styling
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
    * Added a `Base` class layer that both `Component` and `Behavior` extend
    * Added a new hook layer to `Base` that replaces the instance event layer
    * Improved the prototype inheritance layer by initializing a new class instead of extending objects
    * Refactored the class layer so that constructors are passed as a property instead of an argument
    * Refactored so that class properties are passed through an object instead of set through the constructor
    * Renamed `$.fn.addData()` to `$.fn.cache()`
    * Removed `$.cookie()` and `$.removeCookie()` methods (use a third-party instead)
    * Removed `Toolkit.transitionEnd` flag
    * Component
        * Renamed the `component` property to `name`
        * Renamed the `doDestroy` method to `destructor`
* Components
    * Blackout
        * Renamed `Toolkit.Blackout.factory()` to `Toolkit.Blackout.instance()`
    * Carousel
        * Added a `calculate()` method that triggers on load/resize to determine carousel dimensions
    * Form
        * Improved disabled state across inputs
        * Normalized `fieldset` and `legend` when used in an inline form
    * Grid
        * Fixed a bug where `.push-*` and `.pull-*` classes were being generated if `$grid-push-pull` was disabled
    * Icon
        * Added a `$icon-sizes` list variable to control the CSS output
    * Matrix
        * Improved the deferred image rendering process
    * Modal
        * IDs can now be passed as the 2nd argument to `show()`
    * Popover
        * The `follow` attribute is now forced to `false`
    * Switch
        * The `.pill` and `.round` classes have moved to `.switch-bar` from `.switch`
    * Tabs
        * Has been renamed to `Tab` and all files and references have been changed
        * `preventDefault` now applies to both cookie and fragment persistence
        * `ajax` has changed to `false` by default
        * Fixed a bug trying to determine the index to show on load
    * Type Ahead
        * The `matcher` function now accepts the item object as the 1st argument