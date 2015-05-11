# Vendor Prefixing #

Toolkit integrates the wonderful [autoprefixer](https://github.com/ai/autoprefixer) library for processing and applying browser vendor prefixes to CSS properties. Because of this library, our source code contains no vendor prefixing and uses the latest in CSS specifications.

## External Integration ##

When integrating with Toolkit's source files directly (through [Compass](../../setup/installing.md#sass--compass) for example), be sure to run autoprefixer on your styles to support all browsers.
