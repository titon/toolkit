# Custom Toolkit Builds #

Customizing a Toolkit build allows for specific components to be included in the output file, while ignoring the rest.
This is especially useful for projects where certain components are not needed.

To customize a build, Grunt must be installed. If it's not, jump to the installation docs.

To specify a list of components, pass a comma separated list of component names to the grunt command line.

	grunt --components=tooltip,modal,buttonGroup

The custom build file will be compiled and written to the `build` folder. It's as simple as that.

The full list of available components can be found in the `manifest.json` file.

### Themes ###

By default no theme is generated. This allows the use of default component functionality with no aesthetics applied.

To specify a theme, use the theme option in the command line.

	grunt --theme=titon

The list of available themes can be found at the bottom of the manifest file.