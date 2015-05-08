/* jslint asi:true, browser:true */

var Load = {
    event: undefined,
    init: undefined,
    getScripts: undefined,
    processLines: undefined,
    processRequest: undefined,
    processScript: undefined,
    Request: undefined,
    requests: [],
    requests_loaded: 0,
    scripts: [],
    scripts_loaded: 0
}

if (typeof(Event) === "function") Load.event = new Event("load-complete");
else {
    Load.event = document.createEvent("Event");
    Load.event.initEvent("load-complete");
}

Load.Request = function(method, url, base) {

    this.xhr = new XMLHttpRequest();

    var parent;
    if (url.lastIndexOf("/") == -1) parent = "";
    else parent = url.substring(0, url.lastIndexOf("/"));

    if (!base) base = document.baseURI;
    if (base[base.length - 1] === "/") base = base.substr(0, base.length - 1);

    this.index = undefined;
    if (Object.defineProperties) Object.defineProperties(this, {
        base: {
            value: base
        },
        method: {
            value: method
        },
        parent: {
            value: parent
        },
        url: {
            value: url
        }
    });
    else {
        this.base = base;
        this.method = method;
        this.parent = parent;
        this.url = url;
    }
}

Load.Request.prototype = {
    load_event: undefined,
    open: function() {
        if (Object.defineProperty) Object.defineProperty(this, "index", {value: Load.requests.length});
        else this.index = Load.requests.length;
        Load.requests[Load.requests.length] = this;
        if (this.url.substr(0,2) === "/\/" || /^[a-zA-Z0-9\-+]*:/.test(this.url) !== -1) this.xhr.open(this.method, this.url, true);
        else if (this.url[0] === "/" && this.base.lastIndexOf("/") !== -1) this.xhr.open(this.method, this.base.substring(0, this.base.lastIndexOf("/") + 1) + this.url, true);
        else this.xhr.open(this.method, this.base + "/" + this.url, true);
        this.xhr.responseType = "text";
        this.xhr.overrideMimeType("text/plain");
        this.xhr.addEventListener("load", this.reportLoaded, false);
        this.addEventListener("load", Load.processRequest, false);
    },
    reportLoaded: function() {
        this.dispatchEvent(Load.Request.prototype.load_event);
    }
}

if (typeof(Event) === "function") Load.Request.prototype.load_event = new Event("load");
else {
    Load.Request.prototype.load_event = document.createEvent("Event");
    Load.Request.prototype.load_event.initEvent("load");
}

Load.getScripts = function() {
    var i;
    var tag;
    var last_script;
    if (!Load.scripts.length) {
        document.dispatchEvent(Load.event);
        return;
    }
    for (i = 0; i < Load.scripts.length; i++) {
        tag = document.createElement('script');
        last_script = document.scripts.item(document.scripts.length -1);
        tag.addEventListener("load", Load.processScript, false);
        tag.type = "text/javascript";
        tag.src = Load.scripts[i];
        tag.dataset.loadIndex = i;
        if (last_script.nextSibling) last_script.parentNode.insertBefore(tag, last_script.nextSibling);
        else last_script.parentNode.appendChild(tag);
    }
}

Load.processLines = function(text, base) {

    var lines;
    var line_type;
    var i;
    var j;
    var u;

    lines = text.split("\n");
    for (i = 0; i < lines.length; i++) {

        j = 0;
        if (lines[i].trim() === "" || /^\s*:\s*:/.test(lines[i])) continue;
        else if (/^\s*GET\s*:/.test(lines[i].toUpperCase())) line_type = "GET";
        else if (/^\s*POST\s*:/.test(lines[i].toUpperCase())) line_type = "POST";
        else line_type = "";

        switch (line_type) {

            case "GET":
                while (/\s/.test(lines[i].charAt(j))) j++;
                j += 3;  //  GET
                while (/\s/.test(lines[i].charAt(j))) j++;
                j++;  //  colon
                (new Load.Request("GET", lines[i].substr(j).trim(), base)).open();
                break;

            case "POST":
                while (/\s/.test(lines[i].charAt(j))) j++;
                j += 4;  //  POST
                while (/\s/.test(lines[i].charAt(j))) j++;
                j++;  //  colon
                (new Load.Request("GET", lines[i].substr(j).trim(), base)).open();
                break;

            default:
                while (/\s/.test(lines[i].charAt(j))) j++;
                if (lines[i].charAt(j) == ":") j++;
                Load.scripts[Load.scripts.length] = lines[i].substr(j).trim();
                break;

        }

    }

    for (i = 0; i < Load.requests.length; i++) {
        if (Load.requests[i].readyState == 1) Load.requests[i].send();
    }

}

Load.processRequest = function() {
    Load.processLines(this.responseText, this.parent);
    Load.requests_loaded |= (1 << this.index);
    if (Load.requests_loaded === ~(~0 << Load.requests.length)) Load.getScripts();
}

Load.processScript = function() {
    Load.scripts_loaded |= (1 << Number(this.dataset.loadIndex));
    if (Load.scripts_loaded === ~(~0 << Load.scripts.length)) document.dispatchEvent(Load.event);
}

Load.init = function() {
    if (!document.getElementById("load-data")) document.dispatchEvent(Load.event);
    else if (document.getElementById("load-data").tagName.toUpperCase() === "SCRIPT") Load.processLines(document.getElementById("load-data").text);
    else Load.processLines(document.getElementById("load-data").textContent);
}

document.addEventListener("DOMContentLoaded", Load.init, false);
