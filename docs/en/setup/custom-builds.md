# Custom Builds #

Customizing a Toolkit build allows for the inclusion or exclusion of plugins within generated output files. This is especially useful for projects where plugins are needed on a case by case basis.

When running a build, both a minified and unminified version will be created.

## Requirements ##

To customize a build, [Node.js](http://nodejs.org/), [NPM](http://nodejs.org/), and [Gulp](http://gulpjs.com/) are required. Processing CSS files will also require [Sass](http://sass-lang.com/). Installation of these libraries can be found on their respective websites. NPM packages can be installed using `npm install`.

## Choosing Plugins ##

When generating a custom build, a whitelist of plugin names can be defined through the `--plugins` option in the command line. This option will accept a comma separated list of plugin names. If no option is defined, all plugins will be included.

```bash
gulp --plugins=tooltip,modal,buttonGroup
```

After the command executes, compiled CSS and Javascript files will be written to the `build/` folder. It's as simple as that.

The list of available plugins can be found in the `manifest.json` found within the root of the project.

## Normalize Integration ##

By default, [normalize.css](http://necolas.github.io/normalize.css/) will be included at the top of the generated CSS file. To not include normalize, supply the `--no-normalize` option.

## Right-To-Left Support ##

When passing the `--rtl` option, the compiled CSS file name will be appended with `-rtl`. This does not actually trigger RTL styles, that will require modifying [Sass variables](rtl.md).

## Combining Options ##

Like other command line utilities, all options can be used at once, and in any order. Go crazy and customize as you please!

```bash
gulp --plugins=buttonGroup,tooltip --no-normalize
```
