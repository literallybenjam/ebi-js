# YT Seek

A javascript script to seek to specific points in an embedded YouTube player.

## About:

YT Seek allows you to playback a certain portion of an embedded YouTube player just by clicking on a link.

## Usage:

Run `YT_Seek.init()`, and YT Seek will add the YouTube `<iframe>` API to the page. If you've already done this, there is no need to call the function.

There are two data-attributes in YT Seek: `data-yt_seek-start` and `data-yt_seek-end`. Set these attributes to the number (in seconds) that you wish to begin and end the range of playback. Not specifying `data-yt_seek-start` will start playback at the beginning of the video, and not specifying `data-yt_seek-end` will make playback go to the end of the video.

Here is a sample link using YT Seek:

```html
<a href="#ytplayer" data-yt_seek-start="5" data-yt_seek-end="20">text</a>
```

This link will play back the embedded YouTube player with id `ytplayer` for the range 5 to 20 seconds.

## Endmatter:

YT Seek was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
