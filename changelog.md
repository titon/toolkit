# Changelog #

Older versions can be found in the documentation changelogs.

## 2.0.0 ##

* Dropped MooTools support
* Dropped IE8 support
* Updated all component CSS class names to use Sass variables for more configuration control
* Updated all CSS modifiers to not use `@extend` to reduce CSS output (requires full class declarations now)
* Updated `:before` and `:after` pseudo elements to use double colon `::` syntax
* Updated `$size-*` and `$shape-*` variables to be prefixed by default with a `.`
* Removed `$.cookie()` and `$.removeCookie()` methods (use a third-party instead)
* Removed `is-active()`, `is-disabled()`, and `is-*()` state mixins