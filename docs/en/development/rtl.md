# RTL Support #

Toolkit was engineered to support [right-to-left](http://en.wikipedia.org/wiki/Right-to-left) (RTL) text direction out of the box, but will require a few modifications to get it working properly. Enabling RTL will reverse all floats, padding, margin, positioning, etc, within the CSS and JavaScript layers on top of the reversed text direction.

## Direction Attribute ##

The first step in enabling RTL is by setting the `dir` attribute to `rtl` on the root `<html>` element. This will also enable the built-in browser RTL functionality.

```html
<html lang="ar" dir="rtl">
```

## Language Attribute ##

The `lang` attribute should also be set to match your language. Here's a few of the most commonly used RTL languages.

* Arabic: ar
* Chinese: zh
* Hebrew: he
* Japanese: ja
* Kurdish: ku
* Persian, Farsi: fa
* Urdu: ur
* Yiddish: yi

```html
<html lang="ja" dir="rtl">
```

## Integrating CSS ##

Making full use of RTL will require the RTL specific Toolkit CSS files. There are 2 ways in handling this, the first through the official distributions like Bower, and secondly within the Sass layer.

### Distribution ###

If you are using Bower or one of the other [non-Sass installations](installing.md), you can simply replace the default CSS file with the RTL specific one.

```html
<link href="/bower_components/toolkit/dist/toolkit.min.css" rel="stylesheet">
```

Will be changed to (note the `-rtl` in the file name).

```html
<link href="/bower_components/toolkit/dist/toolkit-rtl.min.css" rel="stylesheet">
```

### Sass ###

If using Sass directly, or through a Compass extension, simply change the `$text-direction` variable to `rtl`. This will reverse all relevant CSS properties.

```scss
$text-direction: rtl;
```

## Integrating JavaScript ##

Luckily there are no changes that need to be made to the JavaScript layer -- everything is automatic. However, the `Toolkit.isRTL` flag can be used to detect if RTL is enabled.

```javascript
if (Toolkit.isRTL) {
    // true
}
```
