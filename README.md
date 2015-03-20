# RANDOMIZER.js

A javascript script to randomly display one of several options.

## About:

RANDOMIZER.js finds every element with the class `randomizer` and sets the attribute `hidden` on every child but one, which is then displayed.

## Usage:

    Randomizer.init();

Simply call `Randomizer.init` and the script will search the page for all elements with class `randomizer` and hide all but one of its children.

It is recommended that you set the `hidden` attribute on all `randomizer` elements, so that they do not display until the script has time to process them, like so:

    <div class="randomizer" hidden>
        …
    </div>

RANDOMIZER.js will automatically remove the `hidden` attribute from `randomizer` elements after they are done processing.

## Endmatter:

RANDOMIZER.js was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
