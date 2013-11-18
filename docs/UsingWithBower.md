# Using Toolkit with Bower #

If you prefer to use Toolkit as a dependency through Bower, then totally go for it.
When downloading through Bower, all Toolkit components are packaged together.

Begin by adding Toolkit to the `bower.json` dependencies list.

    "titon": "*"

Install the components.

    bower install

Include the Toolkit distribution files in your markup.

    <script src="/bower_components/titon/dist/toolkit-jquery.min.js"></script>
    <link href="/bower_components/titon/dist/toolkit.min.css" rel="stylesheet">

And you're ready to go!