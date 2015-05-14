/* jslint asi:true, browser:true */
/* global YT */

var YT_Seek = {
    init: null,
    handleEvent: null
}

YT_Seek.handleEvent = function(e) {
    var a;
    var n = e.target;
    do if (n.nodeName.toUpperCase() === "A") a = n;
    while (!a && n == n.parentNode);
    if (!a || (a.dataset.yt_seekStart === undefined && a.dataset.yt_seekEnd === undefined)) return;
    var elt = document.getElementById(a.hash.substr(1));
    var start = 0;
    var end = 0;
    if (!elt || !elt.yt_player) return;
    if (Number(a.dataset.yt_seekStart)) start = Number(a.dataset.yt_seekStart);
    if (Number(a.dataset.yt_seekEnd)) end = Number(a.dataset.yt_seekEnd);
    if (start < end) elt.yt_player.loadVideoById({videoId: elt.yt_player.getVideoData().video_id, startSeconds: start, endSeconds: end});
    else elt.yt_player.loadVideoById({videoId: elt.yt_player.getVideoData().video_id, startSeconds: start});
}

YT_Seek.init = function() {
    var tag = document.createElement('script');
    tag.type = "text/javascript";
    tag.src = "https://www.youtube.com/iframe_api";
    document.scripts.item(0).parentNode.insertBefore(tag, document.scripts.item(0));
}

document.documentElement.addEventListener("click", YT_Seek, true);
