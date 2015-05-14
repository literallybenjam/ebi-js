/* jslint asi:true, browser:true */
/* global CSSRule */

var Export = {
    exportNode: null,
    getHTML: null,
    init: null,
    readStyleSheet: null,
}

Export.readStyleSheet = function(ss) {
    var i;
    var styles = "";
    var imports = "";
    if (!ss.cssRules) return;
    for (i = 0; i < ss.cssRules.length; i++) {
        if (ss.cssRules.item(i).type === CSSRule.IMPORT_RULE) {
            if (ss.cssRules.item(i).href.indexOf(":") === -1 || ss.cssRules.item(i).href.substr(0, window.location.origin) === window.location.origin) {
                styles += Export.readStyleSheet(ss.cssRules.item(i).styleSheet).styles;
                imports += Export.readStyleSheet(ss.cssRules.item(i).styleSheet).imports;
            }
            else imports += ss.cssRules.item(i).cssText;
        }
        else styles += ss.cssRules.item(i).cssText;
    }
    return {styles: styles, imports: imports};
}

Export.getHTML = function() {
    var i;
    var s = "<!DOCTYPE html>\n<!--  '" + document.title + "', originally located at " + window.location.href + '  -->\n<html';
    if (document.documentElement.hasAttributes()) {
        for (i = 0; i < document.documentElement.attributes.length; i++) {
            s += " " + document.documentElement.attributes.item(i).name + '="' + document.documentElement.attributes.item(i).value + '"';
        }
    }
    s += ">\n    <head";
    if (document.head.hasAttributes()) {
        for (i = 0; i < document.head.attributes.length; i++) {
            s += " " + document.head.attributes.item(i).name + '="' + document.head.attributes.item(i).value + '"';
        }
    }
    s += ">\n";
    if (!document.head.getElementsByTagName("BASE").length) {
        s += '        <base href="' + window.location.href + '">\n';
    }
    for (i = 0; i < document.head.children.length; i++) {
        switch (document.head.children.item(i).tagName) {
            case "LINK":
                if (document.head.children.item(i).rel == "stylesheet") {
                    s += "        <style";
                    if (document.head.children.item(i).type) s += ' type="' + document.head.children.item(i).type + '"';
                    if (document.head.children.item(i).media) s += ' media="' + document.head.children.item(i).media + '"';
                    s += ">" + Export.readStyleSheet(document.head.children.item(i).sheet).imports + Export.readStyleSheet(document.head.children.item(i).sheet).styles + "</style>\n";
                }
                else s += "        " + document.head.children.item(i).outerHTML + "\n";
                break;

            case "SCRIPT":
                s += "        <!--  script omitted  -->\n";
                break;

            default:
                s += "        " + document.head.children.item(i).outerHTML + "\n";
                break;
        }
    }
    s += "    </head>\n    " + document.body.outerHTML + "\n</html>";
    return s;
}

Export.exportNode = function(node) {
    var s = "";
    var i;
    if (!node) {
        return s;
    }
    switch (node.nodeType) {

        case Node.TEXT_NODE:
            s = node.textContent.replace(/\s+/g, " ");
            break;

        case Node.ELEMENT_NODE:
            if (node.classList.contains("export-link") || node.classList.contains("export-hidden")) break;
            for (i = 0; i < node.childNodes.length; i++) {
                s += Export.exportNode(node.childNodes.item(i));
            }
            s = s.trim();
            switch (node.tagName) {

                case "A":
                    s += " [" + s + "](" + node.href + ")";
                    break;

                case "ASIDE":
                    s = "\n\n[[" + s + "]]\n\n";
                    break;

                case "B":
                    s = "§" + s + "§";
                    break;

                case "BLOCKQUOTE":
                    s = ("\n\n" + s.replace(/\s+$/, "").replace(/^\s+/, "")).replace(/ *\n */g, "\n").replace(/\n/g, "\n> ");
                    break;

                case "BR":
                    s = "\\\n";
                    break;

                case "CODE":
                    s = "`" + s + "`";
                    break;

                case "DEL":
                    s = "--" + s + "--";
                    break;

                case "DFN":
                    s = "_" + s + "_";
                    break;

                case "DT":
                    s = "\n\n" + s + ": ";
                    break;

                case "EM":
                    s = "*" + s + "*";
                    break;

                case "FIGCAPTION":
                    s = "\n\n– " + s + "\n\n";
                    break;

                case "FIGURE":
                    s = "\n\n" + s + "\n\n";
                    break;

                case "H1":
                    s = "\n\n#  " + s + "  #\n\n";
                    break;

                case "H2":
                    s = "\n\n##  " + s + "  ##\n\n";
                    break;

                case "H3":
                    s = "\n\n###  " + s + "  ###\n\n";
                    break;

                case "H4":
                    s = "\n\n####  " + s + "  ####\n\n";
                    break;

                case "H5":
                    s = "\n\n#####  " + s + "  #####\n\n";
                    break;

                case "H6":
                    s = "\n\n######  " + s + "  ######\n\n";
                    break;

                case "HR":
                    s = "\n\n* * *\n\n";
                    break;

                case "I":
                    s = "'" + s + "'";
                    break;

                case "IFRAME":
                    s = "\n\n[" + node.src + "]\n\n";
                    break;

                case "IMG":
                    if (node.alt) s = "!["+ node.alt + "](" + node.src + ")";
                    else s = "![image](" + node.src + ")";
                    break;

                case "INS":
                    s = "::" + s + "::";
                    break;

                case "LI":
                    if (node.parentElement.tagName === "OL") {
                        for (i = 0; i < node.parentElement.children.length; i++) {
                            if (node.parentElement.children.item(i) === node) break;
                        }
                        s = "\n\n" + (i + 1) + ". " + s + "\n\n";
                    }
                    else s = "\n\n- " + s + "\n\n";
                    break;

                case "P":
                    s = "\n\n" + s + "\n\n";
                    break;

                case "Q":
                    s = "“" + s + "”";
                    break;

                case "SMALL":
                    s = "((" + s + "))";
                    break;

                case "S":
                    s = "~~" + s + "~~";
                    break;

                case "STRONG":
                    s = "__" + s + "__";
                    break;

                case "SUB":
                    s = "\\_[" + s + "]";
                    break;

                case "SUP":
                    s = "\\^[" + s + "]";
                    break;
            }
            break;

        default:
            break;

    }
    return s.replace(/ +/g, " ").replace(/ *\n */g, "\n").replace(/\n\n+/g, "\n\n");
}

Export.init = function(elt, plaintext_source) {
    if (!plaintext_source) plaintext_source = document.getElementsByTagName("MAIN").item(0);
    if (document.documentElement.dataset.noExport !== undefined) return document.createComment("export cancelled due to presence of 'data-no-export' in document root");
    var plaintext = Export.exportNode(plaintext_source).trim()
    var html = Export.getHTML();
    elt.innerHTML = 'download: <a href="data:text/plain;charset=utf-8,' + encodeURIComponent(plaintext) + '" download="' + document.title + '.txt" target="_blank">plain text</a> / <a href="data:text/html;charset=utf-8,' + encodeURIComponent(html) + '" download="' + document.title + '.html" target="_blank">html</a>';
    return elt;
}
