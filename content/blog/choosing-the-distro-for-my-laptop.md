---
title: 'Choosing the distro for my laptop & workstation VM'
date: Wed, 14 Feb 2018 05:59:13 +0000
draft: false
tags: ['*nix', 'Humanitarian Free &amp; Open Source Software', 'Tech']
---

Currently, I'm running Windows on my laptop, and it's well overdue that I switch to Linux (for a variety of reasons even beyond FOSS... security & resource usage for example...). Additionally, I need a workstation VM for heavier lifting that I can remotely access to do stuff. Here's the thought process that went into choosing the distro & desktop environment combos that I'm going to be switching to:

<!--more-->

First, I had a few basic requirements I needed:

1.  It had to be stable.
This is going to be my daily driver; I don't want to run an update and suddenly be out of business.
2.  It had to be current.
My school & personal work involves things on the cutting edge; I want to be on the latest (stable, non-ESR/TLS/etc.) releases.
3.  It had to be easy to maintain.
I don't want to have to be compiling my software from source, I want to be able to install a package and be done.

This automatically rules out a lot of distros.
The first unfortunately rules out Fedora and Arch.
Arch is sort of known for being cutting edge to a fault sometimes, and while Fedora is doing a lot of really great things, I've seen people have issues related to Fedora (itself) recently (which also had a history of being highly unstable for a while), and I just don't want to run that risk even if I _shouldn't_ encounter anything.

The second rules out all RHEL-based distros.
While extended/long-term support releases are great for businesses, with what I'm doing those versions can be outdated or stale, particularly for multimedia programs.

The third eliminates Gentoo. Additionally, I'm not considering BSD operating systems.

At this point, I'm more or less left with Debian and its derivatives.
More specifically, there are 4 distributions left that are of interest to me: Debian, Ubuntu, Mint, and Ubuntu Studio.
I'm going to rule Mint out. It doesn't support RIT's PEAP Wi-Fi (which is a major breaker for me), and when I look at the community I'm not happy with what I see.
I like their idea of bringing Linux to the masses, but...

1.  I don't like their approach to security updates (they block some security updates for stability... I consider a vulnerability as a risk, inc. to stability)
2.  As previously mentioned, compatibility is an issue, but if you look at their bug tracker you can see (for example) that the Cinnamon desktop has almost 1000 issues filed against it.
They recently closed a bunch, so it's closer to 500 now, but it's still pretty bad.
That's (in my opinion) an ultimatum for the project given its size, particularly compared to upstream GNOME, which has <60 issues as well as far more resources to fix any.

For my VM I'm going to use Ubuntu Studio.
Due to its multimedia orientation, it's designed for my exact use case and has a lot of what I need already out of the box.
However, it doesn't suit my laptop, leaving Debian and Ubuntu as the options.
This is a really hard debate.
As Ubuntu is a derivative of Debian, there is a lot in common.
Ubuntu tends to be more up to date, but also can break more often.
I'd rather use Debian due to its stability (and that I'm not a fan of Canonical's modifications to GNOME), however, since I'm going to be doing a little bit of (light) gaming on it, the non-free drivers (assuming they (or the free ones) work since I have an NVIDIA graphics card...) are beneficial to me.
Steam recommends Ubuntu for gaming, however, SteamOS is based on Debian, so clearly that works too.

Given my limited laptop resources and that Ubuntu Studio is happy with Xfce, I'm going to try running Debian with Xfce.
Of course, more VM testing is needed before this gets finalized, and I also need a little more time to shift a few more things off of my laptop before I attempt this.

---

_Updates:_  
_2019/07/28: Content reflow_