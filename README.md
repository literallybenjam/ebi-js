# EXPORT.js

A javascript script to export the contents of a document to plain text and HTML.

## About:

EXPORT.js creates two data URIs, one pointing to a plain-text version of a document (with some formatting), and the other to an html document, which is identical to the original but for the following changes:

- all scripts in the `<head>` are removed
- all linked stylesheets are replaced with equivalent `<style>` elements
- if no `<base>` element exists, a new one is created pointing to the original URL (`window.location.href`) of the document

Same-origin checking is done for stylesheets included with `@import` but not for `<link>` elements; be sure to use the `crossorigin` attribute if you need to do a CORS request or your code might break.

## Usage:

    Export.init(elt, plaintext_source);

Simply call `Export.init` with the element in which to place the links; this element is given as the return value. Note that all content of this element will be replaced. For example:

    document.body.appendChild(Export.init(document.createElement("FOOTER")));

will create and append a footer with the links to the bottom of the document.

By default, the plain-text version will only contain the contents of the `MAIN` element. You can change this by providing a second argument when you call `Export.init`, for example:

    Export.init(some_element, document.body);

You can include the `data-no-export` attribute on the root element of the document to prevent exporting. If this attribute is provided, `Export.init` will instead return a comment node.

## Plaintext Syntax:

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
- `<sub>` elements are represented with `\\_[…]`
- `<sup>` elements are represented with `\\^[…]`

Tables are currently not displayed well in EXPORT.js. Other elements may be rendered in harder-to-describe ways; for example, definition lists.

## Endmatter:

EXPORT.js was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
