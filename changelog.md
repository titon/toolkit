# Changelog #

Older versions can be found in the documentation changelogs.

## 1.5.0 ##
This minor release includes a new responsive option, and a major overhaul of the Carousel component,
and a complete refactor of the demo system. It also marks the final minor release before the 2.0 major version.

* MooTools support is slowly being phased out and JavaScript changes have not been ported
* Added `$.fn.transitionend()` which will set a `transitionend` event if transitions have been defined on the element,
    else it will execute the callback immediately
* Added a global `responsive` component option that allows for different options to be set depending on breakpoints
* Button Group
    * Fixed a bug with incorrect button widths when the `vertical` modifier is used
* Carousel
    * Added a `container` property which is the parent element for `items`
    * Added a `animating` property that represents whether the items are currently animating
    * Added a `calculate()` method that resizes the carousel based on the window size and defined options
    * Added a `infinite` option which allows for infinite cycling in either direction
    * Added a `loop` option which rewinds the cycle pointer to the beginning or end when the opposite edge is reached
        (only applicable when `infinite` is disabled)
    * Added a `reverse` option to reverse the automatic cycle direction
    * Added a `itemsToShow` option which is used for displaying a specific number of items at once
    * Added a `itemsToCycle` option which is used as the number of items to move when a cycle occurs
    * Added a `defaultIndex` option which displays that item on initial page load
    * Added `.no-next` and `.no-prev` classes to the component to hide navigation buttons
    * Added `.carousel-stop` and `.carousel-start` as elements to delegate events to
* Matrix
    * Updated image pre-loading to use deferred promises
    * Removed `imagesLoaded` property
    * Removed `onLoad` method
* Showcase
    * Updated item cycling to use deferred promises
    * Added a `animating` property that represents whether the items are currently animating
