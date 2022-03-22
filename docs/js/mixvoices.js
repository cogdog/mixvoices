


// backstrech the background image -->
 $.backstretch("background.jpg");

// Get the URL query parameters
// h/t ----- http://stackoverflow.com/a/3855394/2418186

const urlParams = new URLSearchParams(window.location.search);
const myPlaylist = urlParams.get('playlist');

 
var people = [
	{"id" : "ajita" , "name" : "Ajita D", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]}, 
	{"id" : "shannon" , "name" : "Shannon S", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]}, 
	{"id" : "judith" , "name" : "Judith S", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "rajiv" , "name" : "Rajiv J", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "alex" , "name" : "Alex E", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "lena" , "name" : "Lena P", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "lori-beth" , "name" : "Lori-Beth L", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "cynthia" , "name" : "Cynthia O", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "shinta" , "name" : "Shinta H", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "alan" , "name" : "Alan L", "segments" : [2]},
	{"id" : "marcela" , "name" : "Marcela M", "segments" : [2]},
	{"id" : "una" , "name" : "Una D", "segments" : [2]},
	{"id" : "paul" , "name" : "Paul S", "segments" : [2]},
	{"id" : "igor" , "name" : "Igor L", "segments" : [2]},
	{"id" : "kristin" , "name" : "Kristin H", "segments" : [1,2,3,4,5,6,7]},
	{"id" : "joran" , "name" : "Jöran M-M", "segments" : [8,9,10,11,12,13,14]},
	{"id" : "kevin" , "name" : "Kevin H", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "isla" , "name" : "Isla H-F", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "maren" , "name" : "Maren D", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "clint" , "name" : "Clint L", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
	{"id" : "nicole" , "name" : "Nicole N", "segments" : [1,2,3,4,5,6,7]},
	{"id" : "verena" , "name" : "Verna R", "segments" : [8,9,10,11,12,13,14]},
	{"id" : "gino" , "name" : "Gino F", "segments" : [1,2,3,4,6,7]},
	{"id" : "werner" , "name" : "Werner W", "segments" : [8,9,10,11,12,13,14]},
	{"id" : "bonni" , "name" : "Bonni S", "segments" : [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
];

// the text for each segment, will be displayed under speakers name as it plays
var segment_text = [
	"Hello and welcome to OEG Voices",
	"OEG Voices",
	"OEG Voices",
	"OEG Voices",
	 "a podcast bringing to you the voices and ideas of open educators from around the world",
	 "OEG Voices is produced by Open Education Global",
	 "a member-based, non-profit organization",
	 "supporting the development and use of open education globally",
	 "Learn more about us at oeglobal.org",
	 "There’s much to take in at a global level",
	 "We hope to bring you closer to how open education is working", 
	 "by hearing the stories of practitioners",
	 "told in their own voices",
	 "Each episode introduces you to a global open educator",
	 "and we invite you to later engage in conversation with them",
	 "in our OEG Connect community"
]

var numsegments = 14; // number of segments in this mix

// lame I know, global variables. Sue me. Initialize!


var voices = []; // holds voices in this mix
var speakers = []; // lists speaker names used
var ids = []; // lists voices used by id
var sndx = -1; // current item to play in voices[]
var paused = false; // pause state

// check for URL parameter for playback
if (myPlaylist) {
	// convert text list to array
	ids = atob(myPlaylist).split(",");
} else {
	// new so no indices, Yet
	ids = [];
}

// 
function getrandom( array ) {
	// Fisher-Yates Shuffle h/t https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	 }
	 // return the last element of the shuffle array
	 return array.pop();
}

function getAllNames() {
	let allnames = [];
	for  (let m = 0; m < people.length ; m++) {
		allnames.push(people[m].name);
	}
	
	$( "#namelist" ).html('<p>Thanks to all voice contributors <strong>' + allnames.sort().join("</strong>, <strong>") + '</strong></p>');
}

function getNameFromID (findit) {
	for  (let i = 0; i < people.length; i++) {
		if (people[i].id == findit) return people[i].name;
	}
	
	return '';
}


function getPathFromUrl(url) {
  return url.split("?")[0];
}

function getReplayLink(idlist) {
	// generate a URL to provide a playback link where paramater is encoded string of audio ids
	return ( getPathFromUrl(window.location.href) + '?playlist=' + btoa(idlist.join()) );
}

function mixaudio(max) {
	$( "#speaking" ).text('Mixing...');
	// reset globals
	voices = []; 
	speakers = []; 
	ids = []; 

	let alltracks = [];
	let track2 = [];
	let credits = [];
	let ffmpegtxt = '# OEG Voices Random Intro created ' + new Date() + "\n" + 
					'# Run from directory containing \'audio\'' + "\n" + 
					'# ffmpeg -f concat -safe 0 -i voices.txt -c copy voicemix.mp3' + "\n" ;
	paused = false;
	speakers = [];

	for  (let m = 1; m <= max; m++) {

		// find all people that have this in their segments
		inthemix = people.filter(inthemix => inthemix.segments.includes(m));
		
		// special case to get 3 unique tracks for segment 2
		if (m==2) {
		
			// clever code to get 3 random elements 
			// h/t https://stackoverflow.com/a/38571132/2418186
			let track2 = inthemix.sort(() => .5 - Math.random()).slice(0,3);
			
			for  (let j = 0; j < track2.length; j++) {
				// add the track file name, relative
				alltracks.push(new Audio('audio/segment-'+ m + '/' + track2[j].id + '-' + m + '.mp3'));
		
				// append to credits if not already there, add to speakers list too
				if (!credits.includes(track2[j].name) ) credits.push(track2[j].name);
				speakers.push(track2[j].name);
				
				// keep track of ids
				ids.push(track2[j].id);
				
				ffmpegtxt += 'file \'' + 'audio/segment-'+ m + '/' + track2[j].id + '-' + m + ".mp3'\n";
			}
		
		} else {
		
			// grab a person in these results
			randomperson = getrandom(inthemix);
		
			// add the track file name, relative
			alltracks.push(new Audio('audio/segment-'+ m + '/' + randomperson.id + '-' + m + '.mp3'));
		
			// append to credits if not already there, add to speakers list too
			if (!credits.includes( randomperson.name) ) credits.push(randomperson.name);
			speakers.push(randomperson.name);
			
			// keep track of ids
			ids.push(randomperson.id);
			
			ffmpegtxt += 'file \'' + 'audio/segment-'+ m + '/' + randomperson.id + '-' + m + ".mp3'\n";
		}		
	}
	
	// append the credits to the download content
	ffmpegtxt += '# Voice credits: ' + credits.join(", ");
		
	$( "#credits" ).html('<h2>Voice Credits For This Mix</h2><p>' + credits.join(", ") + '</p>');
	$( "#voicelist" ).text(ffmpegtxt);
	$( "#downloadmix").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(ffmpegtxt));
	$( "#speaking" ).html('Mix complete! Click <strong>Play</strong> to listen');
	$( "#voicelist" ).text(ffmpegtxt);
	
	return (alltracks);
}

function setUpReplay(max) {

	$( "#speaking" ).text('Setting up playback...');
	let alltracks = [];
	let credits = [];
	let ffmpegtxt = '# OEG Voices Random Intro created ' + new Date() + "\n" + 
					'# Run from directory containing \'audio\'' + "\n" + 
					'# ffmpeg -f concat -safe 0 -i voices.txt -c copy voicemix.mp3' + "\n" ;
	paused = false;
	speakers = [];
	
	// address indexing
	offset = -1;
	
	for  (let m = 1; m <= max; m++) {
	
		// special case to get 3 unique tracks for segment 2
		if ( m == 2 ) {
		
			// cycle 3 times
			for  (let j = -1; j < 2; j++) {
			
				// sound index 
				repeated = m + j;
				
				// add the track file name, relative
				alltracks.push(new Audio('audio/segment-'+ m + '/' + ids[repeated] + '-' + m + '.mp3'));
		
				// get name
				displayname = getNameFromID(ids[repeated]);
	
				// append to credits if not already there, add to speakers list too
				if (!credits.includes( displayname ) ) credits.push(displayname);
				speakers.push(displayname);
				
				ffmpegtxt += 'file \'' + 'audio/segment-'+ m + '/' + ids[repeated] + '-' + m + ".mp3'\n";
			}
			
			// reset offset
			offset = 1;
		
		} else {
		
			// index for sound
			idx = m+offset;

			// add the track file name, relative
			alltracks.push(new Audio('audio/segment-'+ m + '/' + ids[idx] + '-' + m + '.mp3'));
		
			// get name
			displayname = getNameFromID(ids[idx]);
	
			// append to credits if not already there, add to speakers list too
			if (!credits.includes( displayname ) ) credits.push(displayname);
			speakers.push(displayname);
				
			ffmpegtxt += 'file \'' + 'audio/segment-'+ m + '/' + ids[idx] + '-' + m + ".mp3'\n";
		}
	}
	
	// append the credits to the download content
	ffmpegtxt += '# Voice credits: ' + credits.join(", ");
		
	$( "#credits" ).html('<h2>Voice Credits For This Mix</h2><p>' + credits.join(", ") + '</p>');
	$( "#voicelist" ).text(ffmpegtxt);
	$( "#downloadmix").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(ffmpegtxt));
	$( "#speaking" ).html('Playlist loaded <strong>Play</strong> to listen');

	return (alltracks);

}

