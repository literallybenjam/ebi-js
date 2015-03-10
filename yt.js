/* jslint asi:true, browser:true */
/* global YT */

var YT_Seek = {
    frames: null,
    init: null,
    processScroll: null
}

function onYouTubeIframeAPIReady() {
    var i;
    YT_Seek.frames = document.querySelectorAll('iframe[src*="//youtube.com/embed/"], iframe[src*="//www.youtube.com/embed/"]');
    for (i = 0; i < YT_Seek.frames.length; i++) {
        YT_Seek.frames.item(i).yt_player = new YT.Player(YT_Seek.frames.item(i));
        YT_Seek.frames.item(i).addEventListener("hashchange", YT_Seek.processScroll, false);
    }
}

YT_Seek.processScroll = function() {
    var elt = document.getElementById(window.location.hash.substr(1));
    var start = 0;
    var end = 0;
    if (!elt) return;
    if (Number(elt.dataset.ytStart)) start = Number(elt.dataset.ytStart);
    if (Number(elt.dataset.ytEnd)) end = Number(elt.dataset.ytEnd);
    if (start < end) this.yt_player.loadVideoById({videoId: this.yt_player.getVideoData().video_id, startSeconds: start, endSeconds: end});
    else this.yt_player.loadVideoById({videoId: this.yt_player.getVideoData().video_id, startSeconds: start});
}

YT_Seek.init = function() {
    var tag = document.createElement('script');
    tag.type = "text/javascript";
    tag.src = "https://www.youtube.com/iframe_api";
    document.scripts.item(0).parentNode.insertBefore(tag, document.scripts.item(0));
}
