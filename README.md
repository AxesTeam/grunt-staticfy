# grunt-staticfy

> Staticfy your website

## Getting Started
This plugin requires Grunt `~0.4.4` and `phantomjs`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-staticfy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-staticfy');
```

## The "staticfy" task

### Overview
In your project's Gruntfile, add a section named `staticfy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	staticfy: {
		options: {
			// Task-specific options go here.
		},
		your_target: {
			// Target-specific file lists and/or options go here.
		},
	},
});
```

### Options

#### options.server_host
Type: `String`
Default value: `'http://localhost'`

#### options.inject_script
Type: `function`
Default value: `function(){}`

#### options.onfinish
Type: `function`
Default value: `function(str){return str;}`

### Usage Examples

#### Default Options

```js
grunt.initConfig({
	staticfy: {
		staticfy_simple_page: {
		    files: {
		        'dest.html': ['original.html']
		    }
		}
	}
});
```

Here is the a html with script:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<script type="text/javascript">
    document.writeln('success');
</script>
</body>
</html>
```

The script on page `document.writeln('success');` would be executed and the compiled page is:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<script type="text/javascript">
    document.writeln('success');
</script>
success
</body>
</html>
```

#### Custom Options

**option.inject_script**

Once the page is loaded, the inject script would be executed.

```js
grunt.initConfig({
	staticfy: {
		option_inject_script: {
		    options: {
		        inject_script: function () {
		            document.body.innerHTML = 'this line is made by inject script';
		        }
		    },
		    files: {
		        'dest.html': ['original.html']
		    }
		}
	}
});
```

This is the original html, no script on page.

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
original text
</body>
</html>
```

The inject script `document.body.innerHTML = 'this line is made by inject script';` would be executed, so the compiled html is:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
this line is made by inject script
</body>
</html>
```

**option.onfinish**

```js
grunt.initConfig({
  staticfy: {
    option_on_finish: {
        options: {
            onfinish: function (str) {
                grunt.log.writeln(str.replace(/\<!-- remove start --\>[\w\W]*\<!-- remove end --\>/gi, ''));
                return str.replace(/\<!-- remove start --\>[\w\W]*\<!-- remove end --\>/gi, '');
            }
        },
        files: {
	        'dest.html': ['original.html']
        }
    }
  }
});
```

Original html

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<!-- remove start -->
this will be remove
<!-- remove end -->
this will not be remove
</body>
</html>
```

Compiled html

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
this will not be remove
</body>
</html>
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
