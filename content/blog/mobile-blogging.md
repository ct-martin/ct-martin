---
title: "Mobile Blogging"
#date: Fri, 16 Aug 2019 22:13:00 +0000
date: Thu, 24 Oct 2019 23:13:00 +0000
draft: false
tags: ['Web Dev']
---

My boss's boss encouraged me to bring a Bluetooth keyboard on my flights this summer so I could write while in the air.
Suprisingly it's possible to do this on Android using plain Git.

<!--more-->

For this to work there are a couple requirements:

* Content source must be in a git repo
  * If you're using WordPress there is a plugin to sync with a git repo but I haven't tested it so <abbr title="your mileage may vary">YMMV</abbr>
* Something comfortable to type with, such as a (small but ergonomic) bluetooth keyboard
* An Android git client that:
  * Can clone the repo to local storage
  * Allows you to edit files
  * Allows you to commit & push files

## Git

Amazingly, there are not as many git apps that can do that as I thought there might be.
I'm an Android user and I chose to use [MGit](https://play.google.com/store/apps/details?id=com.manichord.mgit&hl=en_US).
There are other options available but few meet the 3 criteria for a git app I listed above and appear to be of decent quality.
There was at least one other quality git app I saw while searching, but it appeared to have some major issues with disconnect between the dev & users.

To get my blog to an accessible location for testing (below) I had to change MGit's base directory in the settings, which also made me re-clone my repo (so change this before you clone your repo to avoid this issue).
I recommend using the Downloads folder for this.

It's worth mentioning that you won't get prompted for HTTPS auth until you try to push on public repos, which confused me at first.
Also, there's a bug in MGit where it'll crash if you have the text editor open and you dis/connect a bluetooth keyboard.

## Testing

As it would turn out, someone made an app to run Linux on Android.
I'm amazingly not suprised about that somehow.
The app is called [Termux](https://termux.com/).

In Termux there are two package managers, `pkg` and `apt`.
As far as I can tell, `pkg` is a wrapper for `apt` with a couple minor changes such as a different help output.

Use `apt install proot` to get [Proot](https://wiki.termux.com/wiki/PRoot), which is a user-space chroot implementation we need so things think they're running on Linux (Android and/or Termux don't comply with the Linux/Unix filesystem standard).
Then use `termux-chroot` to enter into the chroot.
You probably won't notice anything different about running in or out of the chroot for the most part, or at least I haven't.

After that you can use `apt install hugo`, which is also conveniently the "extended" version of Hugo so you get SASS support :) .

Do a `cd storage/downloads/Git/[your repo here]` and a `hugo serve` and you're all set!

Despite running a server, this is airplane-mode compatible since it's all local to the phone.

## Markdown

I did make an effort to try to find a good, free Markdown editor for mobile, however, I didn't find anything that matched my taste.
Either they didn't have support for underscores for italics (which I prefer due to notable platforms that use sincle asierisk for bold), didn't format the Markdown in the same view as typing, or were going to be a notable hassle to move content back and forth from MGit.

I found it easiest to write using MGit's plain-text editor and then edit on my computer after I got back (git branches are good for this).

## Conclusion

Overall I'm fairly happy with the experience.
This is the second blog post I wrote while on a plane and things seem to work overall; committing and pushing worked.
The biggest takeaways for me were that I need a more ergonomic Bluetooth keyboard if I'm going to do more of this and I found it much easier to edit on my computer (including getting links).
That said, I've written the words which is most (if not all) of the work.

Easy go!