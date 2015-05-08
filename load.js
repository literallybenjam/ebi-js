/* jslint asi:true, browser:true */

var Load = {
    event: undefined,
    expandURL: undefined,
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

Load.expandURL = function(url, base) {
    if (url.substr(0,2) === "/\/" || /^[a-zA-Z0-9\-+]*:/.test(url) || base.indexOf("/") === -1) return url;
    else if (url[0] === "/" && (base.substr(0,2) === "/\/" || /^[a-zA-Z0-9\-+]*:\/\//.test(base))) return base.substring(0, base.indexOf("/", base.indexOf("/\/") + 2)) + url;
    else if (url[0] === "/") return base.substring(0, base.indexOf("/")) + url
    else return base.substring(0, base.lastIndexOf("/")) + "/" + url
}

Load.Request = function(method, url, base) {

    this.xhr = new XMLHttpRequest();

    if (!base) base = document.baseURI;

    this.index = undefined;
    if (Object.defineProperties) Object.defineProperties(this, {
        base: {
            value: base
        },
        method: {
            value: method
        },
        url: {
            value: url
        }
    });
    else {
        this.base = base;
        this.method = method;
        this.url = url;
    }
}

Load.Request.prototype = {
    getReadyState: function(event) {
        return this.xhr.readyState;
    },
    handleEvent: function(event) {
        Load.processLines(this.xhr.responseText, Load.expandURL(this.url, this.base));
        Load.requests_loaded |= (1 << this.index);
        if (Load.requests_loaded === ~(~0 << Load.requests.length)) Load.getScripts();
    },
    open: function() {
        if (Load.requests.length > 32) throw "LOAD.js error : Maximum script cap reached";
        if (Object.defineProperty) Object.defineProperty(this, "index", {value: Load.requests.length});
        else this.index = Load.requests.length;
        Load.requests[Load.requests.length] = this;
        this.xhr.open(this.method, Load.expandURL(this.url, this.base), true);
        this.xhr.responseType = "text";
        this.xhr.overrideMimeType("text/plain");
        this.xhr.addEventListener("load", this, false);
    },
    send: function() {
        this.xhr.send();
    }
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
                Load.scripts[Load.scripts.length] = Load.expandURL(lines[i].substr(j).trim(), base);
                break;

        }

    }

    for (i = 0; i < Load.requests.length; i++) {
        if (Load.requests[i].getReadyState() == 1) Load.requests[i].send();
    }

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
