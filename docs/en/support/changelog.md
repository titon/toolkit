# Changelog #

### 1.1.0 ###
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

### 1.0.5 ###
* Added `composer.json` allowing the project to be installed via Composer
* Fixed a prototype inheritance bug that caused Popovers to trigger Tooltips that capture all click events
* Updated `hover` modes to default to click on touch devices; will pass-through to anchor link on second click

### 1.0.4 ###
* Added `.vertical-center` class
* Added `!important` to Responsive display properties
* Changed `.arrow` classes to use the `bigtriangleup` entity
* Removed Responsive conditionals to allow all classes
* Updated `pre code` to display block

### 1.0.3 ###
* Changed default Tooltip position to `topCenter`
* Removed `stopPropagation()` calls

### 1.0.2 ###
* Changed bower package name
* Fixed Modal not loading the correct content
* Updated MooTools to not use <code>$</code> functions

### 1.0.1 ###
* Added variables for prefixing classes with vendor names and state prefixes
* Added missing Input component to manifest
* Fixed incorrect methods being called in jQuery Modal
* Fixed a Modal bug where switching between AJAX and DOM loading caused issues
* Updated Matrix deferred loading to render immediately if no images are found
* Updated Modal target reading by swapping href to last

### 1.0.0 ###
* Released! Aww yiisss
