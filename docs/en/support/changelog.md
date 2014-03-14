# Changelog #

## 1.2.0 ##
This minor release includes thorough documentation for all components,
a refactored event binding and management layer, a data attribute option inheritance layer,
and an optimization and cleanup pass. Also bug fixes.

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
    * Instantiation will need to be set on a container instead of the items being loaded
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
* TypeAhead
    * Renamed `process()` to `source()`

## 1.1.0 ##
This minor release includes 2 new components, a rewritten jQuery class layer, improved swipe events,
a major rewrite to the Input component, and a many more bug fixes, improvements, and additions.

* Added a `Loader` component - displays loading animations using purely CSS
* Added a `Mask` component - masks an element with a transparent overlay
* Added a `clickout` event type that triggers when a click happens outside of an element
* Added `reset-list()` and `position-center()` mixins
* Added no conflict resolution through a component creation method
* Added a `--demo` parameter to Grunt that builds files for demo purposes
* Improved the Grunt build process
* Refactored `debounce()` and `throttle()` methods
* Replaced Toolkit `ie8` and `ie9` flags with `hasTransition` feature flag
* Renamed `Titon.js` to `Toolkit.js`
* jQuery
    * Prototype inheritance has been rewritten and improved
    * New properties `component` and `version` have been added to all components
    * Namespaced element events are now triggered in the format of `<event>.toolkit.<component>`
    * Added `$.cookie()` and `$.removeCookie()` methods
    * Added `swipe`, `swipeleft`, `swiperight`, `swipeup`, and `swipedown` event types for touch devices
* Component
    * Added `process()` to handle non-HTML AJAX responses
    * Added `onProcess` option event
    * Updated `requestData()` to call `position()` for HTML responses and `process()` for non-HTML
    * Updated `requestData()` to accept an object of options as the 1st argument
    * Updated `fireEvent()` to trigger namespaced element events (jQuery only)
* Accordion
    * Renamed `.accordion-head` to `.accordion-header`
    * Renamed `.accordion-handle` to `.accordion-section`
    * Renamed `contentElement` option to `sectionElement`
* Blackout
    * Rewritten to be a singleton to differ from the new `Mask` component
    * Added `Loader` support for in-between states
    * Added `showLoader()` and `hideLoader()` methods that toggle the loader
    * Added `Toolkit.Blackout.factory()` to return the single instance
    * Added a `count` property that records how many times the blackout has been opened to allow for multiple components to display
    * Added a `loader` option that determines which loader class to render
    * Added a `loaderMessage` option that displays a loading message while the blackout is loading
    * Added a `waveCount` option that determines how many bars to display in wave loaders
* Dropdown
    * Renamed component to `Drop`
    * Renamed modifiers to `drop--down`, `drop--up`, `drop--left`, and `drop--right`
    * Replaced alignment classes with a single `reverse-align` class
* Grid
    * Added an `.end` class that can be used on the last `.col` for justification
    * Updated `$grid-columns-medium` from 8 to 9
* Input
    * Has been split up into 3 sub-components: `Radio`, `Checkbox`, and `Select`
    * Added new jQuery methods `radio()`, `checkbox()`, and `select()` (primary `input()` method still exists and triggers all 3)
    * Added custom drop down support that replaces the native drop downs (requires the `Drop` component)
    * Added multiple select support (only possible when native is disabled)
    * Added a `copyClasses` option that will copy classes from the form element to the custom one
    * Added a `native` option that opens native drop downs instead of custom drop downs
    * Added a `hideFirst` option that hides the first select option
    * Added a `hideSelected` option that hides the currently selected option
    * Added a `multipleFormat` option that describes the label format for multi-selects
    * Added a `countMessage` option that defines the message to use when format is count
    * Added a `listLimit` option that limits the number of items in the multiple message
    * Added a `arrowContent` option that renders the contents of a select arrow
    * Added a `getDefaultLabel` option that displays the default label for multi-selects
    * Added a `getOptionLabel` option that displays custom titles for options
    * Added a `getDescription` option that allows for option descriptions
* Modal
    * Multiple modals can now be opened at the same time (requires separate modal instances)
    * Added file uploading support for form submissions (requires the browser `FormData` API)
    * Added a `stopScroll` option that freezes the scrollbar while the modal is open
    * Refactored to handle the `Blackout` changes
    * Removed the `showLoading` option in favor of the `Blackout` loader
* Showcase
    * Added a `stopScroll` option that freezes the scrollbar while the showcase is open
    * Refactored to handle the `Blackout` changes
    * Updated gutter detection to include the showcase padding
* Popover & Tooltip
    * Fixed a bug where the title was not being displaying during an AJAX load
    * Added a `loadingMessage` option to use during AJAX loading
    * Updated default `position` to `topCenter`
* TypeAhead
    * Added `cycle` event

## 1.0.5 ##
* Added `composer.json` allowing the project to be installed via Composer
* Fixed a prototype inheritance bug that caused Popovers to trigger Tooltips that capture all click events
* Updated `hover` modes to default to click on touch devices; will pass-through to anchor link on second click

## 1.0.4 ##
* Added `.vertical-center` class
* Added `!important` to Responsive display properties
* Changed `.arrow` classes to use the `bigtriangleup` entity
* Removed Responsive conditionals to allow all classes
* Updated `pre code` to display block

## 1.0.3 ##
* Changed default Tooltip position to `topCenter`
* Removed `stopPropagation()` calls

## 1.0.2 ##
* Changed bower package name
* Fixed Modal not loading the correct content
* Updated MooTools to not use <code>$</code> functions

## 1.0.1 ##
* Added variables for prefixing classes with vendor names and state prefixes
* Added missing Input component to manifest
* Fixed incorrect methods being called in jQuery Modal
* Fixed a Modal bug where switching between AJAX and DOM loading caused issues
* Updated Matrix deferred loading to render immediately if no images are found
* Updated Modal target reading by swapping href to last

## 1.0.0 ##
* Released! Aww yiisss
