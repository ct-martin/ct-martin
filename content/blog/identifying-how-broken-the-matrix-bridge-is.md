---
title: 'Identifying how broken the Matrix bridge is'
date: Wed, 25 Apr 2018 23:25:27 +0000
draft: false
tags: ['Humanitarian Free &amp; Open Source Software']
---

This post is as a result of multiple failures of the Matrix<->Freenode bridge recently, and what I've learned using Matrix daily for several months.

<!--more-->

The first note on Matrix is that depending on how the server/internet feels, it can take 30 seconds for a message to send, sometimes even longer.
This can make debugging a bit more difficult, but ~30 seconds is a good cut-off if you are waiting for a message to send.

The first part of identifying how broken the bridge is is to look at if messages are coming though. If neither side is getting the other's messages, then the bridge is potentially down.
Matrix often reports this sort of outage on their [Twitter](https://twitter.com/matrixdotorg) & [Mastodon](https://mastodon.matrix.org/@matrix), but don't rely on that alone.

When debugging it's helpful to have another connection to the other side, such as using Freenode's web chat.
In #rit-foss we also have a bot that will respond if you send the message "test".

The bridge isn't as simple as a boolean up/down though.
You might discover that messages are going one-way.
I've seen it go one-way in both directions before.
 
And it can get even weirder.
If you're really familiar with IRC you probably know how there are multiple servers and what a netsplit is.
Well, it would appear that the bridge can sometimes fail to recognize certain servers.
I've seen cases in which I can only see a couple people talking, and also where I can see everyone except a couple people.

The most frustrating part of this is that since Matrix controls the infrastructure, you can't a lot about this.
Thankfully, the server and bridge are both open source, so you could run your own infrastructure, but that doesn't solve the larger issue and also begs the question of whether you want to have to maintain it.

Ultimately this article fails fixing the issue, but hopefully helps is figuring out where and how bad the issue is when it does occur

---

_Updates:_  
_2019-07-29: Content reflow_