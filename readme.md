# Titon v0.0.0 #

Titon, built on MooTools, is a collection of very powerful user-interface components and utility classes.
Each component represents encapsulated HTML, CSS and JS functionality for role specific page elements.

Titon makes use of the latest and greatest technology. This includes CSS3 for animation (fade, slide, etc),
Sass for CSS pre-processing, Grunt for task and package management, and Intern for unit testing.

#### Requirements ####
* **MooTools 1.4**
* Core
* More/Class.Binds
* More/Element.Measure
* More/Elements.From
* More/Hash
* More/Locale
* More/Drag (optional: Modal)
* More/Array.Extras (optional: Flyout)
* More/Element.Position (optional: Modal, Tooltip)
* More/Element.Event.Pseudos (optional: Tooltip)
* **CSS3**
* **HTML5**

#### Tested Against ####
* Chrome 26
* Firefox 20
* Internet Explorer 9

## Components ##

### Javascript ###
#### Modules ####
* `Accordion` - Provides collapsible support to a list of sections
* `Blackout` - Displays a transparent black element over the document
* `Flyout` - Displays nested flyout menus that appear below an element that activates it
* `Modal` - Displays dynamic modals that will display above the content
* `Popover` - Displays dynamic notification elements over an element
* `Tabs` - Provides tabbed support to an element containing navigation tabs and sections
* `Tooltip` - Displays dynamic tooltips over an element or the mouse cursor
* `TypeAhead` - Displays a list of possible options below an input while typing

#### Utilities ####
* `LazyLoad` - Provides an easy way to lazy-load images (inline and background) while scrolling
* `Pin` - Pin an element in a container that stays within the viewport while scrolling

#### Extensions ####
Titon also provides classes that build upon MooTools itself. These classes do not require the Titon library.

* `Timers` - Provides timer and interval management within the class layer
* `Cache` - Provides local and session storage within the class layer

### CSS ###
#### Effects ####
* `Animations` - CSS3 transitions for specific animations: fade, slide, etc
* `Visual` - Provides visual aesthetics like gloss and glare over elements

#### UI ####
* `Alert` - Styles for block level notification messages
* `Button` - Styles for generic cross-browser compatible buttons
* `ButtonGroup` - Allows for the grouping of multiple buttons into 1 visual styled button
* `Icon` - Allows for inline image sprites to be used at 12, 16, 24, 32, 64 sizes
* `Label` - Styles for inline tag labels
* `Badge` - Styles for inline notification bubbles
* `Pagination` - Styles for pagination lists