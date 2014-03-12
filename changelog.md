# Changelog #

Older versions can be found in the documentation changelogs.

### 1.2.0 ###
This update includes documentation for all components.

* Added `join-classes()` function
* Added `grunt production` command to compress for production purposes
* Updated `grunt` command to not compress for development purposes
* Renamed all `__*` methods to `on*`
* Renamed `currentIndex` to `index` in all components
* Removed `content-spacing()` mixin
* Removed `previousIndex` properties
* Removed `loadingMessage` and `errorMessage` options
* Removed `.medium` class support
* Removed automatic setting of `animation` and `className` CSS classes for embedded elements
* Removed background and font colors from CSS to reduce CSS filesize
* Toolkit
    * Added `bound()` to bound a number
    * Added `isRetina` flag
    * Updated `positionTo()` to re-position if the element falls outside the viewport
* Component
    * Refactored that event management layer within all components
    * Added `bindEvents()` to handle event attaching and detaching (paired with change above)
        * Called automatically from `enable()` and `disable()`
    * Added option inheritance from data attributes found on target elements and nodes
        * Possible through new `inheritOptions()`
    * Added option inheritance from parent component
    * Added `readOption` to find an option via data attribute of option object
    * Merged `setElement()` logic into `createElement()`
    * Removed `setElement()`
* Accordion
    * Updated `show` event arguments to `[section, node, index]`
* Base
    * Added `.no-scroll`
    * Removed `.inline`, `.inline-block`, `.static`, `.relative`, and `.absolute`
* Blackout
    * Added a `shown` argument to the `show` event
    * Added `showLoader` and `hideLoader` events
    * Renamed `loaderMessage` option to `loadingMessage`
* Button
    * Added outline none to `:focus` styles
    * Fixed a bug with `input` buttons
* Button Group
    * Removed `!important` from negative margin properties
* Drop
    * Added support for drops built with `ol`
    * Updated `show` and `hide` event arguments to `[element, node]`
* Flyout
    * Fixed a bug where data items were being mapped with no URL
    * Removed `load` event from `show()` as it was being used incorrectly
* Form
    * Renamed `.is-legendless` to `.no-legend`
    * Cleaned up some basic styles
* Grid
    * Changed `$grid-columns-medium` to 12
    * Added `$grid-push-pull` to toggle push and pull classes in output
* Icon
    * Removed `.icon--rotate`
* Input
    * Updated build methods to be private
    * Fixed an issue where select event names were incorrect
* Input Group
    * Added small and large size support
* LazyLoad
    * Added `data-src-retina` support
    * Added support for lazy loading within an overflown element
    * Fixed a bug where hidden images were being loaded
    * Renamed `data-lazyload` to `data-src`
* Loader
    * Renamed `.spinner` to `.loader-spinner`
* Matrix
    * Replaced `.matrix-item` with `li`
    * Removed `selector` option
    * Removed inline `img` styles, use `.fluid` instead
* Modal
    * Added `$modal-animation` to filter the animations in the CSS output
    * Updated `.modal-close` to use a `button`
    * Updated `ajax` and `getContent` options to be inheritable at runtime through the activating node
    * Refactored markup and CSS to support large height modals
    * Removed `flip` and `flip-vert` animations
    * Removed dragging (temporarily)
* Pin
    * Fixed a bug where `.is-pinned` was not being removed
* Popover & Tooltip
    * Added `$popover-tooltip-animation` to filter the animations in the CSS output
    * Added `$popover-arrow-width` and `$tooltip-arrow-width` to alter the arrow sizes
    * Added automatic compatibility of `title` attributes
    * Fixed a bug where node was being set and used incorrectly
    * Fixed a bug with mouseleave events
    * Options `className` and `position` are added and removed dynamically each reveal
    * Updated options to be inheritable at runtime through the activating node
    * Updated `position` values to be dashed instead of camel case
    * Removed `slide-in` animation
* Progress
    * Added multiple progress bar support
    * Removed `.medium` size
    * Refactored state classes
* Responsive
    * Added `.fluid` class for images, audio, canvas, etc
* Showcase
    * Updated options to be inheritable at runtime through the activating node
    * Replaced `a` with `button`
* Stalker
    * Added nested marker support
    * Added `targetBy` and `markBy` options
    * Removed `marker` and `target` properties
* Table
    * Moved zebra-striping into an `.is-striped` class
* Tabs
    * Renamed `sectionsElement` option to `sectionElement`