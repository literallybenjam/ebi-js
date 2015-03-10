# EXPORT.js

A javascript script to export the contents of a document to plain text and HTML.

## Usage:

    Export.init(elt, plaintext_source);

Simply call `Export.init` with the element in which to place the links; this element is given as the return value. Note that all content of this element will be replaced. For example:

    document.body.appendChild(Export.init(document.createElement("FOOTER")));

will create and append a footer with the links to the bottom of the document.

By default, the plain-text version will only contain the contents of the `MAIN` element. You can change this by providing a second argument when you call `Export.init`, for example:

    Export.init(some_element, document.body);

You can include the `data-no-export` attribute on the root element of the document to prevent exporting.

## Endmatter:

EXPORT.js was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
