# Guideline #

A quick guideline and checklist for implementing Toolkit library items.

## 1) Imports ##

Imports at the top of each module should be grouped using the rules listed below, with each group being ordered alphabetically. All module paths should be relative unless explicitly imported from an NPM module.

* Named Imports
    * React
        * `Children` and `PropTypes` should be dereferenced
    * ReactDOM
    * Enzyme
        * `shallow`, `mount`, and `render` should be dereferenced
    * Titon
    * Classes, Components
    * Functions, Decorators
    * Constants
* Wildcard Imports
* Nameless Imports

## 2) Components ##

* Event handler methods must begin with `handleOn`.
* Event listener properties must begin with `on`, so that they can be triggered through `emitEvent()` or `handleEvent()`.
* Must have a `className` property which allows the CSS class name to be customized.
* Must not touch the DOM unless highly necessary.
* Must implement ARIA attributes accordingly.

The following apply to top-level parent components.

* Must use contexts that are passed to each child.
    * Must have a `uid` field.
* Must have a `component` property that is appended as a CSS class name.
* Must have an ID on the generated HTML element. Can easily be achieved with `Component.formatID()`.

## 3) File Structure ##

* One file per class or function.
* Folder names must be in lowercase dashed format.
* File names must match the style of the class or function name.
    * Function and non-class files use camel case.
    * Class files use pascal case.
* Related React components should be grouped within a parent folder.
    * A single parent component must be defined in a file that matches the parent folder name.
    * Context types must be defined in a `ContextTypes.js` file.
    * An `index.js` file must be defined that provides exports for all default and child components.
        * Child components must be [namespaced](https://facebook.github.io/react/docs/jsx-in-depth.html#namespaced-components) onto the parent component.
        * Context types should also be namespaced onto the parent component as `CONTEXT_TYPES`.
    * An `index.scss` file can be defined that provides CSS styles for the component in question.


