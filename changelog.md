# Changelog #

Older versions can be found in the documentation changelogs.

### 1.1.1 ###
* Blackout
    * Added a `shown` argument to the `show` event
    * Renamed `loaderMessage` option to `loadingMessage`
* Button Group
    * Removed `!important` from negative margin properties
* Drop
    * Added support for drops built with `ol`
* Flyout
    * Fixed a bug where data items were being mapped with no URL
    * Removed `load` event from `show()` as it was being used incorrectly