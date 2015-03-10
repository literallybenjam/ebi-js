/* jslint asi:true, browser:true */
/* global YT */

var YT_Seek = {
    frames: null,
    init: null,
    processLinks: null,
    cueVideo: null
}

function onYouTubeIframeAPIReady() {
    var i;
    YT_Seek.frames = document.querySelectorAll('iframe[src*="//youtube.com/embed/"], iframe[src*="//www.youtube.com/embed/"]');
    for (i = 0; i < YT_Seek.frames.length; i++) {
        YT_Seek.frames.item(i).yt_player = new YT.Player(YT_Seek.frames.item(i));
        YT_Seek.frames.item(i).addEventListener("hashchange", YT_Seek.cueVideo, false);
    }
}

YT_Seek.processLinks = function() {
    var hashLinks = document.querySelectorAll('a[href^="#"][yt-seek-start], a[href^="#"][yt-seek-end]');
    for (var i = 0; i < hashLinks.length; i++) {
        hashLinks.item(i).addEventListener("click", YT_Seek.cueVideo, false);
    }
}

YT_Seek.cueVideo = function() {
    var elt = document.getElementById(this.href.substr(1));
    var start = 0;
    var end = 0;
    if (!elt || !elt.yt_player) return;
    if (Number(this.dataset.ytSeekStart)) start = Number(this.dataset.ytSeekStart);
    if (Number(this.dataset.ytSeekEnd)) end = Number(this.dataset.ytSeekEnd);
    if (start < end) elt.yt_player.cueVideoById({videoId: this.yt_player.getVideoData().video_id, startSeconds: start, endSeconds: end});
    else elt.yt_player.cueVideoById({videoId: this.yt_player.getVideoData().video_id, startSeconds: start});
}

YT_Seek.init = function() {
    var tag = document.createElement('script');
    tag.type = "text/javascript";
    tag.src = "https://www.youtube.com/iframe_api";
    document.scripts.item(0).parentNode.insertBefore(tag, document.scripts.item(0));
    window.addEventListener("hashchange", function() {if (document.getElementById(window.location.hash.substr(1)) && document.getElementById(window.location.hash.substr(1)).yt_player) document.getElementById(window.location.hash.substr(1)).yt_player.playVideo();}, false);
}
