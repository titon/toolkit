# Conflict Resolution #

Toolkit has no concept of `noConflict()` that is found in other libraries. Instead, it has an automatic conflict resolution, where methods are renamed if one already exists. For example, when using the [Tooltip component](../../components/tooltip.md) under the name `tooltip()`, and that name is already taken (by jQuery UI for example), the method is renamed to `toolkitTooltip()`.

```javascript
$('.js-tooltip').tooltip();

// Automatically becomes
$('.js-tooltip').toolkitTooltip();
```

If for any reason the Toolkit method is lost, or overridden by another library, components can be instantiated manually outside of the jQuery syntax.

```javascript
new Toolkit.Tooltip($('.js-tooltip'), {});

// jQuery equivalent
$('.js-tooltip').tooltip({});
```
