# CSS Namespacing #

A major pain point with CSS frameworks is the possibility of class name collision with the project its being integrated into. There's never an easy way to solve it either, until now. By utilizing CSS namespacing in Toolkit, all class names are prepended with a fixed value to avoid collisions.

## Customizing ##

Enabling a namespace is as easy as setting a variable.

### In Sass ###

The `$namespace` variable can be defined to support namespacing within the CSS and Sass layer. This value will be prepended to *most* class names, excluding the ones found in the [reserved list](css/reserved.md).

```scss
$namespace: "tk-";
```

### In JavaScript ###

The `Toolkit.namespace` property can be defined to support namespacing within the JavaScript layer. This value will be prepended to all component class names that are embedded in templates and created with JavaScript.

```javascript
Toolkit.namespace = 'tk-';
```

<div class="notice is-info">
    This property should be set immediately after Toolkit is loaded.
</div>
