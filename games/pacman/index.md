---
layout: page-with-date
title: "VFS Assignment: Pac-Man Clone"
date: 2014 Dez
---

A simple Pac-Man clone made with Unity and C#.

You can <a href="https://bitbucket.org/fredzvt/pacman/src" target="_blank">get the code</a> on Bitbucket.

<iframe width="420" height="315" src="https://www.youtube.com/embed/Y1sQrNFVQRo" frameborder="0" allowfullscreen></iframe>

## Interesting bits about this project:

The level is defined by an matrix where each position represents a position in the board.

{% highlight CSharp %}
using System;
using UnityEngine;

public enum LevelTileType
{
    EmptySpace = 0,
    Wall = 1,
    PlayerSpawn = 2,
    Pill = 3,
    InvisibleWall = 4,
    GhostSpawn = 5,
}

public static class GameSettings
{
	...
    public static int[,] level = 
        new int[,] {
            {0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0},
            {0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0},
            {0, 1, 3, 1, 1, 3, 1, 1, 1, 3, 1, 3, 1, 1, 1, 3, 1, 1, 3, 1, 0},
            {0, 1, 3, 3, 3, 3, 1, 0, 1, 3, 1, 3, 1, 0, 1, 3, 3, 3, 3, 1, 0},
            {0, 1, 3, 1, 1, 3, 1, 1, 1, 3, 1, 3, 1, 1, 1, 3, 1, 1, 3, 1, 0},
            {0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0},
            {0, 1, 3, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 3, 1, 0},
            {0, 1, 3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 3, 1, 0},
            {0, 1, 1, 1, 1, 3, 1, 1, 1, 0, 1, 0, 1, 1, 1, 3, 1, 1, 1, 1, 0},
            {0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 5, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0},
            {1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 4, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1},
            {0, 0, 0, 0, 0, 3, 0, 0, 1, 5, 5, 5, 1, 0, 0, 3, 0, 0, 0, 0, 0},
            {1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1},
            {0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0},
            {0, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 0},
            {0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0},
            {0, 1, 3, 1, 1, 3, 1, 1, 1, 3, 1, 3, 1, 1, 1, 3, 1, 1, 3, 1, 0},
            {0, 1, 3, 3, 1, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 3, 3, 1, 0},
            {0, 1, 1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 1, 0},
            {0, 1, 3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 3, 1, 0},
            {0, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 0},
            {0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0},
            {0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0},
        };
    ...
}
{% endhighlight %}

Walls are then created by analising the matrix and selecting which wall piece to instantiate acording to its neighbors from a collection of six pieces:

<img src="{{ site.baseurl }}public/images/games/pacman/wall-tiles.gif">

That way I could very easily create new levels or implement a procedural level generator. Here is a different level to illustrate the possibility:

<img src="{{ site.baseurl }}public/images/games/pacman/random-level.png">