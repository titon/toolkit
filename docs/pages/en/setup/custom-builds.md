# Custom Builds #

Customizing a Toolkit build allows for the inclusion or exclusion of components within generated output files.
This is especially useful for projects where components are needed on a case by case basis.

### Requirements ###

To customize a build, [Node.js](http://nodejs.org/), [NPM](http://nodejs.org/), and [Grunt](http://gruntjs.com/) are required.
Processing CSS files will also require Ruby, Sass and Compass.

Installation of these libraries can be found on their respective websites.

### Choosing Components ###

When generating a custom build, a whitelist of component names must be defined through the `--components` option in the command line.
This option will accept a comma separated list of component names. If no option is defined, all components will be included.

```bash
grunt --components=tooltip,modal,buttonGroup
```

After the command executes, compiled CSS and Javascript files will be written to the `build` folder. It's as simple as that.

The list of available components can be found in the `manifest.json` found within the root of the project (excluding names that start with `theme-` or `effect-`).

### Including Effects ###

Effects are special components that extend the primary components with additional functionality, like pill rounding, and visual glossing.
These styles are not included by default and must be defined in the same manner as components by supplying a list to the `--effects` option.

```bash
grunt --effects=oval,pill,visual
```

The list of available effects can be found in the `manifest.json` and are prefixed with `effect-`.

### Choosing A Theme ###

Themes provide aesthetic styles for all components and are primarily used for prototyping and scaffolding.
Themes should not be used in production and should be used as a reference for styling Toolkit.

By default no theme is included. To specify a theme, use the `--theme` option in the command line.

```bash
grunt --theme=titon
```

The list of available effects can be found in the `manifest.json` and are prefixed with `theme-`.

### Normalize Integration ###

By default, [normalize.css](http://necolas.github.io/normalize.css/) will be included at the top of the generated CSS file.
To not include normalize, supply the `--no-normalize` option.

### Combining Options ###

Like other command line utilities, all options can be used at once, and in any order. Go crazy and customize as you please!

```bash
grunt --components=buttonGroup,tooltip --effects=oval --theme=titon --no-normalize
```