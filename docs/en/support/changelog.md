# Changelog #

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

## 2.0.2 ##
* Updates and fixes for documentation.

## 2.0.1 ##
* Removed the grid placeholders `%row` and `%col` as they would be included in the CSS output multiple times (use the mixins instead)
* Removed `grid` as a dependency for the `form` component

## 2.0.0 ##
This major release includes a rewritten class, event, hooks, and component layer. 
It improves overall tooling, drops out dated technologies, introduces new concepts, and more. 
Check out the release update for more information.

* Dropped MooTools support
* Dropped IE8 support
* Upgraded to jQuery 2
* Upgraded to Gulp from Grunt
* Upgraded to libsass over Ruby Sass
* Upgraded to Sass 3.4 and Compass 1.0
* Upgraded to RequireJS for JS dependency management and compilation
* Added a robust namespacing system which allows components to be nested within each other
* Added unit tests for all components through Mocha, Chai, and PhantomJS
* Added new `horizontalresize` and `verticalresize` events
* Decoupled the CSS and JS layers so that CSS classes (excluding states) are no longer hardcoded
* Refactored components to make more use of templates for DOM building
* Renamed most instances of the word "component" to "plugin" to differentiate between components and behaviors,
    with plugins being a top-level grouping of everything
* Renamed `--components` to `--plugins` in the Gulp command line
* Removed themes
* Sass
    * Added `$enable-small-size` and `$enable-large-size` to toggle size classes in CSS output
    * Added `$enable-all-effects`, `$enable-all-modifiers`, and `$enable-all-animations` for easier styling
    * Added `$breakpoint-range-xsmall`, `$breakpoint-range-small`, `$breakpoint-range-medium`, `$breakpoint-range-large`,
        and `$breakpoint-range-xlarge` for responsive range breakpoints
    * Added `$bem-element-separator` and `$bem-modifier-separator` to control the BEM class conventions
    * Added `class-name()` and `bem()` for building CSS class names
    * Added `full-screen()` mixin for full screen fixed positioning
    * Added `in-range($range)` mixin that will accept a range of breakpoints and output the correct min/max width media query
    * Added `in-xsmall()`, `in-xlarge()`, `if-xsmall()`, and `if-xlarge()` responsive mixins
    * Fixed a bug in `join-classes()` when a class name doesn't start with a period
    * Moved `.span-*` classes from the Grid component into the shared base file
    * Updated all component CSS class names to use Sass variables for more configuration control
    * Updated all modifiers to not use `@extend` to reduce CSS output (requires full class declarations now)
    * Updated all modifiers to be toggleable through Sass variables
    * Updated `:before` and `:after` pseudo elements to use double colon `::` syntax
    * Updated `$size-*` and `$shape-*` variables to be prefixed by default with a `.`
    * Refactored effects into their respective components that can be toggled through Sass variables
    * Refactored the visual effects into modifiers for the Button component
    * Removed `is-active()`, `is-disabled()`, and `is-*()` state mixins
    * Removed `in-mobile()`, `in-tablet()`, `in-desktop()`, `if-mobile()`, `if-tablet()`, and `if-desktop()` responsive mixins
    * Removed `.arrow-*` classes
    * Removed `$breakpoint-*` variables and replaced with with range list variables
