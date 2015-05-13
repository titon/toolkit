# Getting Started #

Before we dive into Toolkit, there are some important concepts and conventions that will be necessary to learn. Let's quickly setup a new project with Toolkit and discuss these concepts along the way.

## Downloading Toolkit ##

Of course the first thing we need to do is acquire the Toolkit files. Let's begin by cloning the repository.

```bash
[sudo] git clone git@github.com:titon/toolkit.git
```

Besides git, there are multiple ways to download Toolkit. [Jump to the installation documentation for more approaches](installing.md).

## Project Structure ##

After Toolkit has been downloaded, let's open the folder and review the file structure within.

```
toolkit/
├── build/
├── demo/
├── dist/
├── docs/
├── gulp/
├── js/
├── lib/
├── scss/
└── tests/
```

The Toolkit repository is grouped logically into folders depending on the type of file or its purpose.

* The `build` folder is the target location for Gulp builds.
* The `demo` folder contains files that are used for testing plugins locally.
* The `dist` folder contains files for use in production environments.
* The `docs` folder contains documentation for using Toolkit (you're reading it).
* The `gulp` folder contains custom Gulp plugins used in the build process.
* The `js`, `scss` and `lib` folders contain source files for Sass and JavaScript which can be used for direct integration into projects.
* The `tests` folder contains all our unit tests.

### Distribution Files ###

Files found in the `dist` folder are minified and unminified files ready for production. These files are also available through [Bower](http://bower.io). These files include *all* plugins but not all features.

```
toolkit/
└── dist/
    ├── toolkit.css
    ├── toolkit-rtl.css
    ├── toolkit.js
    ├── toolkit.min.css
    ├── toolkit-rtl.min.css
    └── toolkit.min.js
```

Simply include the files in your application to gain all of Toolkit's functionality.

### Source Files ###

Source files are found in the `js`, `scss`, and `lib` folders. This is where all development and engineering is focused. These files will later be processed for distribution.

```
toolkit/
├── js/
|   ├── components/
|   ├── events/
|   ├── extensions/
|   └── flags/
├── lib/
|   └── titon-toolkit.rb
└── scss/
    ├── toolkit/
    |   ├── components/
    |   └── mixins/
    ├── normalize.scss
    └── toolkit.scss
```

Files are organized into folders that represent specific functionality.

<div class="notice is-info">
    The <code>lib</code> folder is required by Compass extensions and serves no other purpose.
</div>

## Boilerplate Template ##

Now that we have our assets, let's create the HTML template. We'll go ahead and use a lightweight version of the [HTML5 Boilerplate](http://html5boilerplate.com/) as a foundation.

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Titon Toolkit</title>
        <link href="css/toolkit.min.css" rel="stylesheet">
        <link href="css/style.min.css" rel="stylesheet">
    </head>
    <body>
        <!-- JS -->
        <script src="js/jquery.min.js"></script>
        <script src="js/toolkit.min.js"></script>
    </body>
</html>
```

You'll notice that we placed `toolkit.min.css` before `style.min.css`. This allows for helper classes and plugin styles to be inherited first. Placing project specific styles after Toolkit allows customization and themeing of plugins.

Let's test our JavaScript plugins by placing the following code within the `<body>` tags.

```html
<button type="button" class="button js-tooltip" data-tooltip="This messages displays on hover.">Click Me!</button>

<script>
    $(function() {
        $('.js-tooltip').tooltip();
    });
</script>
```

Now comes the fun part, testing the code. Open up the previously created HTML file and hover your mouse over the button in the page. If all goes well, you shall see a contextual tooltip appear relative to the button. Awesome right?

<div class="notice is-warning">
    If no styles have been defined yet, the button and tooltip plugins will use default styles, which look rather bland.
</div>

Getting started with Toolkit was extremely easy, and we can guarantee working in and integrating it is just as easy.
