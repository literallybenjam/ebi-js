/* jslint asi:true, browser:true */

var Load = {
    event: undefined,
    init: undefined,
    getScripts: undefined,
    processLines: undefined,
    processRequest: undefined,
    processScript: undefined,
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

Load.processLines = function(text) {

    var lines;
    var line_type;
    var i;
    var j;
    var k;

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
                k = Load.requests.length;
                Load.requests[k] = new XMLHttpRequest();
                Load.requests[k].open("GET", lines[i].substr(j).trim(), true);
                Load.requests[k].responseType = "text";
                Load.requests[k].overrideMimeType("text/plain");
                Load.requests[k].loadIndex = k;
                Load.requests[k].addEventListener("load", Load.processRequest, false);
                break;

            case "POST":
                while (/\s/.test(lines[i].charAt(j))) j++;
                j += 4;  //  POST
                while (/\s/.test(lines[i].charAt(j))) j++;
                j++;  //  colon
                k = Load.requests.length;
                Load.requests[k] = new XMLHttpRequest();
                Load.requests[k].open("POST", lines[i].substr(j).trim(), true);
                Load.requests[k].responseType = "text";
                Load.requests[k].overrideMimeType("text/plain");
                Load.requests[k].loadIndex = k;
                Load.requests[k].addEventListener("load", Load.processRequest, false);
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
    Load.processLines(this.responseText);
    Load.requests_loaded |= (1 << this.loadIndex);
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
