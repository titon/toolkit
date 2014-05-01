# Versioning #

Steps for tagging new releases. These docs are for internal use only.

* Update normalize.css
* Test code with `grunt production`
    * Regression testing on all components with the compiled code
    * Find any issues, fix them and restart version process
* Update version numbers
    * `bower.json`, `package.json`, `readme.md`, `toolkit.gemspec`, `version.md`
    * Update `version` property for JS components that have been modified
* Verify `manifest.json` changes
    * Add new components
    * Add `version` field for new components
    * Update dependencies
* Verify documentation `toc.json` matches the current docs structure
* Update `changelog.md` and the changelog found in docs
* Prepare release with `grunt distribute`
    * Fix the comment docblocks
    * Remove `$` and `jQuery` from the MooTools compiled file
    * Remove `http://` from URLs
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