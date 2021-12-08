# OEG Voices Random Intro Generator
*A fun gizmo to randomize a mix of people saying the same text, where the audio is split into 14 segments each.*

by Alan Levine https://cog.dog or http://cogdogblog.com/

To skip all the explanation, just explore it at https://cogdog.github.io/mixvoices


## The Long Why

This was created as a small bit for the [OEG Voices Podcast](https://voices.oeglobal.org/) I manage and produce for Open Education Global. I have had this idea for a long time to create of those [audio mixes popularized in the Mailchimp ads for the Serial Podcast](https://qz.com/298094/how-mailchimps-irresistible-serial-ad-became-the-years-biggest-marketing-win/).

I ended up writing he text and asking my colleagues at OEGlobal to record their version, and I manually edited it together. This was the opening used for the first year and a half of the show.

<audio controls>
<source src="https://podcast.oeglobal.org/wp-content/uploads/2020/08/oeg-voices-intro-v2.mp3">
Your browser does not support the audio element.
</audio>

This was fine, but I always wanted to do something... more dynamic and random. I put out [a call in our community space asking for people to record the segment](https://connect.oeglobal.org/t/contribute-your-voice-to-oeg-voices-opening-segment/3213) and share it with me (reply there or via email). This is the source content

> Hello and welcome to OEG Voices, a podcast bringing to you the voices and ideas of open educators from around the world. OEG Voices is produced by Open Education Global, a member-based, non-profit organization supporting the development and use of open education globally. Learn more about us at oeglobal.org.
>
> There’s much to take in at a global level. We hope to bring you closer to how open education is working by hearing the stories of practitioners, told in their own voices. Each episode introduces you to a global open educator and we invite you to later engage in conversation with them in our OEG Connect community.

*Hey, if you want top do a version, use something like http://vocaroo.com and send me a link.*

I split each into 14 segments, each the same text. That is maybe the time consuming part, and saved them each in a directory **segment-1**, **segment-2**, etc... and used a convention of file names of `firstname-segment.mp3` so my files might be  **segment-1/alan-1.mp3**, **segment-2/alan-2.mp3**

I manually edited the first one, but always had in mind making a web site that could generate random mixes, and if I dreamed really big, a simple way to string them all together.

That is here now https://cogdog.github.io/mixvoices

## The Sloppy How

Without thinking too much, I had my hopes on a  script I could write to generate dynamically a .m3u playlist that could be dynamically assemble and played back. Then I found that web based audio players were relicts of the past, full of flash dead cruft. What happened to the free JWPlayer? it's all $$$

Back to the hacking. I found [a blog post by "pro9ram"](https://pro9ram.wordpress.com/2013/02/21/playing-html-5-audio-sequentially-via-javascript/) that had the basics of the answer- create a series of Audio objects in JavaScript and use an event to track when they ended and then play the next.

The rabbit hole got deeper first by needing to come up with some array structures to track the nick names, real names, and also an array indicating which segments where recorded (in some cases I have people take turns). And then there is the special case of segment-2 which I extract just the phrase "OEG Voices" that I repeat 3 times with different voices.

I now have it going, plus I built in a pause/play/resume button, some jQuery to change the name of the active speaker.

The biggest challenge was trying to find a way to stitch them all together without doing manual audio editing. The command

    cat somefile.mp3 anotherfile.mp3 yetathird.mp3 > mix.mp3 
    
sort of worked, but the file ended up with inaccurate time length. Finally this was the winning solution

    ffmpeg -f concat -safe 0 -i voices.txt -c copy mix.mp3
    
If I created a voices.txt file with the structure:

    file 'somefile.mp3'
    file 'anotherfile.mp3'
    file 'yetathird.mp3'
    
So I found a way to generate this as text reported to the site (and possibly downloaded as a text file).

There it is, all here in the `docs/index.html` file is Alan's long winded non optimal but working javascript

## The Dependencies

I am loading everything script and css wise from CDNs, at least for now, in the interest of lazy simplicity. These include:

* Bootstrap
* Bootstrap Icons
* jQuery
* Backstretch.js for the nifty background image filling

## What Else?

Nothing, but I hate skimpy or dull ReadMes. You be the judge. But to follo all  action or toss one in your self, [click over to OEG Connect](https://connect.oeglobal.org/t/contribute-your-voice-to-oeg-voices-opening-segment/3213)
*





