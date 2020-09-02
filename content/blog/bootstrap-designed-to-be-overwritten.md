---
title: 'Bootstrap: Designed to be overwritten'
date: Wed, 13 Feb 2019 00:29:30 +0000
draft: false
tags: ['Design', 'Web Dev']
---

Bootstrap is a wonderful framework to use, however, it comes with some challenges balancing being cookie-cutter and bloat.

[Bootstrap](https://getbootstrap.com/) is a great framework that makes it easy to build websites. Some aspects are fairly simple, such as the grid system, but the further you get in the more complex its components can get.

A typical challenge in building a site with Bootstrap is that your site might end up looking, very obviously, that it was built with Bootstrap. The sizes of components and the default color palette are the same for all sites not overwriting them and this shows when you don't overwrite them. Users might only notice that your site looks like similar to others, but web developers will quickly figure out that you're using Bootstrap. This makes it hard to differentiate your site from other Bootstrap sites, unless you override all the styles.

Overriding brings about the opposite problem - you get the cross-browser compatibility, but you end up having to re-style every aspect of Bootstrap. This is normal for a business branding, but inconvenient otherwise. Overwriting styles constantly can create stylesheets that are much larger than intended, and sometimes it becomes worth it to avoid using Bootstrap if you only need a small part of it.

Bootstrap also has an odd balance between having too many dependencies and too few features. It objectively has one of the worst carousels that I've seen - the icons are a flat white so it doesn't work visually on white or light colors. Additionally, the carousel icons are hard-coded so you can't change the colors without at least compiling SASS. Bootstrap still has a dependency on jQuery (although that's [slated for removal](https://github.com/twbs/bootstrap/pull/23586)) and doesn't implement features commonly in other frameworks that use JS, such as styles date/time-pickers.

Bootstrap is in an odd place in balancing backwards compatibility with modern web design. Due to its popularity its basic look has become undesirable to showcase web design abilities. However, it also has dependency bloat and lacks features that competitors have. While Bootstrap is still a great choice if you are going to override styles anyway and need stability across many years of browsers, I've started looking at other options, including using [Semantic UI](https://semantic-ui.com/) in a recent project. I've also started looking at [Vuetify](https://vuetifyjs.com/en/) (based on [Material](https://material.io/)) and [Buefy](https://buefy.github.io/) (based on [Bulma](https://bulma.io/)) recently.