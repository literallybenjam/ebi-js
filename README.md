# YT-Seek

A javascript script to seek to specific points in an embedded YouTube player.

## About:

YT-Seek allows you to playback a certain portion of an embedded YouTube player just by clicking on a link.

## Usage:

Run `YT_Seek.init()`, and YT-Seek will search the DOM for all links with the YT-Seek data-attributes, and, if found, attach an event listener to them. Note that this means that you will have to run `YT_Seek.init()` again after dynamically loading YT-Seek content.

There are two data-attributes in YT-SEEK: `data-yt-seek-start` and `data-yt-seek-end`. Set these attributes to the number (in seconds) that you wish to begin and end the range of playback. Not specifying `data-yt-seek-start` will start playback at the beginning of the video, and not specifying `data-yt-seek-end` will make playback go to the end of the video.

Here is a sample link using YT-Seek:

```html
<a href="#ytplayer" data-yt-seek-start="5" data-yt-seek-end="20">text</a>
```

This link will playback the embedded YouTube player with id `ytplayer` for the range 5 to 20 seconds.

## Endmatter:

YT-Seek was coded by [@literallybenjam](https://twitter.com/literallybenjam). It is licensed under [the Unlicense](http://unlicense.org/UNLICENSE).
