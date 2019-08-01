---
title: 'Experience Concept'
date: Tue, 18 Dec 2018 17:00:50 +0000
draft: false
tags: ['599 - Dual-touch Design']
---

As previously discussed, I’m building an experience surrounding the [dual-touchscreen laptops](https://blog.ctmartin.me/2018/11/what-is-that-followed-by-why-would-you/) I have. The chosen experience is Battleship, due to the pre-existing similarities in the non-digital game

<!--more-->

The tech for this is somewhat straightforward. [p5.js](https://p5js.org/) is used to draw the canvas, [socket.io](https://socket.io/) is used to communicate between the client & server, [Node](https://nodejs.org/en/) is used for the server, [Express](https://expressjs.com/) serves the client-side code, and [Redis](https://redis.io/) is used to store the states. Redis is sufficient for data storage since a game of Battleship is not expected to go on for a very long time like Risk or Dungeons & Dragons does.  

The challenge of this experience is making the parts communicate properly. This has a few sub-parts:

1.  Have the data sent update the respective side
2.  Synchronize the multiple clients of the same user
3.  Synchronize the two players

Making this happen is surprisingly annoying, but that’ll be another blog post.  

This experience is somewhat of a proof of concept and isn’t fully polished nor coded in the best possible way, however, obviously a better experience is better.

_Note: post didn't publish correctly, backdated to the date it was supposed to be published._