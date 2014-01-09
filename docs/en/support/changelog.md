# Changelog #

### 1.0.5 ###
* Added `composer.json` allowing the project to be installed via Composer
* Fixed a prototype inheritance bug that caused Popovers to trigger Tooltips that capture all click events
* Updated `hover` modes to default to click on touch devices; will pass-through to anchor link on second click

### 1.0.4 ###
* Added `.vertical-center` class
* Added `!important` to Responsive display properties
* Changed `.arrow` classes to use the `bigtriangleup` entity
* Removed Responsive conditionals to allow all classes
* Updated `pre code` to display block

### 1.0.3 ###
* Changed default Tooltip position to `topCenter`
* Removed `stopPropagation()` calls

### 1.0.2 ###
* Changed bower package name
* Fixed Modal not loading the correct content
* Updated MooTools to not use <code>$</code> functions

### 1.0.1 ###
* Added variables for prefixing classes with vendor names and state prefixes
* Added missing Input component to manifest
* Fixed incorrect methods being called in jQuery Modal
* Fixed a Modal bug where switching between AJAX and DOM loading caused issues
* Updated Matrix deferred loading to render immediately if no images are found
* Updated Modal target reading by swapping href to last

### 1.0.0 ###
* Released! Aww yiisss
