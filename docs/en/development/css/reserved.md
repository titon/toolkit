# Reserved Classes #

We try to avoid declaring global class names, but usually it can't be helped.
Just be weary of the following classes while building an application.

The following classes are reserved by Toolkit:

* All the classes within `base.scss`, `responsive.scss`, and `typography.scss`
* Grid component `.col` and `.end` class
* Shape classes: `.round`, `.pill`, `.oval`, `.skew`, `.skew-reverse`
* Size classes: `.small`, `.large`
* Animation classes: `.from-above`, `.from-below`, `.slide`, `.slide-up`, `.slide-in-top`,
    `.slide-in-bottom`, `.slide-in-left`, `.slide-in-right`, `.flip-rotate`,
    `.fade`, `.sticky`, `.push`, `.push-reveal`, `.push-down`, `.reverse-push`,
    `.reveal`, `.squish`, `.on-top`, and many more
* Positional classes: `.top-left`, `.top-center`, `.top-right`, `.center-left`, `.center-right`,
    `.bottom-left`, `.bottom-center`, `.bottom-right`
* State classes: `.is-*`, `.has-*`, `.no-*`, and many more

Some classes make use of [Sass variables](../sass/variables.md) for altering their names.
This was implemented to avoid collisions of common class names and integration with legacy applications.
Continue reading for more information on these variables.

## Namespacing Classes ##

Toolkit supports prefixing of *ALL* plugins with a vendor name, 
so that `.tooltip` would be renamed to `.tk-tooltip` if the `$vendor-prefix` variable was set to `tk-`.
This is disabled by default.

* [Learn more on CSS/Sass prefixing](../sass/variables.md)
* [Learn more on JavaScript prefixing](../js/toolkit.md#vendor-prefix)