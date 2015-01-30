# Versioning #

Steps for tagging a new release that should be followed after a feature branch has merged into master.
These docs are for internal use only.

* Update normalize.css
* Disable all Sass effects, modifiers, and animations
* Test code with `gulp`
    * Regression testing on all components with the compiled code
    * Find any issues, fix them and restart version process
* Update version numbers
    * `bower.json`, `package.json`, `readme.md`, `toolkit.gemspec`, `version.md`
    * Update `version` property for JS components that have been modified
* Verify `manifest.json` changes
    * Add new components
    * Add `version` field for new components
    * Update dependencies
* Update `changelog.md` and the changelog found in docs
* Generate new documentation TOC with `gulp docs`
    * Add any `new` or `updated` flags to TOC
* Prepare release with `gulp --dist`
    * Fix the comment docblocks
* Prepare RTL release with `gulp --dist --rtl`
    * Change `$text-direction` in Sass to `rtl` first
    * Fix the comment docblocks
* Quick tests with the distribution files
* Verify changes with `git diff`
* Publish changes
    * `git tag *`
    * `git push --tags`
* Update gem
    * `gem build toolkit.gemspec`
    * `gem push *`
* Update NPM
    * `npm publish`
