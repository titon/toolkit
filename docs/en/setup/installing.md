# Installing #

There are many ways to get started with Toolkit. Choose the one that's right for you or your project.

## Download ##

The easiest option would be to download the latest stable version from the official [Toolkit GitHub](https://github.com/titon/toolkit/releases). The current version can be found at the top of the tag list, simply click the "zip" icon.

Once downloaded, extract the zip archive and its contents. The production ready CSS and JavaScript files can be found in the `dist` folder. Copy these files into a project and you're done!

## Git Clone ##

The popular option would be to clone the [git repository](https://github.com/titon/toolkit). This provides the distribution files and the source files for a more seamless integration.

Just run the following command to clone the repository.

```bash
[sudo] git clone git@github.com:titon/toolkit.git
```

## Bower ##

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
<script src="/bower_components/toolkit/dist/toolkit.min.js"></script>
```

## NPM ##

Lastly, Toolkit comes bundled as a [Node.js](https://npmjs.org/) package. Simply add `titon-toolkit` as a dependency within your project's `package.json`.

```javascript
{
    "dependencies": {
        "titon-toolkit": "*"
    }
}
```

Then run `npm install` or `npm update` to download the packages.
