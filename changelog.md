# Changelog #

Older versions can be found in the documentation changelogs.

## 1.3.0 ##

* Removed is and has state prefixing from the CSS and JS layers
    * Removed `$state-is-prefix` and `$state-has-prefix`
    * Removed `Toolkit.options.isPrefix` and `Toolkit.options.hasPrefix`
* Removed error and loading template generation from components (wasn't being used)
* Removed `$.hyphenate()`
* Renamed `Toolkit.options.vendor` to `Toolkit.vendor`
* Renamed `Toolkit.createComponent()` to `Toolkit.create()`