* JavaScript
    * Added a `Base` class layer that both `Component` and `Behavior` extend
    * Added a new hook layer to `Base` that replaces the instance event layer
    * Added `$.fn.toString()` which returns the elements markup as a string
    * Added a debugging layer and a new `debug` option
    * Improved the prototype inheritance layer by initializing a new class instead of extending objects
    * Refactored the class layer so that constructors are passed as a property instead of an argument
    * Refactored so that class properties are passed through an object instead of set through the constructor
    * Removed `$.cookie()` and `$.removeCookie()` methods (use a third-party instead)
    * Renamed `$.fn.addData()` to `$.fn.cache()`
    * Updated `$.fn.conceal()` to set the element to display none when the transitions is complete
    * Updated `$.fn.reveal()` to set the element to display block (or similar) before transitions occur
    * Component
        * Added `hiding`, `showing`, and `destroying` events
        * Added option groups
        * Added `namespace` property
        * Added `ns()` method for generating namespace selectors
        * Updated the `ajax` option to only be used for setting jQuery AJAX options
        * Refactored the `requestData()` method
            * Added `url`, `cache` (whether to cache in the class), and `settings` (AJAX settings) to the XHR object used by jQuery
            * Removed the `before`, `done`, and `fail` arguments
            * Moved the callbacks into `onRequestBefore`, `onRequestDone`, and `onRequestFail` methods
        * Renamed the `hide` event to `hidden`
        * Renamed the `show` event to `shown`
        * Renamed the `destroy` event to `destroyed`
        * Renamed the `component` property to `name`
        * Renamed the `doDestroy` method to `destructor`
