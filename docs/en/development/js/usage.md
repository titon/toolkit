# Using Plugins #

Using Toolkit plugins (components and behaviors) is extremely simple. If you're familiar with jQuery plugins, it's even simpler. A plugin can be initialized with a single line of code.

```javascript
$('#tabs').tab();
```

What this does is initialize a [Tab component](../../components/tab.md) on the `#tabs` element and stores the component instance within memory. Can't get easier than that!

## Accessing Instances ##

To access methods or properties on a plugin, the plugin instance will need to be retrieved. This can be achieved through the `toolkit()` method by passing the name of the plugin as the 1st argument.

```javascript
var tabs = $('#tabs').toolkit('tab');
```

Once we have an instance, methods or properties on the instance can be accessed.

```javascript
tabs.sections; // Collection of section elements
tabs.jump(1); // Jump to a section
```

<div class="notice is-warning">
    The <code>toolkit()</code> method will return <code>null</code> when no instance is found.
</div>

## Triggering Methods ##

Since retrieving an instance can return `null` and having to check the return value before triggering methods can be quite tedious, we rolled all this functionality into `toolkit()`. To trigger methods on the plugin instance, pass the method name as the 2nd argument, and an array of arguments to pass to the method as the 3rd argument.

```javascript
$('#tabs').toolkit('tab', 'jump', [1]);
```

If an instance is found, the method will automatically be called, else nothing will happen. This allows for seamless error free integration.

## Dynamic Content Loading ##

A handful of plugins use a concept we like to call, dynamic content loading. This concept will determine a type of dynamic content based on a parameter and the load the content automatically. Most of this functionality is handled through the `loadContent()` method in the [Component](component.md) class. The following formats are currently supported, listed in the order of detection.

### DOM Loading ###

If a DOM ID is passed in the format of `#id`, the inner HTML of the element will be used as the content.

```html
<div id="element" style="display: none">This content is hidden, but is usable.</div>
```

```javascript
component.loadContent('#element'); // This content is hidden, but is usable.
```

### AJAX Loading ###

If an HTTP URL or an absolute URL for the current domain is passed, then the content will be requested from the URL as an AJAX request.

```javascript
component.loadContent('/some/url'); // The response from the /some/url AJAX request.
component.loadContent('http://domain.com'); // The response from the http://domain.com AJAX request (if allowed).
```

This does not work on relative URLs. All absolute domain URLs will require a prefixed forward slash.

### Literal Content ###

If the content does not match a DOM ID or a URL, then the content will be set literally. This will accept either a string or an element.

```javascript
component.loadContent('Foobar'); // Foobar
component.loadContent(data); // The value of the data variable.
component.loadContent(document.createElement('div'));
```
