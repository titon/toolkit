# BEM CSS Classes #

Toolkit utilizes a variation of the [BEM methodology](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), which is a convention for naming CSS classes in an organized fashion. In simple terms, BEM stands for block-element-modifier, where `block` is a parent level component, the `element` is a child of the parent, and `modifier` alters the state or behavior of the parent.

Using the [Carousel component](../../components/carousel.md) as an example, our parent (the "block") class name would be `.carousel` and any child (the "element") that is found within `.carousel` and directly relates to the component would be prefixed with `.carousel-`. This provides us with elements like `.carousel-items` (the slides), `.carousel-next`, and `.carousel-prev` (the navigation buttons). When writing our (S)CSS, it can easily be written as such:

```css
.carousel { }
.carousel-items { }
.carousel-prev,
.carousel-next { }
```

No nesting required as class names have been namespaced, nice huh? This easily reduces the file size and improves compatibility.

The final paradigm, the "modifier", is used to change the behavior or state of the parent (the "block"). Continuing with our carousel example, the default `.carousel` block provides a 4:3 sized carousel. Now what if we want 16:9? Or a 4:4? This can be achieved through modifiers, ala `.carousel--wide` and `.carousel--square`. A modifier can be easily recognized by a `--` between the block and modifier name.

```html
<div class="carousel carousel--wide">
    ...
</div>
```

## Customizing Separators ##

In the Toolkit world, we opted to use single dashes `-` for separating blocks and elements, and double dashes `--` for separating modifiers. If you prefer to use underscores and the standard BEM format, you can customize both the Sass and JavaScript layer to achieve this.

### In Sass ###

To change the separators between each BEM class part, modify the `$bem-element-separator` (defaults to `-`) or the `$bem-modifier-separator` (defaults to `--`). Once Sass re-compiles, all Toolkit class names will use the new naming convention. 

```scss
$bem-element-separator: "__";
```

Furthermore, Toolkit provides a `bem()` function for generating BEM compatible CSS class names. This function accepts an argument for each part -- the block, element, and modifier.

```scss
bem("foo") // foo
bem("foo", "bar") // foo__bar
bem("foo", "bar", "baz") // foo__bar--baz
bem("foo", "", "baz") // foo--baz
```

Passing the function to `class-name()` will automatically prepend a class `.` and the `$namespace`.

```scss
$namespace: "tk-";

class-name(bem("foo")) // .tk-foo
```

### In JavaScript ###

To change the separators on the JavaScript side, modify the `Toolkit.bemSeparators` property. This property accepts an array of 2 values, the element separator and the modifier separator. Once separators are set, each rendered template will make use of the new class naming convention.

```javascript
Toolkit.bemSeparators = ['__', '--'];
```

Similar to the Sass layer, the JavaScript layer also supports a `Toolkit.bem()` function. This function works exactly like its Sass counter-part.

```javascript
Toolkit.bem('foo'); // foo
Toolkit.bem('foo', 'bar', 'baz'); // foo__bar--baz
```

<div class="notice is-info">
    This property should be set immediately after Toolkit is loaded.
</div>
