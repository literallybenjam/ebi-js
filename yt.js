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
        YT_Seek.frames.item(i).addEventListener("scrolledTo", YT_Seek.processScroll, false);
    }
}

YT_Seek.processScroll = function(e) {
    if (!e.detail || !e.detail.source) return;
    var start = 0;
    var end = 0;
    if (Number(e.detail.source.dataset.ytStart)) start = Number(e.detail.source.dataset.ytStart);
    if (Number(e.detail.source.dataset.ytEnd)) end = Number(e.detail.source.dataset.ytEnd);
    if (start < end) this.yt_player.loadVideoById({videoId: this.yt_player.getVideoData().video_id, startSeconds: start, endSeconds: end});
    else this.yt_player.loadVideoById({videoId: this.yt_player.getVideoData().video_id, startSeconds: start});
}

YT_Seek.init = function() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.insertBefore(tag, document.head.firstElementChild);
}

document.addEventListener("DOMContentLoaded", YT_Seek.init, false);
