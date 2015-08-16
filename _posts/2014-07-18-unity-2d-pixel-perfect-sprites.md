---
layout: post
title: Unity 2D with Pixel Perfect Sprites
---

One of my first problems when trying to create 2D games in Unity was how to setup everything in order to obtain pixel perfect sprites. This happens because even creating a 2D project and using an orthographic camera, Unity is still 3D and Sprites are just textures applied to 3D meshes in order to be rendered.

Without further ado, there are three things we have to setup:

* In the import settings of the sprite that you want to be pixel perfect, set filter mode to point and check the value of pixels to units.
  * By default, pixels to units is set to 100. That's a good value and you shouldn't change unless you have a good reason to.
* Set the camera size to the result of the equation: (deploy height / 2) / pixels to units.
* Set camera projection to orthographic if not already configured this way.