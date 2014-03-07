# CSS Development #

A few pointers on using and understanding the CSS behind Toolkit.

* [Normalize Integration](#normalize-integration)
* [Mobile First](#mobile-first)
* [Fluid & Responsiveness](#fluid--responsiveness)
* [Block-Element-Modifier Methodology](#block-element-modifier-methodology)
* [Reserved Classes](#reserved-classes)
    * [Shapes & Sizes](#shapes--sizes)
    * [States](#states)
    * [Components](#components)

## Normalize Integration ##

Toolkit makes use of [normalize.css](http://necolas.github.io/normalize.css) as a means to standardize implementations across browsers.

The primary [CSS distribution file](../setup/getting-started.md#distribution-files) has Normalize included automatically as the first declaration.
The Normalize source code can also be found in the [source folder](../setup/getting-started.md#source-files) allowing easier integration.

Normalize inclusion can also be toggled when [generating custom builds](../setup/custom-builds.md#normalize-integration).

## Mobile First ##

To ensure support and adoption on a wide array of devices, Toolkit follows a mobile first design philosophy.
This designates mobile devices as first class priority, with CSS and JavaScript focused for mobile first.
Additional functionality for larger screens will only be loaded through use of media queries.

To ensure proper viewport rendering and touch capabilities on mobile devices, add the appropriate viewport meta tag to your `<head>`.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## Fluid & Responsiveness ##

Being mobile friendly and being responsive go hand in hand.
To further support this philosophy, all components (especially the grid) make use of fluid layouts, ala percentages for widths.
This allows components to scale and reposition automatically based on the device viewport &mdash; which in turn, reduces the codebase.

Responsive websites require media query support within the browser &mdash; [the following browsers are supported](../support/compatibility.md).

## Block-Element-Modifier Methodology ##

Toolkit utilizes a variation of the [BEM methodology](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), which is a convention for naming classes in an organized fashion.
In simple terms, BEM stands for block-element-modifier, where `block` is the high level component, the `element` is a child of the parent, and `modifier` alters the state or behavior of a parent.
The the Toolkit world, the only difference is the way class names are formed. For example, instead of `.block__element`, it would simply be `.block-element`.

Using the Carousel component as an example, our high level class name (the "block") would be `.carousel`.
Any child (the "element") that is found within `.carousel` and directly relates to the Carousel component would be prefixed with `.carousel-`.
This provides us with elements like `.carousel-items` (the slides), `.carousel-next`, and `.carousel-prev` (the navigation buttons).
When writing our (S)CSS, it can easily be written as such:

```css
.carousel { }
.carousel-items { }
.carousel-prev,
.carousel-next { }
```

No nesting required as class names have been namespaced, pretty nice huh? This easily reduces the file size and improves compatibility.

The final paradigm, the "modifier", is used to change the behavior or state of the parent (the "block").
Continuing with our Carousel example, the default `.carousel` block provides a 4:3 sized carousel. Now what if we want 16:9? Or a 4:4?
This can be achieved through modifiers, ala `.carousel--wide` and `.carousel--square`. A modifier can be easily recognized by a `--` between the block and modifier name.
Modifiers in the Toolkit world are used to replace blocks within the HTML markup, all the while inheriting the same functionality.

So basically...

```html
<div class="carousel carousel--wide">
```

Can be written as...

```html
<div class="carousel--wide">
```

Fantastic! This is all possible due to Sass's built in `@extend` functionality.

## Reserved Classes ##

We try to avoid declaring global class names, but usually it can't be helped.
Just be weary of the following classes while building your application.

The following classes are reserved by Toolkit:

* All the classes within `base.scss`, `responsive.scss`, and `typography.scss`
* Grid component `.col` class
* Icon component modifier classes
* TypeAhead component `.is-shadow` and `.not-shadow` classes
* Shape classes: `.round`, `.square`, `.pill`, `.oval`, `.skew`, `.skew-reverse`
* Size classes: `.small`, `.medium`, `.large`
* Animation classes: `.from-above`, `.from-below`, `.slide`, `.slide-up`, `.slide-in`, `.slide-in-top`,
    `.slide-in-bottom`, `.slide-in-left`, `.slide-in-right`, `.flip`, `.flip-vert`, `.flip-rotate`,
    `.fade`, `.sticky`, `.sticky-top`, `.sticky-bottom`, `.sticky-left`, `.sticky-right`
* Positional classes: `.top-left`, `.top-center`, `.top-right`, `.center-left`, `.center-right`,
    `.bottom-left`, `.bottom-center`, `.bottom-right`
* State classes: `.is-info`, `.is-error`, `.is-warning`, `.is-success`, `.is-active`, `.is-disabled`,
    `.is-open`, `.is-loading`, `.is-children`, `.is-hover`, `.is-draggable`, `.is-dragging`,
    `.is-fullscreen`, `.is-single`, `.is-sortable`, `.is-scrollable`, `.is-required`,
    `.no-legend`, `.no-columns`

Some classes make use of [Sass variables](sass.md#variables) for altering the class names.
This was implemented to avoid collisions of common class names and integration with legacy applications.
Continue reading for more information on these variables.

### Shapes & Sizes ###

The shape and size class names can be changed through the `$size-*-class` and `$shape-*-class` variables.

### States ###

By default all state classes are prefixed with `is-` or `has-`, so `.active` would be `.is-active` and `.children` would be `.has-children`.
Prefixes can be changed through the `$state-is-prefix` and `$state-has-prefix` variables.

### Components ###

Component names follow the BEM naming convention mentioned above, so all component class names are also reserved.
However, Toolkit does support prefixing *ALL* components with a vendor name,
so that `.tooltip` would be renamed to `.tk-tooltip` if the `$vendor-prefix` variable was set to `tk-`.
This is disabled by default.