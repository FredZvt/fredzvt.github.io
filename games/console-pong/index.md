---
layout: page-with-date
title: "VFS Assignment: Pong Clone"
date: 2014 Dez
---

You can <a href="https://bitbucket.org/fredzvt/consolepong/src" target="_blank">get the code</a> or <a href="https://bitbucket.org/fredzvt/consolepong/downloads/ConsolePong.exe">download a compiled binary</a> on Bitbucket.

<iframe src="http://www.youtube.com/embed/1AkLG4iTx8k?rel=0&amp;showinfo=0" width="740" height="520" frameborder="0"></iframe>

## Some interesting bits about this project:

- The game runs on a windows console, everything is draw using just ASCII and colors.
- There is a second thread responsible to play sounds, otherwise the drawing refresh would be delayed.
- Input gathering is done through interop calls to user32.dll to circunvent the lack of a non-blocking option in the Console API.