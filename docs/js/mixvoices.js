// backstrech the background image -->
 $.backstretch("background.jpg");
 
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

// lame I know, global variables. Sue me


var voices = []; // holds voices in this mix
var speakers = []; // lists speaker names used
var sndx = -1; // current item to play in voices[]
var paused = false; // pause state
var numsegments = 14; // number of segments in this mix

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

function mixaudio(max) {
	$( "#speaking" ).text('Mixing...');
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
			
			ffmpegtxt += 'file \'' + 'audio/segment-'+ m + '/' + randomperson.id + '-' + m + ".mp3'\n";
		}		
	}
	
	// append the credits to the download content
	ffmpegtxt += '# Voice credits: ' + credits.join(", ");
		
	$( "#credits" ).html('<h2>Voice Credits For This Mix</h2><p>' + credits.join(", ") + '</p>');
	$( "#voicelist" ).text(ffmpegtxt);
	$( "#downloadmix").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(ffmpegtxt));
	$( "#speaking" ).html('Mix complete! Click <strong>Play</strong> to listen');
	
	return (alltracks);
}

function getVoices() {

	// pause if playing and we are not at end
	if ( sndx > -1 && sndx < voices.length  && !paused) {
		voices[sndx].pause();
		paused=true;
	}
	
	// reset counter and run a mix
	sndx = -1;
	voices = mixaudio(numsegments);

	// change button name and show buttons
	$("#voicenew").html('Make Another');
	$("#voiceplay").show();
	$("#voicepause").show();
	$("#mixlist").show();

}

function playVoices() {
	if (paused) {
		paused = false;
	} else {
		
		sndx++;
		if (sndx == voices.length) {
			$("#speaking").html('Done! Mix another?');
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

}

// set up the generate button
$(document).ready(function(){	
	getAllNames();
	
	$( "#voicenew" ).click(function() {
		// Generate and play voices
		getVoices();
		
	});	
	
	$( "#voiceplay" ).click(function() {
		// Generate and play voices
		playVoices();
		
	});	
	
	$( "#voicepause" ).click(function() {
		// Generate and play voices
		pauseVoices();
		
	});	
				
});//ready