# Tool Integration #

Information on how to integrate Toolkit with build tools, task runners, and more.

## Sass ##

Integrating Toolkit into your Sass layer will allow for direct importing of Toolkit's Sass files. Something like the following.

```scss
// Import all variables, mixins and functions
@import 'toolkit/common';

// Import the CSS for the tooltip component
@import 'toolkit/components/tooltip';

// Import everything
@import 'toolkit';
```

<div class="notice is-info">
    The available paths for import must be relative to the Toolkit <a href="https://github.com/titon/toolkit/tree/master/scss">scss directory</a>.
</div>

### Gulp ###

Integrate Toolkit using [Gulp](http://gulpjs.com/). This will require the [titon-toolkit](https://www.npmjs.com/package/titon-toolkit) and [gulp-sass](https://www.npmjs.com/package/gulp-sass) NPM packages.

```javascript
gulp.task('css', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass({
            includePaths: [__dirname + '/node_modules/titon-toolkit/scss']
        }))
        .pipe(gulp.dest('./css/'));
});
```

### Grunt ###

Integrate Toolkit using [Grunt](http://gruntjs.com/). This will require the [titon-toolkit](https://www.npmjs.com/package/titon-toolkit) and [grunt-sass](https://www.npmjs.com/package/grunt-sass) NPM packages.

```javascript
grunt.initConfig({
    sass: {
        options: {
            includePaths: [__dirname + '/node_modules/titon-toolkit/scss']
        },
        build: {
            src: './scss/**/*.scss',
            dest: './css/'
        }
    }
});

grunt.registerTask('default', ['sass']);
```

### Compass ###

Integrate Toolkit using a [Compass extension](http://compass-style.org/help/tutorials/extensions/). This approach requires Ruby, Ruby Gems, Sass, and Compass to be installed.

```bash
gem install sass
gem install compass
gem install titon-toolkit
```

Once installed, require Toolkit at the top of the Compass `config.rb` file. [Learn more about Compass configuration](http://compass-style.org/help/tutorials/configuration-reference/).

```ruby
require 'titon-toolkit'
```

## JavaScript ##

Furthermore, integrating Toolkit into your JavaScript layer will allow for the direct importing of Toolkit's JS files. Toolkit uses AMD styled module definitions but should work if an agnostic module loader is used, something like the following.

```javascript
// ES6
import Carousel from 'toolkit/components/carousel';

// CommonJS
var Carousel = require('toolkit/components/carousel');

// AMD
define(['toolkit/components/carousel'], function(Carousel) {});
```

<div class="notice is-info">
    The available paths for import must be relative to the Toolkit <a href="https://github.com/titon/toolkit/tree/master/js">js directory</a>.
</div>

### Webpack ###

Integrate Toolkit using [Webpack](http://webpack.github.io/). This will require the [titon-toolkit](https://www.npmjs.com/package/titon-toolkit) and [webpack](https://www.npmjs.com/package/webpack) NPM packages.

```javascript
resolve: {
    alias: {
        toolkit: __dirname + '/node_modules/titon-toolkit/js'
    }
}
```

### RequireJS ###

Integrate Toolkit using [RequireJS](http://requirejs.org). This will require the [titon-toolkit](https://www.npmjs.com/package/titon-toolkit) and [requirejs](https://www.npmjs.com/package/requirejs) NPM packages.

```javascript
paths: {
    toolkit: __dirname + '/node_modules/titon-toolkit/js'
}
```
