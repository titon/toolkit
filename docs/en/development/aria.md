# ARIA Support #

ARIA, which stands for [Accessible Rich Internet Applications](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), is a concept for making a website accessible to people with disabilities, or people using screen readers.

ARIA is enabled by default for all JavaScript based components. What this entails is automatic ARIA attribute generation and inclusion. For all non-JavaScript based components, ARIA attributes will need to be manually defined. Information on supporting ARIA for each component can be found on their respective documentation.

For example of automatic ARIA attributes, the [Carousel component](../components/carousel.md) will be converted from this.

```html
<div class="carousel">
```

To this.

```html
<div class="carousel" aria-live="assertive">
```

## Using ##

To manually set ARIA attributes with JavaScript, a jQuery method named `aria()` is available. [Learn more about this method.](js/extensions.md#aria)

## Disabling ##

To disable automatic ARIA support in JavaScript, set the `Toolkit.aria` property to false.

```javascript
Toolkit.aria = false;
```

<div class="notice is-warning">
    Disabling ARIA also disables the jQuery <code>aria()</code> method.
</div>
