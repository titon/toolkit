# Changelog #

Older versions can be found in the documentation changelogs.

## 2.1.0 ##

* Added right-to-left (RTL) support for all CSS and JS components
* Added Travis CI integration for automatic build and testing
* Added BEM support to all JS components
* Updated all JS templates to support functions for on-demand rendering
* Sass
    * Added `$text-direction` variable
    * Added `ltr()` and `rtl()` mixins
    * Renamed `$vendor-prefix` to `$namespace`
    * Renamed `remove-selector-char()` to `remove-selector()`
* JavaScript
    * Toolkit
        * Added `isRTL` flag for detecting RTL support
        * Added `bemSeparators` property for customizing BEM separators
        * Added `bem()` function for generating BEM CSS class names
        * Added `buildTemplate()` function for converting strings into usable templates
        * Renamed `create()` to `createPlugin()`
        * Renamed `vendor` to `namespace`
    * Base
        * Removed the `runtime` property
* Components
    * Component
        * Split the `Component` class into 3 classes with different roles: 
            `Component` for embedded elements, `TemplateComponent` for templates rendered into elements, 
            and `CompositeComponent` which is a collection of rendered elements
        * Moved `elements` and `nodes` properties to `CompositeComponent`
        * Moved `createElement` method to `TemplateComponent`
        * Added `render()` for converting templates into elements
        * Removed the `created` property
    * Drop
        * Updated to extend the `CompositeComponent`
        * Added the menu and node as arguments to the `hiding` and `showing` events
        * Removed the `hideOpened` option (will happen automatically now)
    * Flyout
        * Updated to extend the `CompositeComponent`
        * Added a `wrapperClass` option
        * Renamed the `current` property to `url`
        * Renamed the `menus` property to `elements`
        * Renamed the `.push-left` class to `.push-opposite`
        * Refactored `_buildMenu()` to handle the composite functionality
        * Removed the `isVisible()`, `_getMenu()`, and `_getTarget()` methods
    * LazyLoad  
        * Renamed the `elements` property to `items`
    * Modal
        * Updated to extend the `TemplateComponent`
    * Popover
        * Added a `wrapperClass` option
    * Showcase
        * Updated to extend the `TemplateComponent`
        * Fixed a bug where captions would disappear
        * Fixed a bug where the blackout loader would not disappear
    * Toast
        * Updated to extend the `CompositeComponent`
        * Added a `wrapperClass` option
        * Renamed `template` to `wrapperTemplate`
        * Renamed `toastTemplate` to `template`
    * Tooltip
        * Updated to extend the `CompositeComponent`
        * Added a `wrapperClass` option
        * Updated to toggle `is-active` classes on the activating node
        * Added the title as a second argument to the `load` event
        * Removed the `elementHead` and `elementBody` properties
        * Removed the `reset()` method and runtime options
    * TypeAhead
        * Updated to extend the `TemplateComponent`
