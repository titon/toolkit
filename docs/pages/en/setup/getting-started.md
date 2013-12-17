# Getting Started #

Before you dive into Toolkit, there are some important concepts and conventions that will be necessary to learn.
Let's quickly setup a new project with Toolkit and discuss these concepts along the way.

### Downloading Toolkit ###

Of course the first thing we need to do is acquire the Toolkit files. Let's begin by cloning the repository.

```bash
[sudo] git clone git@github.com:titon/toolkit.git
```

Besides git, there are multiple ways to download Toolkit.
[Jump to the installation documentation for more approaches.](installing.html)

### Project Structure ###

After Toolkit has been downloaded, let's open the folder and review the file structure within.

```
toolkit/
├── css/
├── demo/
├── dist/
├── docs/
├── js/
├── lib/
└── scss/
```

The Toolkit repository is grouped logically into folders depending on the type of file or its purpose.

* The `css` and `demo` folders contain files that are used for testing components locally (requires PHP).
* The `dist` folder contains files for use in production environments.
* The `docs` folder contains documentation for using Toolkit (you're reading it).
* The `js`, `scss` and `lib` folders contain source files for Sass and JavaScript which can be used for direct integration into projects.

#### Distribution Files ####

Files found in the `dist` folder are compressed, minified, and compiled source files ready for production.
These files are also available through [Bower](http://bower.io).

```
toolkit/dist/
├── jquery/
|   ├── toolkit.min.js
|   └── toolkit-*.min.js
├── mootools/
|   ├── toolkit.min.js
|   └── toolkit-*.min.js
├── toolkit.min.css
├── toolkit-jquery.min.js
└── toolkit-mootools.min.js
```

The folder structure is a bit confusing, but trust us, it makes sense.

The files found in the root of the `dist` folder contain the compiled source code for *all* components.
Simply include the files in your application to gain all of Toolkit's functionality.

The files found in the `jquery` and `mootools` folders contain source code for individual components.
This allows for the inclusion of components on a case by case basis.
When using this approach, the `{vendor}/toolkit.min.js` file is required before any component.

<div class="notice is-info">
    There are no individual CSS files for components, only JavaScript.
    The `toolkit.min.css` will still need to be included.
</div>

#### Source Files ####

```
toolkit/
├── js/
|   └── jquery|mootools/
|       ├── components/
|       ├── Component.js
|       └── Toolkit.js
└── scss/
    ├── toolkit/
    |   ├── components/
    |   ├── effects/
    |   ├── layout/
    |   ├── mixins/
    |   ├── themes/
    |   └── _common.scss
    ├── normalize.scss
    └── toolkit.scss
```

### Boilerplate Template ###