function getVoices( playmode='new' ) {

	// pause if playing and we are not at end
	if ( sndx > -1 && sndx < voices.length  && !paused) {
		voices[sndx].pause();
		paused=true;
	}
	
	// reset counter and run a mix
	sndx = -1;
	
	if (playmode == 'new') {
		voices = mixaudio(numsegments);
	} else {
		voices = setUpReplay(numsegments);
	}
	
	// debug
	// console.log('playlist= ' + ids);
	// console.log('replay link: ' + getReplayLink(ids));
	
	
	// change button name and show buttons
	$("#voicenew").html('Make Another');
	$("#voiceplay").show();
	$("#voicepause").show();
	$("#mixlist").show();
	$("#voiceshare").show();
	
}


function playVoices() {
	if (paused) {
		paused = false;

	} else {
	
		sndx++;
		if (sndx == voices.length) {
			$("#speaking").html('Done! Mix another?');
			
			// enable the play button
			$( "#voiceplay" ).prop("disabled", false);
			return;
		}
		voices[sndx].addEventListener('ended', playVoices);
		$("#speaking").html('<i class="bi bi-volume-up-fill"></i> <em>' + speakers[sndx] + '<br />"' + segment_text[sndx] +  '"</em>');
	}
	
	voices[sndx].play();
}

function pauseVoices() {
	voices[sndx].pause();
	paused = true;
	// enable the play button
	$( "#voiceplay" ).prop("disabled", false);

}

// set up the generate button
$(document).ready(function(){	
	getAllNames();

	if (myPlaylist) {
		getVoices('replay');
	}

	
	$( "#voicenew" ).click(function() {
		// Generate and play voices
		getVoices();
		
	});	
	
	$( "#voiceplay" ).click(function() {
		// Generate and play voices
		playVoices();
		// disable button from playing again
		$( "#voiceplay" ).prop("disabled", true);
		
	});	
	
	$( "#voicepause" ).click(function() {
		// Generate and play voices
		pauseVoices();
		
	});	
	
	$( "#voiceshare" ).click(function() {
		// Generate and play voices
			prompt("Copy this link to share this voice mix", getReplayLink(ids));
		
	});	

				
});//ready