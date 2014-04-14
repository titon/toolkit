# Changelog #

Older versions can be found in the documentation changelogs.

## 1.4.0 ##
This minor release includes 3 new components, a new `destroy()` method,
a cleanup of element and event options, and a handful of documentation and optimization improvements.

* Added new Divider component for separating content
* Added new Off Canvas component for displaying sidebars outside the viewport
* Added new Toast component for notifying users with timed messages
* Added `.no-transition` class
* Fixed a bug with `swipe` events where select dropdowns would stop working
* Fixed a bug with `swipe` events where page scrolling gets disabled
* Fixed a bug where certain Sass variables were not customizable
* Removed `$shape-square-class` Sass variable
* Removed `*Element` options (CSS classes are now hardcoded)
* Removed `*Event` options (CSS classes are now hardcoded)
* Toolkit
    * Added `toolkit(component, method, args)` support for triggering methods on the class instance
    * Refactored `toolkit()` to return a single instance instead of multiple instances
* Component
    * Added a `initialize()` function that is triggered within all constructors
    * Added a `destroy()` method that will unbind all events, remove elements, and delete the instance
    * Added automatic scope binding to all methods on a class instance
    * Refactored `bindEvents()` with an easier lightweight syntax
* Accordion
    * Removed `headerElement`, `sectionElement` options
* Carousel
    * Removed `nextButton`, `prevButton` properties
    * Removed `itemsElement`, `tabsElement`, `nextElement`, `prevElement` options
* Flyout
    * Disabled automatically for touch devices
    * Removed `contentElement` option
* Input
    * Added `hideOpened` option to selects to hide other opened selects
* Lazy Load
    * Removed `isLoaded` property
* Mask
    * Added `selector` option
    * Renamed `.maskable` to `.mask-target`
    * Removed `messageElement` option
* Modal
    * Added `$modal-mobile-breakpoint` to apply mobile widths to the modal
    * Renamed `.modal-event-submit` to `.modal-submit`
    * Renamed `.modal-event-close` to `.modal-hide`
    * Removed `elementBody` property
    * Removed `contentElement`, `closeElement`, `closeEvent`, `submitEvent` options
* Popover, Tooltip
    * Removed `titleElement`, `contentElement` options
* Showcase
    * Updated with new markup
    * Renamed `.showcase-event-prev` to `.showcase-prev`
    * Renamed `.showcase-event-next` to `.showcase-next`
    * Renamed `.showcase-event-close` to `.showcase-hide`
    * Renamed `.showcase-event-jump` to `.showcase-tabs a`
    * Removed `nextButton`, `prevButton` properties
    * Removed `transition`, `itemsElement`, `tabsElement`, `prevElement`, `nextElement`,
        `closeEvent`, `jumpEvent`, `prevEvent`, `nextEvent` options
* Tabs
    * Removed `navElement`, `sectionElement` options
* Type Ahead
    * Removed `contentElement` option