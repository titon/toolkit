# Versioning #

The following are steps for tagging a new release. These steps are for internal use only.

## 1) Versioning ##

* Update version numbers in the following files: `bower.json`, `package.json`, `readme.md`, `toolkit.gemspec`, `version.md`
* Update `version` property for JavaScript plugins that have been modified
* Update `manifest.json`
    * Add new components with `version` field
    * Update dependencies

## 2) Testing ##

* Enable all Sass effects, modifiers, animations, and modules in `_common.scss`
* Update Normalize CSS
* Update NPM packages
* Run `gulp`
    * Regression testing and issue fixing for all components
* Run `gulp --rtl`
    * Regression testing for RTL support

## 3) Building ##

* Disable all Sass effects, modifiers, animations, and modules in `_common.scss`
* Set `$text-direction` to `ltr`
* Build distribution files with `gulp --dist`
* Set `$text-direction` to `rtl`
* Build RTL files with `gulp --dist --rtl`
* Fix the comment docblocks
    * Place Normalize above Toolkit in the CSS
    * Remove any unnecessary newlines

## 3) Documenting ##

* Update changelogs
* Update statistics in comparison docs
* Generate table of contents with `gulp docs`
    * Add any `new` or `updated` flags to TOC

## 4) Distributing ##

* Verify changes with `git diff`
* Publish changes
    * `git commit -m "*"`
    * `git tag *`
    * `git push --tags`
* Publish gem
    * `gem build toolkit.gemspec`
    * `gem push *`
* Publish NPM
    * `npm publish`
