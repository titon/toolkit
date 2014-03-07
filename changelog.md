# Changelog #

Older versions can be found in the documentation changelogs.

### 1.2.0 ###
This update includes documentation for all components.

* Blackout
    * Added a `shown` argument to the `show` event
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
* Icon
    * Removed `.icon--rotate`
* Input
    * Updated build methods to be private
    * Fixed an issue where select event names were incorrect
* Input Group
    * Added small and large size support
* LazyLoad
    * Fixed a bug where hidden images were being loaded
* Loader
    * Renamed `.spinner` to `.loader-spinner`
* Matrix
    * Replaced `.matrix-item` with `li`
    * Removed `selector` option
    * Removed inline `img` styles, use `.fluid` instead
* Modal
    * Updated `.modal-close` to use a `button`
* Pin
    * Fixed a bug where `.is-pinned` was not being removed
* Progress
    * Fixed shape issues with multiple bars
    * Removed `.medium` size
    * Refactored state classes
* Responsive
    * Added `.fluid` class for images, audio, canvas, etc
* Showcase
    * Replaced `a` with `button`
* Stalker
    * Added nested marker support
    * Removed `marker` and `target` properties
* Table
    * Moved zebra-striping into an `.is-striped` class
* Tabs
    * Renamed `sectionsElement` option to `sectionElement`