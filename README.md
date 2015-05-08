# LOAD.js

A async loader for JavaScript files!

## Usage:

Here's a sample HTML file using LOAD.js:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Sample LOAD.js file</title>
        <script type="text/javascript" src="/load.js"></script>
        <script type="text/plain" id="load-data">
            :: Here are some files ::
            GET : /load/some_list_of_scripts.txt
                : /an_extra_script.js
        </script>
        <script type="text/javascript">
            document.addEventListener("load-complete", function() {document.body.innerHTML = "All good!"}, false);
        </script>
    </head>
    <body>
        <p>Still loading…</p>
    </body>
</html>
```

The LOAD.js script may be included anywhere on the page. It will run automatically after all DOM content is loaded.

LOAD.js requires an additional element, `#load-data`, an explanation for which follows. Although `#load-data` may technically be any element with an `id` of `load-data`, using a `<script type="text/plain">` element is recommended.

### Loading JavaScript files individually:

To load an individual JavaScript file, simply include the location of the file, as you would have it appear in a `src` attribute, on its own line inside the `#load-data` element. It may optionally be surrounded by whitespace and be preceded by a single colon. Here are some examples:

```html
<script type="text/plain" id="load-data">
    some_crazy_script.js
    http://example.com/another_one.js
    : colon_is_ignored.js
</script>
```

### Loading JavaScript files from an external list:

Alternatively, you can put the list of files (as they would appear in `#load-data`) inside a separate text file, and load it asynchronously. To do this, simply type `GET` or `POST` (depending on the method you wish to use), followed by a colon the URL of the file. This will send an XMLHttpRequest to access the file, whose contents will be read as plain text.

You can place whitespace before the method, between the method and the colon, and after the colon.

External text files can *also* contain `GET` and `POST` lines, in which case *those* files will also be read. LOAD.js doesn't currently check to make sure there aren't duplicates, or to prevent endless loops, so be careful when doing this!

### Comments:

You can include comments inside of the `#load-data` element by preceding a line with two colons. Whitespace can appear before, after, or even in-between these colons, and the entire line will be ignored.

Comments *must* be on their own line, for now.

### Running scripts after everything is loaded:

Upon loading every script, LOAD.js dispatches the `load-complete` event to `document`. You can use `document.addEventListener("load-complete", someFunction, false)` to listen for this.

### Other things to consider:

LOAD.js creates a new global object, `Load`, in which it stores all of its data. Don't use `Load` for your own stuff to avoid breaking anything.

Reading external files with LOAD.js requires `Object.create()` support.
Be sure to polyfill this before including LOAD.js if you need to support older browsers.

## Endmatter:

LOAD.js was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
