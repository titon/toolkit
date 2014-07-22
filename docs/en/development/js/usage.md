# Using Plugins #

Using Toolkit plugins (components and behaviors) is extremely simple. If you're familiar with jQuery plugins, it's even simpler.
A plugin can be initialized with a single line of code.

```javascript
$('#tabs').tab();
```

What this does is initialize a [Tab component](../../components/tab.md) on the `#tabs` element
and stores the component instance within memory. Can't get easier than that!

## Accessing Instances ##

To access methods or properties on a plugin, the plugin instance will need to be retrieved.
This can be achieved through the `toolkit()` method by passing the name of the plugin as the 1st argument.

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

Since retrieving an instance can return `null` and having to check the return value before triggering
methods can be quite tedious, we rolled all this functionality into `toolkit()`.
To trigger methods on the plugin instance, pass the method name as the 2nd argument,
and an array of arguments to pass to the method as the 3rd argument.

```javascript
$('#tabs').toolkit('tab', 'jump', [1]);
```

If an instance is found, the method will automatically be called, else nothing will happen.
This allows for seamless error free integration.
