# Changelog #

Older versions can be found in the documentation changelogs.

## 2.1.9 ##
* Updated NPM dependencies and fixed build process
* Replaced `$.access()` as it was removed from jQuery's public API
* Added new float and alignment CSS classes that respect RTL mode

## 2.1.8 ##
* Fixed an issue with libsass ~3.4 failing to transpile.

## 2.1.7 ##
* Updated the `.span-*` classes to no longer be coupled with the grid component
* Components
    * Component
        * Updated `loadContent()` to accept elements as well as strings
    * Carousel
        * Fixed a bug where re-calculations would fail because of the previously set widths or heights
    * Stalker
        * Fixed a bug where the bottom threshold was being calculated incorrectly

## 2.1.6 ##
* Further improved AMD loading by splitting child components into their own files
* Components
    * Carousel
        * BREAKING CHANGE: The process to determine the size (width or height) to cycle with has been completely refactored. The new process will now take into account margins (to allow for gutters) and sizes to be explicitly set with CSS. Because of this change, the `itemsToShow` value will only aid in the calculation process, but will not actually change the display of the items, this should be done with CSS.
    * Pin
        * Added `pinned` and `unpinned` events
        * Added a `pinned` boolean property
        * Added an `unpin()` method that resets state
        * Reworked the `elementTop` property to be the top offset value on page load and added `initialTop` to be the CSS defined top value
        * Fixed a bug where `initialTop` would be set to `NaN`
        * Fixed a bug where elements at the very top would pin immediately instead of waiting for scroll
        * Fixed a bug regarding scroll top and `fixed` elements

## 2.1.5 ##
* Added docs for integration with build tools and task runners
* Added main/index support to all JavaScript source folders and to NPM
* Fixed an issue where certain JavaScript AMD modules were not returning the correct value

## 2.1.4 ##
* Updated to node-sass 3.0 and libsass 3.2 to solve the "invalid selector after" errors
* Updated and fixed minor documentation issues

## 2.1.3 ##
* Added responsive and fluid media support with the `.fluid-media` class
* Removed `outline: none` styles to encourage browser default focus outlines
* Components
    * Flyout, Popover, Tooltip, TypeAhead
        * Will now automatically hide when the window is resized

## 2.1.2 ##
* Updated NPM packages and improved Gulp workflow
* Components
    * Grid
        * Fixed an issue where `.end` capping would not work correctly on collapsed columns
    * Modal, OffCanvas, Showcase
        * Fixed an issue where `stopScroll` would not work on mobile devices

## 2.1.1 ##
* Components
    * Grid
        * Updated gutter to use adjacent CSS selectors instead of `:last-child`
    * OffCanvas
        * Changed `translate3d()` to `translate()` to add basic support for IE9

## 2.1.0 ##
This minor release includes flexbox functionality, RTL integration, improved BEM support, and much more.

* Added the Flex component which supports flexbox based grids and layouts
* Added right-to-left (RTL) support for all CSS and JS components
* Added Travis CI integration for automatic build and testing
* Added a Sass module exporting system
* Improved BEM support on all JS components
* Updated all JS templates to support functions for lazy-loaded rendering
* Sass
    * Added `$text-direction` variable
    * Added `export()`, `ltr()`, and `rtl()` mixins
    * Added `gutter()` and `span-width()` functions
    * Renamed `$vendor-prefix` to `$namespace`
    * Renamed `remove-selector-char()` to `remove-selector()`
* JavaScript
    * Toolkit
        * Added `isRTL` flag for detecting RTL support
        * Added `bemSeparators` property for customizing BEM separators
        * Added `bem()` function for generating BEM CSS class names
        * Added `buildTemplate()` function for converting strings into usable templates
        * Added `wrapperTemplate` option
        * Renamed `create()` function to `createPlugin()`
        * Renamed `vendor` property to `namespace`
    * Base
        * Removed the `runtime` property
* Components
    * Component
        * Split the `Component` class into 3 classes with different roles: 
            `Component` for embedded elements, `TemplateComponent` for templates rendered into elements, 
            and `CompositeComponent` which is a collection of rendered elements
        * Moved `elements` and `nodes` properties to `CompositeComponent`
        * Moved `createElement()` method to `TemplateComponent`
        * Added `render()` for converting templates into elements
        * Removed the `created` property
    * Drop
        * Updated to extend the `CompositeComponent`
        * Added the menu and node as arguments to the `hiding` and `showing` events
        * Removed the `hideOpened` option (will happen automatically now)
    * Flex
        * Added `flex-span()` function
        * Added `flex-region()`, `flex-region-align()`, `flex-region-orientation()`, `flex-region-wrap()`, `flex-block()`, `flex-block-align()`, `flex-block-order()`, `flex-block-grow()`, and `flex-block-shrink()` mixins
        * Added 17 `$flex-*` variables
    * Flyout
        * Updated to extend the `CompositeComponent`
        * Added a `wrapperClass` option
        * Renamed the `current` property to `url`
        * Renamed the `menus` property to `elements`
        * Renamed the `.push-left` class to `.push-opposite`
        * Refactored `_buildMenu()` to handle the composite functionality
        * Removed the `isVisible()`, `_getMenu()`, and `_getTarget()` methods
    * Grid
        * Renamed `grid-gutter()` to `gutter()`
    * LazyLoad  
        * Renamed the `elements` property to `items`
    * Modal
        * Updated to extend the `TemplateComponent`
    * Popover
        * Added a `wrapperClass` option
        * Removed the `elementHead` and `elementBody` properties
    * Responsive
        * Moved the `.fluid` class to the base CSS
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
