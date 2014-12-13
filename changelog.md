# Changelog #

Older versions can be found in the documentation changelogs.

## 2.1.0 ##

* JavaScript
    * Base
        * Removed the `runtime` property
* Components
    * Component
        * Split the `Component` class into 3 classes with different roles: 
            `Component` for embedded elements, `TemplateComponent` for templates rendered into elements, 
            and `CompositeComponent` which is a collection of rendered elements
        * Moved `elements` and `nodes` properties to `CompositeComponent`
        * Moved `createElement` method to `TemplateComponent`
        * Removed the `created` property
    * Drop
        * Updated to extend the `CompositeComponent`
        * Added the menu and node as arguments to the `hiding` and `showing` events
        * Removed the `hideOpened` option (will happen automatically now)
    * Flyout
        * Updated to extend the `CompositeComponent`
        * Added a `wrapperClass` option
        * Renamed the `current` property to `url`
        * Renamed the `menus` property to `elements`
        * Refactored `_buildMenu()` to handle the composite functionality
        * Removed the `isVisible()`, `_getMenu()`, and `_getTarget()` methods
    * LazyLoad  
        * Renamed the `elements` property to `items`
    * Modal
        * Updated to extend the `TemplateComponent`
    * Popover
        * Added a `wrapperClass` option
    * Showcase
        * Updated to extend the `TemplateComponent`
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