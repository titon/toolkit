# Toolkit Roadmap #

All releases will contain bug fixing and polishing for current features.

### 1.5.0 ###
* Add more features support to Carousel.
    * Use pixels instead of percentages for transitions.
    * Add support for multiple items displayed at once.
    * Add support for variable amount of items being cycled at once.
    * Add support for infinite scrolling (move items around).
* Add deferred/promise integration.
* Make nested menus expandable on touch devices (drop).
* Remove cookie dependency?

### 2.0.0 ###
* Remove the MooTools port.
* Drop IE8 support and upgrade to jQuery 2.
* Replace examples with unit tests.
* Updated to use AMD.
* Switch to Gulp.
* Updated to Sass 3.
* Refactor events for before/after conditions.
* RTL support.

### 3.0.0 ###
* Remove jQuery dependency and go straight vanilla?
* Switch to Less (removes sass/compass/ruby dependencies).
* Implement custom elements / components - http://w3c.github.io/webcomponents/explainer/
* Separate component transitions into a stand alone layer that can be used anywhere.
* Use `calc()` in CSS.

### Components ###
* Dialog - A component that prompts the user for an action. Sister to the modal component.
* Guide - A component that displays introduction guides (popovers) in a sequential order. Useful for show casing new features and functionality.