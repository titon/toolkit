# Changelog #

Older versions can be found in the documentation changelogs.

### 1.2.0 ###
This update includes documentation for all components.

* Added `isRetina` to the `Toolkit` flags
* Added `join-classes()` mixin
* Added `grunt production` command to compress for production purposes
* Updated `grunt` command to not compress for development purposes
* Updated `$.fn.positionTo()` to re-position if the element falls outside the viewport
* Replaced `currentIndex` with `index` in all components
* Removed `content-spacing()` mixin
* Removed global `previousIndex` properties
* Removed global `loadingMessage` and `errorMessage` options. Will all use the messages found in `Toolkit`
* Removed automatic setting of `animation` and `className` CSS classes for embedded elements
* Blackout
    * Added a `shown` argument to the `show` event
    * Added `showLoader` and `hideLoader` events
    * Renamed `loaderMessage` option to `loadingMessage`
* Button
    * Added outline none to `:focus` styles
* Button Group
    * Removed `!important` from negative margin properties
* Drop
    * Added support for drops built with `ol`
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
    * Fixed a bug where hidden images were being loaded
    * Renamed `data-lazyload` to `data-src`
    * Added `data-src-retina` support
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
* Pin
    * Fixed a bug where `.is-pinned` was not being removed
* Progress
    * Fixed shape issues with multiple bars
    * Removed `.medium` size
    * Refactored state classes
* Responsive
    * Added `.fluid` class for images, audio, canvas, etc
* Showcase
    * Updated options to be inheritable at runtime through the activating node
    * Replaced `a` with `button`
* Stalker
    * Added nested marker support
    * Removed `marker` and `target` properties
* Table
    * Moved zebra-striping into an `.is-striped` class
* Tabs
    * Renamed `sectionsElement` option to `sectionElement`
* Tooltip, Popover
    * Added `$popover-tooltip-animation` to filter the animations in the CSS output
    * Added `$popover-arrow-width` and `$tooltip-arrow-width` to alter the arrow sizes
    * Fixed a bug where node was being set and used incorrectly
    * Fixed a bug with mouseleave events
    * Options `className` and `position` are added and removed dynamically each reveal
    * Updated options to be inheritable at runtime through the activating node
    * Removed `slide-in` animation