/* jslint asi:true, browser:true */
/* global YT */

var YT_Seek = {
    init: null,
    handleEvent: null
}

YT_Seek.handleEvent = function(e) {
    if (e.type !== "click") return;
    if (e.target.nodeName.toUpperCase() !== "A") return;
    if (e.target.dataset.yt_seekStart !== undefined && e.target.dataset.yt_seekEnd !== undefined) return;
    var elt = document.getElementById(e.target.hash.substr(1));
    var start = 0;
    var end = 0;
    if (!elt || !elt.yt_player) return;
    if (Number(e.target.dataset.yt_seekStart)) start = Number(e.target.dataset.yt_seekStart);
    if (Number(e.target.dataset.yt_seekEnd)) end = Number(e.target.dataset.yt_seekEnd);
    if (start < end) elt.yt_player.loadVideoById({videoId: elt.yt_player.getVideoData().video_id, startSeconds: start, endSeconds: end});
    else elt.yt_player.loadVideoById({videoId: elt.yt_player.getVideoData().video_id, startSeconds: start});
}

YT_Seek.init = function() {
    var tag = document.createElement('script');
    tag.type = "text/javascript";
    tag.src = "https://www.youtube.com/iframe_api";
    document.scripts.item(0).parentNode.insertBefore(tag, document.scripts.item(0));
}

document.addEventListener("click", YT_Seek, true);
