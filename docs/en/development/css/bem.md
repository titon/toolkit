# Block-Element-Modifier Methodology #

Toolkit utilizes a variation of the [BEM methodology](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/),
which is a convention for naming classes in an organized fashion.
In simple terms, BEM stands for block-element-modifier, where `block` is the high level component,
the `element` is a child of the parent, and `modifier` alters the state or behavior of the parent.
In the Toolkit world, the only difference is the way class names are formed.
For example, instead of `.block__element`, it would simply be `.block-element`.

Using the Carousel component as an example, our high level class name (the "block") would be `.carousel`.
Any child (the "element") that is found within `.carousel` and directly relates to the
[Carousel component](../components/carousel.md) would be prefixed with `.carousel-`.
This provides us with elements like `.carousel-items` (the slides),
`.carousel-next`, and `.carousel-prev` (the navigation buttons).
When writing our (S)CSS, it can easily be written as such:

```css
.carousel { }
.carousel-items { }
.carousel-prev,
.carousel-next { }
```

No nesting required as class names have been namespaced, nice huh?
This easily reduces the file size and improves compatibility.

The final paradigm, the "modifier", is used to change the behavior or state of the parent (the "block").
Continuing with our Carousel example, the default `.carousel` block provides a 4:3 sized carousel.
Now what if we want 16:9? Or a 4:4? This can be achieved through modifiers,
ala `.carousel--wide` and `.carousel--square`.
A modifier can be easily recognized by a `--` between the block and modifier name.

```html
<div class="carousel carousel--wide">
    ...
</div>
```