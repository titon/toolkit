# Installing #

There are many ways to get started with Toolkit. Choose the one that's right for you or your project.

## Download ##

The easiest option would be to download the latest stable version from the official [Toolkit GitHub](https://github.com/titon/toolkit/releases).
The current version can be found at the top of the tag list, simply click the "zip" icon.

Once downloaded, extract the zip archive and its contents. The production ready CSS and JavaScript files can be found in the `dist` folder.
Copy these files into a project and you're done!

## Git Clone ##

The popular option would be to clone the [git repository](https://github.com/titon/toolkit).
This provides the distribution files and the source files for a more seamless integration.

Just run the following command to clone the repository.

```bash
[sudo] git clone git@github.com:titon/toolkit.git
```

## Bower Dependency ##

Toolkit also comes bundled as a [Bower](http://bower.io/) package. Simply add `toolkit` as a dependency within your project's `bower.json`.

```javascript
{
    "dependencies": {
        "toolkit": "*"
    }
}
```

From the project root, run `bower install` to download the package(s). Once downloaded, include the assets in your project.

```html
<link href="/bower_components/toolkit/dist/toolkit.min.css" rel="stylesheet">
<script src="/bower_components/toolkit/dist/toolkit-jquery.min.js"></script>
```

<div class="notice is-info">
    It's also possible to include Toolkit components on a case by case basis instead of including the full component list.
    <a href="getting-started.md#distribution-files">Learn more about the distribution file structure</a>.
</div>

## Sass & Compass Integration ##

If you prefer to use the source Sass files directly in a project, this can easily be done through the Toolkit [Compass extension](http://compass-style.org/help/tutorials/extensions/).
This approach requires Ruby, Ruby Gems, Sass, and Compass to be installed.

```bash
gem install sass
gem install compass
```

Install the Toolkit gem.

```bash
gem install titon-toolkit
```

Require Toolkit at the top of the Compass `config.rb` file.
[Learn more about Compass configuration](http://compass-style.org/help/tutorials/configuration-reference/).

```ruby
require 'titon-toolkit'
```

Once the gems are installed and Compass is configured, the Toolkit `scss` files can be imported.
The available paths for import must be relative to the Toolkit [scss directory](https://github.com/titon/toolkit/tree/master/scss).
For example:

```scss
// Import all variables, mixins and functions
@import "toolkit/common";

// Import the CSS for the tooltip component
@import "toolkit/components/tooltip";

// Import the CSS for all components
@import "toolkit";
```

For more information on Sass integration, jump to the [Sass development documentation](../development/sass.md).