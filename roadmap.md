# Toolkit Roadmap #

All releases will contain bug fixing and polishing for current features.

### 1.4.0 ###
* Off Canvas - A component for displaying side menus off the canvas (viewport). Useful for sliding mobile navigations.
* Marquee - A component that displays multiple slides at once and allows for cycling through a variable amount. A sister component to the carousel.
* Divider - A component for dividing content horizontally or vertically.
* Add destroy method to clean up and remove the component.

### 1.5.0 ###
* Dialog - A component that prompts the user for an action. Sister to the modal component.
* Toast - A component to display toast notifications.
* Guide - A component that displays introduction guides (popovers) in a sequential order. Useful for show casing new features and functionality.
* Add deferred/promise integration.

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
* Switch to Less (removes sass/compass/ruby dependencies)
* Implement custom elements / components - http://w3c.github.io/webcomponents/explainer/
* Separate component transitions into a stand alone layer that can be used anywhere.