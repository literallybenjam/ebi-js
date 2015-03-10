# EXPORT.js

A javascript script to export the contents of a document to plain text and HTML.

## Usage:

    Export.init(elt, plaintext_source);

Simply call `Export.init` with the element in which to place the links. Note that all content of this element will be replaced. For example:

    var footer = document.createElement("FOOTER");
    Export.init(footer);
    document.body.appendChild(footer);

will create and append a footer with the links to the bottom of the document.

By default, the plain-text version will only contain the contents of the `MAIN` element. You can change this by providing a second argument when you call `Export.init`, for example:

    Export.init(footer, document.body);

## Endmatter:

EXPORT.js was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
