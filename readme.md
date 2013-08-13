# Titon v0.4.0 #

Titon, built on MooTools, is a collection of very powerful user-interface components and utility classes.
Each component represents encapsulated HTML, CSS and JS functionality for role specific page elements.

Titon makes use of the latest and greatest technology. This includes CSS3 for animation (fade, slide, etc),
Sass for CSS pre-processing, Grunt for task and package management, and Intern for unit testing.

#### Requirements ####
* **HTML5**
* **CSS3**
* **MooTools 1.4** (for JS components)
	* Core
	* More/Class.Binds
	* More/Elements.From
	* More/Element.Shortcuts
	* More/Hash
	* More/Locale
	* More/Drag (optional: Modal)
	* More/Array.Extras (optional: Flyout)
	* More/Element.Position (optional: Tooltip)
	* More/Element.Event.Pseudos (optional: Tooltip)

#### Tested Against ####
* Chrome 26
* Firefox 20
* Internet Explorer 9

## Javascript Components ##
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
* `Toggle` - Toggles the display of a target element; useful for triggering transitions

#### Extensions ####
Titon also provides classes that build upon MooTools itself. These classes do not require the Titon library.

* `Timers` - Provides timer and interval management within the class layer
* `Cache` - Provides local and session storage within the class layer

## CSS Components ##
#### Layout ####
* `Base` - Provides utility and helper classes
* `Code` - Styles for code blocks
* `Form` - Allows for vertical, horizontal and inline forms; also provides default styles
* `Grid` - Implements a fluid 12 column grid system that uses flexbox
* `InputGroup` - Allows for the grouping of inputs with buttons and static blocks
* `Responsive` - Responsive classes for mobile, tablet and desktop resolutions
* `Table` - Styles for tables
* `Typography` - Resets and default styles for typography

#### UI ####
* `Alert` - Styles for block level notification messages
* `Breadcrumbs` - Styles for bread crumb navigation trails
* `Button` - Styles for generic cross-browser compatible buttons
* `ButtonGroup` - Allows for the grouping of multiple buttons into 1 visual styled button
* `Dropdown` - Allows for toggleable dropdown menus with support for nested menus
* `Icon` - Allows for inline image sprites to be used at 12, 16, 24, 32, and 64 sizes
* `Label` - Styles for inline tag labels
* `Badge` - Styles for inline notification bubbles
* `Pagination` - Styles for pagination lists
* `Pin` - Animations for element pinning

#### Themes ####
* `Titon` - Titon specific theme that mimics Twitter Bootstrap
* `TomorrowNight` - Tomorrow Night theme for all Titon components

## Authors ##
* Miles Johnson - https://github.com/milesj

#### Third Party ####
* `Normalize.css` provided by Nicolas Gallagher
* `Iconic` icon set provided by P.J. Onori