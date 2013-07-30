# Custom Toolkit Builds #

Customizing a Toolkit build allows for specific components to be included in the output file, while ignoring the rest.
This is especially useful for projects where certain components are not needed.

To customize a build, Grunt must be installed. If it's not, jump to the installation docs.

To specify a list of components, pass a comma separated list of component names to the grunt command line.

	grunt --components=tooltip,modal,buttonGroup

The custom build file will be compiled and written to the `build` folder. It's as simple as that.

The full list of available components can be found in the `Gruntfile.js` file.

### Custom Effects ###

By default, componenet effects are not included in the output file. An effect is optional functionality that can be added onto a component.

To specify a list of effects, pass a comma separated list of component names to the grunt command line.

	grunt --components=tooltip,modal,buttonGroup --effects=buttonGroup

The list of available components can be found under the `effects` key in the components list.