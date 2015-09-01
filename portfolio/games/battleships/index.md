---
layout: page-with-date
title: "VFS Assignment: Battleships Web"
date: 2014 Dez
---

I made this web game using HTML, CSS, JQuery and Buzz.js for the final assignment of the Web Apps 1 class on the end of the first term.

You can <a href="https://bitbucket.org/fredzvt/battleshipsgame" target="_blank">get the code</a> on Bitbucket.

Click <a href="game/index.html" id="game_init">here</a> to play the game in a new window.

Below you can see a video of the game:

<iframe src="http://www.youtube.com/embed/dcniNMtewHw?rel=0&amp;showinfo=0" width="1024" height="768" frameborder="0"></iframe>

<script>
$(function() {
	$('#game_init').click(function(){
	  window.open('game/index.html', 'Battleships');
	  return false;
	});
})
</script>