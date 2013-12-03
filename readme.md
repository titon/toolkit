'''
                 ______  ______  ______  __      __  __   __  ______
                /\__  _\/\  __ \/\  __ \/\ \    /\ \/ /  /\ \/\__  _\
                \/_/\ \/\ \ \/\ \ \ \/\ \ \ \___\ \  _'-.\ \ \/_/\ \/
                   \ \_\ \ \_____\ \_____\ \_____\ \_\ \_\\ \_\ \ \_\
                    \/_/  \/_____/\/_____/\/_____/\/_/\/_/ \/_/  \/_/
'''

# Toolkit v1.0.0 RC3 #

Titon Toolkit is a collection of very powerful user interface components and utility classes.
Each component represents encapsulated HTML, CSS and JS functionality for role specific page elements.

Titon makes use of the latest and greatest technology. This includes CSS3 for animation (fade, slide, etc),
Sass for CSS pre-processing, and Grunt for task and package management.

#### Why Toolkit? ####

Toolkit was built from the ground up with the following concepts and philosophies in mind.
If any of these concepts align with your thought process or your projects requirements, than Toolkit is right for you.

* Mobile first design philosophy
* Progressive enhancement and graceful degradation
* Cascading CSS inheritance
* Configuration over convention
* Responsive and fluid as first class
* Relative scaling with `em` and `rem`
* Animations and transitions purely with CSS

#### Demo ####
A temporary demo can be found here: http://titon.io/toolkit

#### Requirements ####
* **HTML5**
* **CSS3**
* **jQuery**
* (or)
* **MooTools**
    * More/Class.Binds
    * More/Elements.From
    * More/Element.Shortcuts
    * More/Element.Measure
    * More/Drag (optional for Modal)
    * More/Element.Event.Pseudos (for LazyLoad, Pin, Stalker, Tooltip)

#### Browser Support ####

* Chrome 11+
* Firefox 4+
* Internet Explorer 10+
* Opera 11+
* Safari 5+

**What about IE8 and 9?**

IE9 does not support CSS3 transitions; all animations will fallback to a simple show/hide.

IE8 does not support CSS3 transitions, rem/em scaling, media queries and specific HTML 5 elements.
To support media queries and responsiveness, use [respond.js](https://github.com/scottjehl/Respond).
To support HTML 5 features, use [modernizr](http://modernizr.com).

Furthermore, the following Toolkit components do not work in IE8: Input, Matrix.

## Javascript Components ##
#### Modules ####
* `Accordion` - Provides collapsible support to a list of sections
* `Blackout` - Displays a transparent black element over the document
* `Carousel` - Provides a 16:9 responsive carousel with panels that slide or fade in
* `Dropdown` - Allows for toggleable dropdown menus with support for nested menus
* `Flyout` - Displays nested flyout menus that appear below an element that activates it
* `Input` - Replaces select boxes, checkboxes and radios with custom basic functionality
* `LazyLoad` - Provides an easy way to lazy-load images (inline and background) while scrolling
* `Matrix` - Reorganizes elements into a modular cascading grid (masonry style)
* `Modal` - Displays dynamic modals that will display above the content
* `Pin` - Pin an element in a container that stays within the viewport while scrolling
* `Popover` - Displays dynamic notification elements over an element
* `Showcase` - Provides a lightbox style image gallery
* `Stalker` - Monitors the scroll of an element and notifies a target when a marker is reached
* `Tabs` - Provides tabbed support to an element containing navigation tabs and sections
* `Tooltip` - Displays dynamic tooltips over an element or the mouse cursor
* `TypeAhead` - Displays a list of possible options below an input while typing

#### Extensions ####
Titon also provides classes that build upon MooTools itself. These classes do not require the Titon library.

* `Timers` - Provides timer and interval management within the class layer
* `Cache` - Provides local and session storage within the class layer

## CSS Components ##
#### Layout ####
* `Base` - Provides utility and helper classes
* `Code` - Styles for code blocks
* `Form` - Allows for vertical, horizontal and inline forms; also provides default styles
* `Responsive` - Responsive classes for mobile, tablet and desktop resolutions
* `Typography` - Resets and default styles for typography

#### UI ####
* `Breadcrumb` - Styles for bread crumb navigation trails
* `Button` - Styles for generic cross-browser compatible buttons
* `ButtonGroup` - Allows for the grouping of multiple buttons into 1 visual styled button
* `Grid` - Implements a fluid 12 column grid system with responsive support for all devices
* `Icon` - Allows for inline image sprites to be used at 12, 16, 24, 32, and 64 sizes
* `InputGroup` - Allows for the grouping of inputs with buttons and static blocks
* `Label` - Styles for inline tag labels
* `Notice` - Styles for block level notification messages
* `Pagination` - Styles for pagination lists
* `Progress` - Basic styles for progress bars
* `Table` - Styles for tables

#### Themes ####
* `Titon` - Titon specific theme used for examples

## Authors ##
* [Miles Johnson](https://github.com/milesj)

#### Third Party ####
* `Normalize.css` provided by Nicolas Gallagher
* `Iconic` icon set provided by P.J. Onori

## Known Issues ##
* Zepto is currently not supported (too different of an API)
* Slide in modal animations do not work correctly in Chrome/IE
* Flip modal animations do not work in Opera