* Components
    * Accordion
        * The active class is now applied to the header instead of the parent `li`
        * Added `calculate()` method for determining section heights
        * Removed the `jump` event
        * Renamed selectors `.accordion-header`, `.accordion-section` to `[data-accordion-header]`, `[data-accordion-section]`
    * Blackout
        * Added `loaderTemplate` and `showLoading` options for generating loader markup
        * Removed `hideLoader` and `showLoader` events
        * Removed `loader` and `waveCount` options in favor of `loaderTemplate`
        * Renamed `Toolkit.Blackout.factory()` to `Toolkit.Blackout.instance()`
    * Carousel
        * Added a `calculate()` method that triggers on load/resize to determine carousel dimensions
        * Added a `swipe` option for toggling swipe events
        * Added `cycling`, `cycled`, `jumping` and `jumped` events
        * Removed `cycle` and `jump` events
        * Renamed selectors `.carousel-items ul`, `.carousel-tabs`, `.carousel-next`, `.carousel-prev`, `.carousel-start`, `.carousel-stop` to
            `[data-carousel-items]`, `[data-carousel-tabs]`, `[data-carousel-next]`, `[data-carousel-prev]`, `[data-carousel-start]`, `[data-carousel-stop]`
        * Removed `.carousel-prev`, `.carousel-next`, and `.carousel-tabs` styles
    * Divider
        * Improved the divider to support longer strings of text and multiline text
    * Drop
        * All drop menus will now require a `data-drop-menu` attribute
    * Flyout
        * Added `headingTemplate` option
        * Renamed selectors `.flyout` to `[data-flyout-menu]`
    * Form
        * Improved disabled state across inputs
        * Normalized `fieldset` and `legend` when used in an inline form
    * Grid
        * Added new `xsmall` and `xlarge` (disabled by default) column sizes
        * Added `$grid-sizes` map for associating sizes to breakpoints and column counts
        * Added `$grid-columns-xsmall` and `$grid-columns-xlarge` for new column counts
        * Added `$grid-class-end` to change the `.end` class
        * Changed `$grid-columns-small` from `6` to `12`
        * Fixed a bug where `.push-*` and `.pull-*` classes were being generated if `$grid-push-pull` was disabled
        * Removed the `mobile`, `tablet`, and `desktop` column sizes
        * Removed `$grid-columns-mobile`, `$grid-columns-tablet`, and `$grid-columns-desktop`
    * Icon
        * Added a `$icon-sizes` list variable to control the CSS output
    * Input
        * Added a `filterClasses` option which can be used in conjunction with `copyClasses`
        * Added `template`, `checkboxTemplate`, `radioTemplate`, `selectTemplate`, `optionsTemplate`, `headingTemplate`, and `descTemplate`
        * Renamed `arrowContent` to `arrowTemplate`
        * Renamed selectors `.select-options`, `.select-label`, `.select-arrow` to
            `[data-select-options]`, `[data-select-label]`, `[data-select-arrow]`
    * Lazy Load
        * Added `loading` and `loaded` events
        * Added a `lazyClass` option that defaults to `.lazy-load`
        * Added a `timer` property
        * Fixed a bug where `shutdown` event was being called twice
        * Removed `load` event
    * Mask
        * Added `template` and `messageTemplate` options
        * Renamed `.mask-target` to `.is-maskable`
        * Renamed selectors `.mask`, `.mask-message` to `[data-mask]`, `[data-mask-message]`
    * Matrix
        * Added `appending`, `prepending`, `removing`, `rendering`, and `rendered` events
        * Improved the deferred image rendering process and item fade in animation
        * Removed `render` event
        * Updated to no longer automatically set `.matrix` on the container
    * Modal
        * Added a `clickout` option for toggling clickout events
        * IDs can now be passed as the 2nd argument to `show()`
        * Removed the `ajax` option (handled by `loadContent()`)
        * Renamed selectors `.modal-inner`, `.modal-hide`, `.modal-submit` to
            `[data-modal-content]`, `[data-modal-close]`, `[data-modal-submit]`
    * Off Canvas
        * Added a `swipe` option
        * Renamed selectors `.on-canvas`, `.off-canvas` to `[data-offcanvas-content]`, `[data-offcanvas-sidebar]`
        * Updated so that `[data-offcanvas-sidebar]` defines the default side orientation
        * Updated to no longer automatically set `.off-canvas` on the sidebar
    * Pagination
        * Updated to only support `ol` lists
    * Pin
        * Updated to have position absolute by default for `.pin`
        * Updated to no longer automatically set `.pin` on the element
    * Popover
        * Updated so that an `.is-active` class is toggled on the target node
        * Updated the `follow` attribute to `false` always
        * Removed the `delay` option
        * Renamed selectors `.popover-head`, `.popover-body` to `[data-popover-header]`, `[data-popover-content]`
    * Responsive
        * Added `.show-xsmall`, `.show-xlarge`, `.hide-xsmall`, and `.hide-xlarge` classes
        * Removed `.show-mobile`, `.show-tablet`, `.show-desktop`, `.hide-mobile`, `.hide-tablet`, and `.hide-desktop` classes
        * Removed `$responsive-size` variable
    * Showcase
        * Added a `swipe` option for toggling swipe events
        * Added a `clickout` option for toggling clickout events
        * Added `jumping` and `jumped` events
        * Removed `jump` event
        * Removed `.showcase-prev`, `.showcase-next`, and `.showcase-tabs` styles
        * Renamed selectors `.showcase-items`, `.showcase-tabs`, `.showcase-next`, `.showcase-prev`, `.showcase-hide`, `.showcase-caption` to
            `[data-showcase-items]`, `[data-showcase-tabs]`, `[data-showcase-next]`, `[data-showcase-prev]`, `[data-showcase-close]`, `[data-showcase-caption]`
    * Stalker
        * Added `activating`, `activated`, `deactivating`, and `deactivated` events
        * Removed the `applyToParent` option
        * Removed `activate` and `deactivate` events
        * Updated to no longer automatically set `.stalker`, `.stalker-target`, and `.stalker-marker`
    * Switch
        * The `.pill` and `.round` classes have moved to `.switch-bar` from `.switch`
    * Tabs
        * Has been renamed to `Tab` and all files and references have been changed
        * Option `preventDefault` now applies to both cookie and fragment persistence
        * Option `ajax` has changed to `false` by default
        * Fixed a bug trying to determine the index to show on load
        * Renamed selectors `.tab-nav`, `.tab-section` to `[data-tab-nav]`, `[data-tab-section]`
        * Updated the `is-active` state to be set on the tab, instead of the parent `li`
    * Toast
        * Added a `toastTemplate` property
        * Added a `reset()` method to reset the tooltip state
    * Tooltip
        * Removed the `ajax` option (handled by `loadContent()`)
        * Removed the `delay` option
        * Renamed selectors `.tooltip-head`, `.tooltip-body` to `[data-tooltip-header]`, `[data-tooltip-content]`
    * Type Ahead
        * Added `shadowTemplate`, `titleTemplate`, `descTemplate`, `highlightTemplate`, and `headingTemplate` options
        * The `matcher` function now accepts the item object as the 1st argument

