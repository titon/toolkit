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
* Rename Tabs to Tab.
* Remove cookie dependency.

### 2.0.0 ###
* Remove the MooTools port.
* Remove CSS dependencies from the JS layer, use the DOM (classes vs attributes, semantic tags).
* Make CSS class names customizable.
* Move CSS component styles into mixins, that are inherited into classes.
* Use :: pseudo element syntax.
* Drop IE8 support and upgrade to jQuery 2.
* Replace examples with unit tests.
* Update to use AMD/requirejs.
* Switch to Gulp.
* Updated to Sass 3.3 (maps for settings).
* Refactor events for before/after conditions.
* RTL support.
* Take Google fundamentals into consideration - https://developers.google.com/web/fundamentals/

### 3.0.0 ###
* Remove jQuery dependency and go straight vanilla?
* Switch to Less (removes sass/compass/ruby dependencies).
* Implement custom elements / components - http://w3c.github.io/webcomponents/explainer/
* Separate component transitions into a stand alone layer that can be used anywhere.
* Use `calc()` in CSS.

### Components ###
* Dialog - A component that prompts the user for an action. Sister to the modal component.
* Guide - A component that displays introduction guides (popovers) in a sequential order. Useful for show casing new features and functionality.
* Flex - A grid component that uses flex box instead of floats.

### Behaviors ###
* Form Validator - Provides form validation.
* Data Binding - Provides 2 way data binding.
* Drag & Drop - Provides a drag and drop system.
* Move Lazy Load to behaviors.