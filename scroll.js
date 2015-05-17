/* jslint asi:true, browser:true */

var Scroll = {
    hash: "#",
    element: null,
    handleEvent: undefined,
    source: null,
    push_state: false,
    advance: undefined,
    starting_location: 0,
    target: 0,
    velocity: 0,
};

Scroll.handleEvent = function(e) {

    switch (e.type) {

        case "click":
            var a;
            var n = e.target;
            do if (n.nodeName.toUpperCase() === "A") a = n;
            while (!a && (n = n.parentNode));
            if (!a || a.hostname !== document.location.hostname || !a.hash || !a.hash.substr(1) || !document.getElementById(a.hash.substr(1))) return;
            Scroll.source = a;
            Scroll.element = document.getElementById(a.hash.substr(1));
            Scroll.starting_location = window.scrollY + window.innerHeight / 3;
            Scroll.target = Scroll.element.getBoundingClientRect().top + window.scrollY;
            Scroll.velocity = 0;
            Scroll.hash = a.hash;
            Scroll.push_state = true;
            e.preventDefault();
            window.requestAnimationFrame(Scroll.advance);
            break;

        case "popstate":
            if (!window.location.hash || !window.location.hash.substr(1) || !document.getElementById(window.location.hash.substr(1))) return;
            Scroll.source = null;
            Scroll.element = document.getElementById(window.location.hash.substr(1));
            Scroll.starting_location = window.scrollY + window.innerHeight / 3;
            Scroll.target = Scroll.element.getBoundingClientRect().top + window.scrollY;
            Scroll.velocity = 0;
            Scroll.hash = window.location.hash;
            Scroll.push_state = false;
            window.requestAnimationFrame(Scroll.advance);
            break;

    }

}

Scroll.advance = function() {
    var max_scroll = window.scrollMaxY;
    if (max_scroll === undefined) max_scroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var current_location = window.scrollY + window.innerHeight / 3;
    if (Math.abs(current_location - Scroll.target) > 1 && max_scroll - window.scrollY >= Scroll.velocity && -1 * window.scrollY <= Scroll.velocity) {
        Scroll.velocity += 2 * (current_location - Scroll.target) / (Scroll.starting_location - Scroll.target) - 1;
        if (Scroll.velocity > 0) window.scrollBy(0, Math.ceil(Scroll.velocity));
        else window.scrollBy(0, Math.floor(Scroll.velocity));
        window.requestAnimationFrame(Scroll.advance);
    }
    else {
        window.scrollBy(0, Scroll.target - Scroll.location);
        Scroll.velocity = 0;
        if (Scroll.push_state) window.history.pushState(null, "", Scroll.hash);
    }
}


document.documentElement.addEventListener("click", Scroll, true);
window.addEventListener("popstate", Scroll, true);
