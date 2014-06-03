# Changelog #

Older versions can be found in the documentation changelogs.

## 1.5.0 ##
This minor release includes a new responsive option, a major overhaul of the Carousel component,
and a complete refactor of the demo system. It also marks the final minor release before the 2.0 major version.

* MooTools support is slowly being phased out and JavaScript changes have not been ported
* Added `$.fn.transitionend()` which will set a `transitionend` event if transitions have been defined on the element,
    else it will execute the callback immediately
* Added a global `responsive` component option that allows for different options to be set depending on breakpoints
* Updated `$.fn.positionTo()` to re-position accordingly when a mouse event is being used as the offset
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
    * Removed `.carousel-caption` styles
* Form
    * Added `.fields` which can be coupled with list elements to mimic `.field`
* Lazy Load
    * Fixed a bug where offsets were incorrect when the parent with overflow was not the direct parent
* Matrix
    * Fixed a bug where multiple spanning items break when the span is larger than the column count
    * Updated image pre-loading to use deferred promises
    * Removed `imagesLoaded` property
    * Removed `onLoad` method
* Pin
    * Fixed a bug where `yOffset` was not being applied for `fixed` pins
* Popover
    * Fixed a bug when no options were passed to the constructor
* Showcase
    * Updated item cycling to use deferred promises
    * Added a `animating` property that represents whether the items are currently animating
    * Fixed a bug where gutter was not being applied correctly
    * Fixed a bug where the incorrect item was being opened when a grouping is used
