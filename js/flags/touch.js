define(function() {

// Does the device support touch controls
var isTouch = !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));

return isTouch;
});