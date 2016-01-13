---
layout: page-with-date
title: "VFS Assignment: Battleships Web"
date: 2014 Dez
---

A simple one or two players (<a href="https://en.wikipedia.org/wiki/Hotseat_(multiplayer_mode)" target="_blank">hot seat</a>) battleships game using using HTML, CSS and Javascript.

You can <a href="https://bitbucket.org/fredzvt/battleshipsgame" target="_blank">get the code</a> on Bitbucket.

Click <a href="game/index.html" id="game_init">here</a> to play the game in a new window.

<iframe src="http://www.youtube.com/embed/dcniNMtewHw?rel=0&amp;showinfo=0" width="1024" height="768" frameborder="0"></iframe>

<script>
$(function() {
	$('#game_init').click(function(){
	  window.open('game/index.html', 'Battleships');
	  return false;
	});
})
</script>