## 1.5.3 ##
* Updated the competitor comparison
* Carousel
    * Fixed an issue where direct descendants were not being used and `ul li`s were conflicting with nested lists

## 1.5.2 ##
* Matrix
    * Added defer rendering support to items either appended or prepended
* Modal
    * Fixed a bug where DOM IDs passed to `show()` as an argument did not work
    * Removed `pointer-events` from the CSS as it caused weirdness on touch devices
    * Refactored events to handle click to close

## 1.5.1 ##
* Matrix
    * Added a `colHeights` property to track the height of each column
    * Fixed a bug where the height style was not removed when columns are reduced to 1
    * Refactored so that items are placed in the smallest height column first, instead of the next column

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

## 1.4.1 ##
* Added `opacity: 0` to `.hide` for easier fade transitions
* Improved fade transitions within all components
* Fixed a bug with swipe not working on Android
* Fixed a bug with certain elements not showing in iOS
* OffCanvas
    * Added `primary` and `secondary` properties
    * Added `stopScroll` option
* Popover, Tooltip
    * Fixed a bug where the arrow was being removed before the transition ended
* Type Ahead
    * Added `$typeAhead-transition`

## 1.4.0 ##
This minor release includes 3 new components, a new `destroy()` method,
a cleanup of element and event options, expanded documentation, and a handful of optimization improvements.

* Usage license has been updated to BSD-3 from BSD-2
* MooTools support is slowly being phased out and new components are not supported
* Added new Divider component for separating content
* Added new Off Canvas component for displaying sidebars outside the viewport
* Added new Toast component for notifying users with timed messages
* Added `.no-transition` class to disable transitions
* Added `.sr-only` class for screen readers
* Added `suppression` setting for swipe events
* Fixed a bug with `swipe` events where select dropdowns would stop working
* Fixed a bug with `swipe` events where page scrolling gets disabled
* Fixed a bug with certain fade animations
* Fixed a bug where certain Sass variables were not customizable
* Removed `$shape-square-class` Sass variable
* Removed `*Element` options (CSS classes are now hardcoded)
* Removed `*Event` options (CSS classes are now hardcoded)
* Toolkit
    * Added `toolkit(component, method, args)` support for triggering methods on the class instance
    * Added `transitionEnd` flag
    * Refactored `toolkit()` to return a single instance instead of multiple instances
    * Removed `i()` and `item()` jQuery collection methods
* Component
    * Added a `initialize()` method that is triggered within all constructors
    * Added a `destroy()` method that will unbind all events, remove elements, and delete the instance
    * Added automatic `this` scope binding to all methods on a class instance
    * Refactored `bindEvents()` with an easier lightweight syntax
* Accordion
    * Removed `headerElement`, `sectionElement` options
* Blackout
    * Fixed incorrect `.loader-spinner` class
* Carousel
    * Removed `nextButton`, `prevButton` properties
    * Removed `itemsElement`, `tabsElement`, `nextElement`, `prevElement` options
* Code
    * Added overflow scrolling for touch devices
* Flyout
    * Disabled automatically for touch devices
    * Removed `contentElement` option
* Input
    * Added `hideOpened` option to selects to hide other opened selects
    * Updated `native` option value to be `Toolkit.isTouch` by default
* Lazy Load
    * Removed `isLoaded` property
* Mask
    * Added `selector` option to bind toggle events to
    * Renamed `.maskable` to `.mask-target`
    * Removed `messageElement` option
* Modal
    * Added `$modal-mobile-breakpoint` to apply mobile widths to the modal
    * Added `submit()` method for submitting forms
    * Updated with new markup
    * Renamed `.modal-event-submit` to `.modal-submit`
    * Renamed `.modal-event-close` to `.modal-hide`
    * Removed `.modal-handle` within the template
    * Removed `elementBody` property
    * Removed `contentElement`, `closeElement`, `closeEvent`, `submitEvent` options
    * Removed `sticky-*` animations
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

