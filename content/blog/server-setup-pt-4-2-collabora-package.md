---
title: 'Server Setup pt. 4-2 - Running Collabora Office as a package (also a "Late Night Rant")'
date: Sat, 27 Jan 2018 02:37:26 +0000
draft: false
tags: ['Humanitarian Free & Open Source Software', 'Late Night Rants', 'Servers']
---

In addition to being a guide on running Collabora Office/Online as a package instead of a Docker image, this is the first blog version of my late night rants in the #rit-foss Freenode channel.

<!--more-->

For those of us in the self-hosting world (which heavily relies on Free and Open Source Software because being a home user generally implies a limited budget), Collabora Office is a bit of dream.
It's a piece of software that allows you to have a web-based office suite.
It [integrates very nicely with Nextcloud](https://nextcloud.com/collaboraonline/) and on the backend is powered by LibreOffice.
Collabora Online Development Edition (CODE) is the free version of the enterprise Collabora Office.

I'm using it on Ubuntu 16.04 LTS with Nextcloud & Let's Encrypt.
Unfortunately, their primary instructions to deploy are using Docker, and I wanted to deploy it using a package.
[According to the CODE webpage](https://www.collaboraoffice.com/code/), this is completely possible.
However, if you install and run CODE (and set up the Apache proxy) you'll notice an interesting phenomenon - it doesn't work out of the box.

Googling issues didn't help me much, the log text that others were posting just wasn't popping up for me despite having similar(-ish) errors.
And since it's not documented as well, use `sudo systemctl status loolwsd` to logs (if it's still not enough info, I learned later on that running the command given in `/lib/systemd/system/loolwsd.service` manually gives more to work with).
If you're a careful observer, you may be wondering "what the heck does "loolwsd" have to do with CODE?"
Well, that's another fun thing.
"lool" stands for LibreOffice Online, the underlying codebase that CODE is based on.

If you go to the [page on the LibreOffice wiki](https://wiki.documentfoundation.org/Development/LibreOffice_Online), you'll notice something fun, no docs at all.
Upon looking at it again, there's a hint to this on the CODE page, but the link is dead so it doesn't help much.
I finally had to resort to looking through the [Docker image for CODE](https://github.com/CollaboraOnline/Docker-CODE).
At [the end of the start script](https://github.com/CollaboraOnline/Docker-CODE/blob/master/scripts/start-libreoffice.sh#L23-L32), there are a few lines of note.
This gives us a couple useful pieces of information:

1.  The directory for the configs is `/etc/loolwsd`
2.  You need to add the domain `<host>` entry that CODE will be accessed from in order for it to work in `<storage> -> <wopi>`

Ok, so that's nice, understandable, and easy, right?
Nope.
It still doesn't work.
This is were debugging gets really fun when you're not getting real logs.
The first issue was the certificate.
I have certbot running and manually symlinked the certs it output for the Apache `VirtualHost`.
In debugging, I found several necessary steps:

1.  CODE doesn't support symlinking for certs.
I ended up having to turn off the Apache<->CODE SSL completely, which is fine for me since it's running on the same machine but generally isn't the best idea.
This can be done with `<ssl> -> <enable>` in `/etc/loolwsd/loolwsd.xml`.
You also will need to turn on `<ssl> -> <termination>`
2.  Ignore all the CODE SSL stuff for the Apache config and use Let'sEncrypt's instead since that's what's providing the certificate that the user will interact with (if you ran certbot before doing this, make sure to leave `SSLEngine on`)
3.  If the symlinks is an issue for you, Apache also needs to be told to communicate with CODE without using SSL.
This is slightly more complex.
All of this is happening in the `ProxyPass` and `ProxyPassReverse` lines.
Both of these statements have two parameters.
The first one is the User<->Apache side, the second is the Apache<->CODE side.
Since we are only changing the Apache<->CODE communication, we only want to change the second parameters.
In all of the protocols you want to drop the ending "s" to drop SSL.
So `https://` becomes `http://` and `wss://` becomes `ws://`

Ok, so now that that's been done, this should work, right?
Nope, it's still not working.
This time I'm getting a error on the Content Security Policy.
This is a header whose purpose is to prevent Cross-Server-Script attacks (when a malicious script is injected from another website).
Since I had no idea what I was doing even after reading [the website for it](https://content-security-policy.com/) (and was still having issues), I spammed added `Header set Content-Security-Policy "frame-src 'self' collabora.i.ctmartin.me cloud.i.ctmartin.me;"` to all of my CODE and Nextcloud `VirtualHosts`.

Finally, when a major version updates you'll need to run `systemctl daemon-reload` to reload the service so the folder it calls gets updated.
For example, CODE updated from 5.1 to 5.3 right before I started writing this post, and when it did my `systemd` still had the template folder cached as `/opt/collaboraoffice5.1`, but the update changed it to `/opt/collaboraoffice5.3`.
This broke a bunch and caused me a lot of headaches.

And just to wrap things on a bright note, CODE isn't perfect.
You can't copy-paste formatted text (although unformatted text works fine), and as I mentioned earlier, I have not found symlinking to work (or maybe you can't can't access files that are owned by root, even if they have the perms 777... either way, it's a problem).
CODE is not quite compatible with a couple Nextcloud features, namely Encryption (as in the app), and External Storage (with SMB, Google Drive works fine, the others are untested).
The former has been confirmed by both Nextcloud and Collabora, but the latter is something I've found just in my personal use.
Also, I haven't been able to get some non-native fonts to work, but I need to test that a little bit more.

Personally, I think they could do with a bit of work on their documentation (mainly for installation) as a huge start.
I know they have decided to focus on developing as they go and intentionally not even laid out a roadmap, but this entire process was extremely painful, and I don't recommend it.
Since they do promote the Docker image as the recommended way to use CODE, it might work better, but that's not really the point of this article, and if you followed my troubleshooting this far, you hopefully would have a working version yourself.

---

_Updates:_  
_2019/07/28: Content reflow_