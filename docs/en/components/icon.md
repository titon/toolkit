# Icon #

Image sprite map support with optional rotation.

## Usage ##

The icon component aids in the implementation of image sprite maps by providing default styles for common icon sizes. No icon classes (excluding rotation modifiers) are included in this component, instead, classes are applied using element wildcard matching through `class*="icon-"`. For example, any element that uses a class that has `icon-` in the name will be considered an icon sprite map.

### Sizes ###

There are 5 sizes of icons currently available, all of which define widths and heights. The lowest 12x12 inherits from `icon-12`, 16x16 from `icon-16`, 24x24 from `icon-24`, 32x32 from `icon-32`, and the largest 64x64 inherits from `icon-64`.

As mentioned previously, no classes are defined for sizes &mdash; they will use wildcard matching instead. This permits a class of `.icon-32-user` to inherit all styles from `icon-32` and from `icon-`.

### Mapping ###

The first step in implementing icons is to link the sprite map image. Applying the map to all sizes can be achieved like so.

```css
[class*="icon-12"] { background-image: url("../img/icon/sprite-12.png"); }
[class*="icon-16"] { background-image: url("../img/icon/sprite-16.png"); }
[class*="icon-24"] { background-image: url("../img/icon/sprite-24.png"); }
[class*="icon-32"] { background-image: url("../img/icon/sprite-32.png"); }
[class*="icon-64"] { background-image: url("../img/icon/sprite-64.png"); }
```

<div class="notice is-info">
    Icon images well need to be organized in a uniform grid. For example, when using 12x12 icons, all columns and rows will need to be 12 pixels.
</div>

Once the background images are defined, we can start pairing icon classes with background positioned offsets.

```css
.icon-16-user { background-position: 0 0; }
.icon-16-home { background-position: -16px 0; }
.icon-16-search { background-position: -32px 0; }
...
```

```html
<button type="button" class="button">
    <span class="icon-16-home"></span>
    Home
</button>
```

### Rotation ###

Ever wanted to flip an icon horizontally or vertically? Or what about rotating it? All of these are possible using the icon modifiers `.icon--90deg`, `.icon--180deg`, `.icon--270deg`, `.icon--flip`, and `.icon--flip-vert`.

```html
<span class="icon-16-user icon--flip"></span>
```

<div class="notice is-warning">
    These modifier classes will transform all elements, not just elements with icon classes. Be careful which elements you apply these classes to.
</div>

## Variables ##

<table class="table is-striped data-table">
    <thead>
        <tr>
            <th>Variable</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>$icon-class-name</td>
            <td>.icon</td>
            <td>Name of the icon CSS class.</td>
        </tr>
        <tr>
            <td>$icon-modifiers</td>
            <td>("90deg", "180deg", "270deg", "flip", "flip-vert")</td>
            <td>List of modifiers to include in the CSS output. Accepts 90deg, 180deg, 270deg, flip, and flip-vert.</td>
        </tr>
        <tr>
            <td>$icon-sizes</td>
            <td>(12, 16, 24, 32, 64)</td>
            <td>List of sizes to generate icon maps for.</td>
        </tr>
    </tbody>
</table>
