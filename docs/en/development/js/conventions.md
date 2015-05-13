# Conventions #

While the Sass & CSS layers use the BEM naming convention, the JavaScript layer adheres to the following conventions. These conventions should be adhered to when submitting pull requests.

Classes
* Should be in capitalized camel case form: `FooBar`
* Should extend the `Toolkit.Class` prototype (or a sub-class)

Methods and Properties
* Should be in camel case form: `fooBar()`
* Should be prefixed with `_` when used internally and not be publicly available: `_fooBar()`

Methods
* Should be prefixed with `on` when used as an event handler / callback: `onFooBar(e)`
* Should, for the most part, be written in verb / action form
* Getters and setters should be separate