## 1.3.2 ##
* Updated `clickout` events to trigger for `touchstart` events
* Button, Form
    * Reset browser specific styles, specifically in iOS
* Modal
    * Added mobile specific styles that span the width of the viewport
* TypeAhead
    * Turned off `autocapitalize`, `autocorrect`, and `spellcheck` on the input field

## 1.3.1 ##
* Updated `event.target` to `event.currentTarget` where applicable

## 1.3.0 ##
This minor release includes 2 new components, automatic ARIA support for all applicable components,
replacing Compass with autoprefixer, removal of state prefixing, and many more bug fixes and improvements.

* Added new Step component for step based navigation
* Added new Switch component for visual checkbox switches
* Added ARIA support to all components with supported documentation
* Added CSS vendor prefixing support through [autoprefixer](https://github.com/ai/autoprefixer)
* Added namespace event triggering support to the activating node
* Removed is and has state prefixing from the CSS and JS layers
* Removed `$state-is-prefix` and `$state-has-prefix` Sass variables
* Removed individual JavaScript distribution files
* Removed Compass dependency in favor of autoprefixer
* Updated to normalize.css v3.0.1
* jQuery
    * Updated `$.fn.item()` to return an empty jQuery collection if index out of range
    * Refactored the `clickout` event to support delegated elements
    * Removed `$.hyphenate()`
    * Removed event helper methods like `clickout()`, `swipeleft()`, etc
* Toolkit
    * Added `aria` property to toggle support
    * Added `aria()` collection method that can set ARIA attributes
    * Removed `Toolkit.options.isPrefix` and `Toolkit.options.hasPrefix`
    * Renamed `Toolkit.options.vendor` to `Toolkit.vendor`
    * Renamed `Toolkit.createComponent()` to `Toolkit.create()`
* Component
    * Added global `cache` option to toggle AJAX response caching
    * Added static `count` property to each component that tracks the number of instances in the page
    * Added `uid` property that represents the current instance count
    * Added `cssClass` property that represents the component name in CSS class form
    * Added `id()` method to generate unique CSS class names
    * Removed error and loading template generation from components (wasn't being used)
* Carousel
    * Fixed a bug where `swipedown` would not trigger
    * Merged `itemsElement` and `itemElement` options
    * Merged `tabsElement` and `tabElement` options
    * Removed `itemsWrapper`, `itemsList`, `tabsWrapper` properties
* Drop
    * Added a global `.drop` class that all menus require
* Grid
    * Added `%row` placeholder to extend row styles from
    * Added `%col` placeholder to extend column styles from
    * Removed `.row` (reserved now for another component)
* Modal
    * Fixed a bug where a modal opened on the same modal causes the blackout to persist
* Pin
    * Added `lock` option to disable pinning if element is taller than the viewport
    * Added `$pin-transition` variable
    * Fixed a bug where the pin element margin was not included in the total height

## 1.2.2 ##
* Added z-index variables to all applicable components for easier layering
* Fixed a bug where data attribute selectors were not being delegated to the document [[#20](https://github.com/titon/toolkit/issues/20)]
* Fixed a bug where tooltips would not show above modals [[#20](https://github.com/titon/toolkit/issues/20)]
* Fixed a bug where the blackout could be closed while the modal is loading [[#16](https://github.com/titon/toolkit/issues/16)]

## 1.2.1 ##
* Fixed a bug with `throttle()` when 0 is passed as the delay
* Pin
    * Moved `onScroll()` logic into a new `pin()` method
    * Updated to use `height()` instead of `outerHeight()` to take into account parent padding
    * Updated to trigger pinning on page load
* Type Ahead
    * Added `preventDefault()` when enter is pressed to stop form submissions
    * Fixed incorrect `cycle` and `select` events being triggered

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
* Lazy Load
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
* Type Ahead
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
* Type Ahead
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
