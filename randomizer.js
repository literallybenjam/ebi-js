/* jslint asi:true, browser:true */
/* global CSSRule */

var Randomizer = {
    randomizers: undefined
}

Randomizer.init = function() {
    Randomizer.randomizers = document.getElementsByClassName("randomizer");
    for (var i = 0; i < Randomizer.randomizers.length; i++) {
        var randomizer_items = Randomizer.randomizers.item(i).children;
        if (randomizer_items) {
            var random_index = Math.floor(Math.random() * randomizer_items.length);
            for (var ii = 0; ii < randomizer_items.length; ii++) {
                if (ii != random_index) randomizer_items.item(ii).setAttribute("hidden","");
                else if (randomizer_items.item(ii).hasAttribute("hidden")) randomizer_items.item(ii).removeAttribute("hidden");
            }
        }
        if (Randomizer.randomizers.item(i).hasAttribute("hidden")) Randomizer.randomizers.item(i).removeAttribute("hidden");
    }
}
