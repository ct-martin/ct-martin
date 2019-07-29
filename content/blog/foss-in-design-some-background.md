---
title: 'FOSS in Design: Some background'
date: Tue, 27 Mar 2018 00:24:38 +0000
draft: false
tags: ['FOSS', 'FOSS in Design']
---

This project started from hearing a rumor (via a professor) in RIT's College of Imaging Arts & Sciences that free (both as in cost & as in freedom) software was not allowed to be installed on the lab machines for use (with an asterisk for where it's too popular to not install).

<!--more-->

While this has not been confirmed directly by their IT department, that became irrelevant quickly.
Upon hearing this rumor, I posted it in our FOSS channel on IRC to see what others thought of it.
This resulted in an important conclusion: disregarding whether the rumor was true when we went and dug up the list of lab software, there was a little FOSS, but ultimately there was a distinct lack of it.

This semester there are more detailed lists of lab software, and it's a bit better, but there is still a general trend that FOSS isn't particularly accepted, and for many pieces of FOSS software it might only be available in a specific lab.
Where the main point of this project comes from has also been developed from a number of conversations with professors, both in CIAS and on the FOSS side.

Here are the ones that have significantly influenced the direction of this project:

> Me: "...with the state of how GIMP is right now, and how quickly development is happening, it'll be at least a year before I'll even be able to look at GIMP again as a potentially viable alternative to Photoshop."
>
> FOSS Prof A: (not seeming to see a point being made) "So?"
>
> Me: "...since I'm here for only four years, one year makes a world of difference in whether I can use it or not."
>
> FOSS Prof A: "Ah, I see. To me, one year isn't that long"

This exchange is one of the primary reasons why this project is aimed at students and specifically aimed at _what is available **now**_.
It also highlighted the fact that software development happens at a different pace than usage, so a significant part of this project is finding what tools can accomplish this functionality in a reasonably cohesive manner.

> Me: (listing off a number of features that GIMP lacks that are used heavily in my classes, non-destructive editing being a focus)
>
> FOSS Prof A: "But do you _really_ need those features? Can't you just save a bunch of versions?"
> Me: (explaining how non-destructive editing is non-linear and that's way too much work)
> FOSS Prof B: "Heh. Back in my day, we didn't have the undo button. You kids these days have it so easy."

(Yes, I actually got a "back in my day" and a "kids these days")
The influence this conversation gave to the project was that modern workflows have changed a lot since many of these pieces of software were written, and the use cases have also developed.
There are a lot of old tutorials around for some of the older use cases, but some of the newer use cases aren't well-documented.
At the very least, there's a lot of cleaning that could be done in some cases.

> CIAS Prof A: "It's the industry standard" / "In the industry, they will expect to be given \[file format\]."

This has become one of the cornerstones of this project: how to maintain integration with existing environments (bridging, not converting).
This is easier to do with some software and file formats than others, but this project includes how to build interoperability yourself, not how to make others change how they operate.

## What's happened since?

A lot actually.
I was approached by one of FOSS Professors about doing an independent study (not one of the two quoted above by the way) and ended up in this Project in FOSS Development class.
I was originally doing some work for another project, and since had been starting to look like it wouldn't get touched on again I was going to write a couple blog posts and then be done with it.

However, I ended up on this project again and it's giving me the opportunity to elaborate on this as well as try to build a resource for others.
There has also been talk of continuing this in an independent study next semester since there's more work here than can be done in one semester.
I've also near-completed my personal FOSS suite for my own work.

## So what's next?

I've gotten down (on paper) all the things that were touched upon previously in conversations and am now in the process of turning that into something readable (you can read the introduction [here](https://blog.ctmartin.me/2018/03/foss-in-design-an-introduction/)).
Additionally, I've started to do an in-depth look at how to best accomplish the goals of this project.
As was determined in my last meeting about this, "just start writing \[blog posts\]."

---

_Updates:_

_2019/07/28: Content reflow_