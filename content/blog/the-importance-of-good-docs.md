---
title: 'The importance of good docs'
date: Fri, 20 Apr 2018 03:34:44 +0000
draft: false
tags: ['FOSS', 'Humanitarian Free &amp; Open Source Software']
---

This post has come about from a couple really bad experiences with documentation this week, and what I found frustrating in those experiences.

<!--more-->

While providing complete information in docs, it should be done in a simple enough way that the user has basic building blocks.
Additionally, the (entire!) docs should be reproducable. Here are the failures I've delt with this week.

First, [Material Design Lite](https://getmdl.io/).
MDL is a nice, simple framework for Material-themed sites, but it lacks documentation for basic building blocks.
It turns out that in MDL the grid system is key to a lot of styling.
For example, the Cards component requires either the grid or custom CSS to be any usable.

However, the docs seem to give the impression that the CSS you see for the demo content is for demonstration purposes, not that the cards don't really function without it.
The Grid component section of the docs also fails to impress this upon you.
For contrast, the [Bootstrap](https://getbootstrap.com/) docs have the first post-install section dedicated to the [Layout](https://getbootstrap.com/docs/4.0/layout/overview/), without having the navbar and footer stuff taking up most of the page.

Additionally, there is nothing similar to Bootstrap's `.container` building block which allows for extremely simple.
I had to go digging through the source code of the MDL sample templates just to find out how to do very basic positioning of content, which is very sad.

This also led me to a second discovery - MDL has a lot of styling classes that are undocumented. Things like `mdl-color--(color)` for background, `mdl-shadow--Ndp`, and `mdl-color-text--(color)-(size)` are completely undocumented.
I feel like I ran across them in a footnote in the docs at one point, but I was unable to find it again.
This is also a huge issue for usability since the [Material Design's spec](https://material.io/guidelines/) has very specific color palettes and shadows, complete with custom scales.
As mentioned, these features exist, but you can't find anything reasonable about them, which severely limits the ability to make a website intuitively.

The second project to fail me was [Grimoire](https://grimoirelab.github.io/).
The issue with the Grimoire docs is that they are not clear.
There are two different installation processes, and only the less intuitive (but more practical for massive infrastructure) one is documented.
In addition to being sprawled all over (for example, the Supporting Systems page has a good chunk of the installation guide in it), it's very hard to follow.
You often get left with a wall of commands or just a preformatted config file (or a link to one in the middle of a paragraph) and get told "here's a sample" with no breakdown of what's going on, and what you need for a base install.

It's certainly thorough, but it's not usable.
In attempting to get a base install, I had to just keep throwing in commands and assuming they worked.
I then was left with programs telling me they needed configuration since I apparently didn't throw every single config that was linked or a giant wall of text in the docs into a proper file (which were all over the docs).

In short, it didn't work out of the box, and I was unable to do so in a reasonable manner.
This is also perpetuated by a complete lack of a visual interface for configuring the half a dozen or so pieces of software that Grimoire is building on, not that that should be a requirement of everything.

Finally, there was also a section that had all the headings/links in the docs, but just didn't exist and broke the JavaScript attempting to speed up page loads.
Not user-friendly.

In summary, documentation is important, and usability is as important as completeness. It doesn't matter if your project has documentation when I am unable to get a working base installation and/or are missing a sizeable chunk of the basic functionality needed to use a project.

---

_Updates:_

_2019-07-29: Content reflow_