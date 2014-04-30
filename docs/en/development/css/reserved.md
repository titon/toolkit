# Reserved Classes #

We try to avoid declaring global class names, but usually it can't be helped.
Just be weary of the following classes while building an application.

The following classes are reserved by Toolkit:

* All the classes within `base.scss`, `responsive.scss`, and `typography.scss`
* Grid component `.col` class
* Shape classes: `.round`, `.square`, `.pill`, `.oval`, `.skew`, `.skew-reverse`
* Size classes: `.small`, `.large`
* Animation classes: `.from-above`, `.from-below`, `.slide`, `.slide-up`, `.slide-in-top`,
    `.slide-in-bottom`, `.slide-in-left`, `.slide-in-right`, `.flip-rotate`,
    `.fade`, `.sticky`, `.push`, `.push-reveal`, `.push-down`, `.reverse-push`,
    `.reveal`, `.squish`, `.on-top`, and many more
* Positional classes: `.top-left`, `.top-center`, `.top-right`, `.center-left`, `.center-right`,
    `.bottom-left`, `.bottom-center`, `.bottom-right`
* State classes: `.is-*`, `.has-*`, and many more

Some classes make use of [Sass variables](../sass/variables.md) for altering the class names.
This was implemented to avoid collisions of common class names and integration with legacy applications.
Continue reading for more information on these variables.

## Namespacing Components ##

Component names follow the [BEM naming convention](bem.md), so all component class names are also reserved.
However, Toolkit does support prefixing *ALL* components with a vendor name,
so that `.tooltip` would be renamed to `.tk-tooltip` if the `$vendor-prefix` variable was set to `tk-`.
This is disabled by default.

* [Learn more on Sass prefixing](../sass/variables.md)
* [Learn more on JS prefixing](../js/toolkit.md)