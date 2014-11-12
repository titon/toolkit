# Changelog #

Older versions can be found in the documentation changelogs.

## 2.0.0 ##

* Dropped MooTools support
* Dropped IE8 support
* Upgraded to jQuery 2
* Upgraded to Gulp from Grunt
* Upgraded to Sass 3.4 and Compass 1.0
* Upgraded to RequireJS for JS dependency management and compilation
* Added a robust namespacing system which allows components to be nested within each other
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
        * Added a `swipe` option
        * Added `cycling`, `cycled`, `jumping` and `jumped` events
        * Removed `cycle` and `jump` events
        * Renamed selectors `.carousel-items ul`, `.carousel-tabs`, `.carousel-next`, `.carousel-prev`, `.carousel-start`, `.carousel-stop` to
            `[data-carousel-items]`, `[data-carousel-tabs]`, `[data-carousel-next]`, `[data-carousel-prev]`, `[data-carousel-start]`, `[data-carousel-stop]`
        * Removed `.carousel-prev`, `.carousel-next`, and `.carousel-tabs` styles
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
        * IDs can now be passed as the 2nd argument to `show()`
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
        * Updated to no longer automatically set `.pin` on the element
    * Popover
        * Updated so that an `.is-active` class is toggled on the target node
        * Updated the `follow` attribute to `false` always
        * Removed the `delay` option
        * Renamed selectors `.popover-head`, `.popover-body` to `[data-popover-header]`, `[data-popover-content]`
    * Responsive
        * Added `.show-xsmall`, `.show-xlarge`, `.hide-xsmall`, and `.hide-xlarge` support
        * Removed `.show-mobile`, `.show-tablet`, `.show-desktop`, `.hide-mobile`, `.hide-tablet`, and `.hide-desktop` classes
        * Removed `$responsive-size` variable
    * Showcase
        * Added a `swipe` option
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
        * Removed the `delay` option
        * Renamed selectors `.tooltip-head`, `.tooltip-body` to `[data-tooltip-header]`, `[data-tooltip-content]`
    * Type Ahead
        * Added `shadowTemplate`, `titleTemplate`, `descTemplate`, `highlightTemplate`, and `headingTemplate` options
        * The `matcher` function now accepts the item object as the 1st argument
