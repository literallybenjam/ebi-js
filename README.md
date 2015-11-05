#  EBI-JS  #

Several smaller Javascript packages to perform various tasks. Coded by [@literallybenjam](https://twitter.com/literallybenjam) and licensed under [the Unlicense](http://unlicense.org/UNLICENSE).

##  SCROLL.js  ##

JavaScript to do some real smooth scrolling, yo.

###  Usage:  ###

Just include the script in your document somewhere. It'll handle the rest.

##  RANDOMIZER.js  ##

A javascript script to randomly display one of several options.

###  About:  ###

RANDOMIZER.js finds every element with the class `randomizer` and sets the attribute `hidden` on every child but one, which is then displayed.

###  Usage:  ###

    Randomizer.init();

Simply call `Randomizer.init` and the script will search the page for all elements with class `randomizer` and hide all but one of its children.

It is recommended that you set the `hidden` attribute on all `randomizer` elements, so that they do not display until the script has time to process them, like so:

    <div class="randomizer" hidden>
        …
    </div>

RANDOMIZER.js will automatically remove the `hidden` attribute from `randomizer` elements after they are done processing.

##  EXPORT.js  ##

A javascript script to export the contents of a document to plain text and HTML.

###  About:  ###

EXPORT.js creates two data URIs, one pointing to a plain-text version of a document (with some formatting), and the other to an html document, which is identical to the original but for the following changes:

- all scripts in the `<head>` are removed
- all linked stylesheets are replaced with equivalent `<style>` elements
- if no `<base>` element exists, a new one is created pointing to the original URL (`window.location.href`) of the document

Same-origin checking is done for stylesheets included with `@import` but not for `<link>` elements; be sure to use the `crossorigin` attribute if you need to do a CORS request or your code might break.

###  Usage:  ###

    Export.init(elt, plaintext_source);

Simply call `Export.init` with the element in which to place the links; this element is given as the return value.
Note that all content of this element will be replaced. For example:

    document.body.appendChild(Export.init(document.createElement("FOOTER")));

will create and append a footer with the links to the bottom of the document.

By default, the plain-text version will only contain the contents of the `MAIN` element.
You can change this by providing a second argument when you call `Export.init`, for example:

    Export.init(some_element, document.body);

You can include the `data-no-export` attribute on the root element of the document to prevent exporting.
If this attribute is provided, `Export.init` will instead return a comment node.

###  Plaintext Syntax:  ###

EXPORT.js uses an extended markdown syntax. In particular, the following additions/changes are made:

- `<aside>` elements are represented with `[[…]]`
- `<b>` elements are represented with `§…§`
- `<br>` elements are represented with <code>\\</code> followed by a newline
- `<del>` elements are represented with `--…--`
- `<dfn>` elements are represented with `_…_ `
- `<em>` elements are represented with `*…*`
- `<h1>`–`<h6>` elements take the form `#  …  #`
- `<hr>` elements are represented with `* * *`
- `<i>` elements are represented with `'…'`
- `<iframe>` elements are represented with `[src]`
- `<ins>` elements are represented with `::…::`
- `<li>` elements are always represented using block syntax
- `<q>` elements are represented with `“…”`
- `<small>` elements are represented with `((…))`
- `<s>` elements are represented with `~~…~~`
- `<strong>` elements are represented with `__…__`
- `<sub>` elements are represented with <code>\\_[…]</code>
- `<sup>` elements are represented with <code>\\^[…]</code>

Tables are currently not displayed well in EXPORT.js.
Other elements may be rendered in harder-to-describe ways; for example, definition lists.

##  LOAD.js  ##

A async loader for JavaScript files!

###  Usage:  ###

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

The LOAD.js script may be included anywhere on the page.
It will run automatically after all DOM content is loaded.

LOAD.js requires an additional element, `#load-data`, an explanation for which follows.
Although `#load-data` may technically be any element with an `id` of `load-data`, using a `<script type="text/plain">` element is recommended.

####  Loading JavaScript files individually

To load an individual JavaScript file, simply include the location of the file, as you would have it appear in a `src` attribute, on its own line inside the `#load-data` element.
It may optionally be surrounded by whitespace and be preceded by a single colon.
Here are some examples:

```html
<script type="text/plain" id="load-data">
    some_crazy_script.js
    http://example.com/another_one.js
    : colon_is_ignored.js
</script>
```

####  Loading JavaScript files from an external list

Alternatively, you can put the list of files (as they would appear in `#load-data`) inside a separate text file, and load it asynchronously.
To do this, simply type `GET` or `POST` (depending on the method you wish to use), followed by a colon the URL of the file.
This will send an XMLHttpRequest to access the file, whose contents will be read as plain text.

You can place whitespace before the method, between the method and the colon, and after the colon.

External text files can *also* contain `GET` and `POST` lines, in which case *those* files will also be read.
LOAD.js doesn't currently check to make sure there aren't duplicates, or to prevent endless loops, so be careful when doing this!

####  Comments

You can include comments inside of the `#load-data` element by preceding a line with two colons.
Whitespace can appear before, after, or even in-between these colons, and the entire line will be ignored.

Comments *must* be on their own line, for now.

####  Running scripts after everything is loaded

Upon loading every script, LOAD.js dispatches the `load-complete` event to `document`.
You can use `document.addEventListener("load-complete", someFunction, false)` to listen for this.

####  Other things to consider

LOAD.js creates a new global object, `Load`, in which it stores all of its data.
Don't use `Load` for your own stuff to avoid breaking anything.
There is currently a maximum script cap of 32.

LOAD.js also requires `addEventListener`; be sure to polyfill this before loading LOAD.js if you need to support older browsers.

##  YT Seek  ##

A javascript script to seek to specific points in an embedded YouTube player.

###  About:  ###

YT Seek allows you to playback a certain portion of an embedded YouTube player just by clicking on a link.

###  Usage:  ###

Run `YT_Seek.init()`, and YT Seek will add the YouTube `<iframe>` API to the page.
If you've already done this, there is no need to call the function.

There are two data-attributes in YT Seek: `data-yt_seek-start` and `data-yt_seek-end`.
Set these attributes to the number (in seconds) that you wish to begin and end the range of playback.
Not specifying `data-yt_seek-start` will start playback at the beginning of the video, and not specifying `data-yt_seek-end` will make playback go to the end of the video.

Here is a sample link using YT Seek:

```html
<a href="#ytplayer" data-yt_seek-start="5" data-yt_seek-end="20">text</a>
```

This link will play back the embedded YouTube player with id `ytplayer` for the range 5 to 20 seconds.

