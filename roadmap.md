# Toolkit Roadmap #

All releases will contain bug fixing and polishing for current features.

### 2.0.0 ###
* Remove CSS dependencies from the JS layer, use the DOM (classes vs attributes, semantic tags).
* Move CSS component styles into mixins, that are inherited into classes.
* Replace examples with unit tests.
* Refactor events for before/after conditions.
* RTL support.
* Add debug option.
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