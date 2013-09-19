# Using Toolkit in Compass #

If you prefer to use the Toolkit scss files directly in your project, this can easily be done through Compass.
Begin by installing the Sass and Compass gems. This requires Ruby and Ruby Gems to be installed.

    gem install sass
    gem install compass

Install the Toolkit gem.

    gem install titon-toolkit

Require Toolkit at the top of the Compass `config.rb` file.

    require 'titon-toolkit'

Once all the gems are installed and Compass is configured, the Toolkit scss files can be imported.
For example, to import the Toolkit variables and mixins. The import path should match the Toolkit scss folder structure.

    @import "toolkit/common";

To override any Toolkit variables, define them above the common/variable import.

    $disabled-opacity: .25;
    @import "toolkit/common";

To include the CSS markup for components, import the related scss file.

    @import "toolkit/modules/tooltip";

And that's it!