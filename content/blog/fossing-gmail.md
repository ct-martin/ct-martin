---
title: 'FOSSing Gmail'
date: Tue, 13 Feb 2018 22:45:15 +0000
draft: false
tags: ['FOSS', 'FOSS Project', 'Software', 'Tech']
---

Gmail has become a go-to place for email, and with good reason.
It's free (as in cost, not freedom) and due to Google's backing, it's stable & comparatively safe.
Additionally, you get the power of Google's AI to make your email life easier.
However, from a FOSS-friendly point of view, these features aren't particularly accessible... but with common standards (such as IMAP) and a little effort, we can take full advantage of Gmail's abilities while allowing ourselves a FOSS client.

<!--more-->

The AI and other technology behind Gmail and other Google products are kept heavily behind lock and key.
Google wants everyone to become locked into their proprietary ecosystem, and they don't have much reason to change that.
While Google does open source some a good amount of their work, such as Material Design (which encourages making everything look like Google's), they definitely keep their AI "secret sauce" under control (referring to the actual algorithms as opposed to the TensorFlow platform).

However, you can take advantage of these features in a FOSS-friendly manner! Google [no longer scans your emails to personalize ads](https://www.wired.co.uk/article/google-reading-personal-emails-privacy) (although they still do it for other reasons, including spam).
Thus, while not completely FOSS compliant, you can use it without losing out on major features of Gmail.
The first step of this is to acknowledge that the UI/UX of the Gmail app & web interface will not be _quite_ as nice when this is done.
Instead of tabs nicely integrated with your inbox, you will instead have "labels"/folders that will appear on the sidebar instead, and on the mobile app, this integrates even poorer.

However, when you're using Thunderbird the desktop/laptop UI issues disappear, and on mobile, while K-9 doesn't have a great UI nor UX, it is FOSS (which is the entire point of this), and it does work.
This is not to say that you can't log into it from a computer and use it, but rather that the "new normal" workflow won't be quite as streamlined.
As background, Google now has done away with the traditional email folders and in its place created three organization types: important/priority, categories, and labels.
As far as IMAP is concerned, labels = folders, so there really isn't a loss there.
Important/priority and categories are both AI-powered features of Gmail, and they're both easy to hook into, in fact "Important" already is hooked into IMAP.

The basis of this is that labels=folders, and Gmail lets you create filters with the entire power of the Gmail AI.
Under _Settings->Labels_ you can find the entire list of categories that Gmail supports.
You'll also notice that there are more than the normal Social, Promotions, Updates, & Forums that you usually see.
Namely, Purchases, Travel, and Finance are also included.
If you expand the sidebar on the web UI using "More" (sorry to app users, you can't get to it), then expand the Categories section, and finally click on one of these invisible categories, you'll notice that it actually works and has stuff in them.

The more you know about what Google's doing with your data behind your back... -\_-

To actually put these categories to use, create a new filter, ignore the normal fields (From, To, etc.) and instead put "category:(name)" in the search bar (no quotes, replace (name) with the category you want).
Next, click Continue.
For the actions, check "Skip the Inbox (Archive it)" (this prevents overloading your inbox) and also create a new label for that category (you can do this from the "Apply the label:" dropdown).
Finally, check the box that says "Also apply filter to \_ matching conversations" (again, inbox overload prevention; think of it like an import to the new format) and then hit the button create the filter.
Create these filters for as many or few of these categories as you wish.

I haven't played with the hidden categories yet, so I'm not sure how well/poorly they overlap with the visible ones so your mileage may vary.
It's important to note that these filters must be at the bottom of the filters list.
You can't reorder them from the web UI, but some searching revealed that you can export all the filters, reorder them in the XML file, and then reimport them.

Finally, lets' make life slightly more bearable with a couple UI tweaks.
If you go to your inbox now, you'll notice that the categories are redundantly marked on all the emails.
First, turn off the tabs in the inbox.
Since the feature is server-side, the filter is still being done, and since we're moving things to labels this won't work anymore.
In _Settings->Labels_ set all the labels you just created to "hide" in "Show in message list."
This turns off those annoying, redundant labels.
Finally, if you don't use the important/priority feature, you can uncheck the "Show in IMAP" box for it near the top.
You may also opt to turn off the "All Mail" IMAP if you so choose.

At this point, you can turn on IMAP and log in as normal (or use app passwords if you use 2FA) to your email client of choice.
You'll notice that the folders appear, and in Thunderbird this works really well.
If you have a mobile email client then you'll want to turn at least turn off notifications in the normal Gmail app, unless you want two notifications for every email you get ;)

---

_Updates:_  
_2019/07/28: Content reflow_  
_2017/02/15:_ After spending a few days using K-9 Mail, I've mostly managed to get the folders to work like Gmail did for the inbox categories on the Gmail mobile app.
K-9's own docs on this start with "Perhaps most confusing aspect of K-9..." so yeah...
Anyway, for folder permissions, my inbox is set to "1st Class" for all (display, poll, push, notification).
My category folders are set to 1st Class for display, poll, and push, and 2nd Class for notification.
For account permissions, under Fetching poll and push are "All except 2nd Class folders" and under Notifications I have "Notification folders" set to "Only 1st Class folders."
Also, you can un/check the box for "Show in top group" in the folder settings to reorganize and make life easier.
"All except 2nd Class folders" for "Folders to display" under the account settings has also been useful to me, and then setting the "all mail" folder as 2nd Class.
While you still don't get bars at the top of your inbox to easily show if there are any unread, this maintains the functionality from Gmail of keeping the folders synced without spamming you with notifications.
You can easily see the unread counts by switching to the folder view; I have not had concerns about this since getting those settings working.
Also, little tidbit, there are a couple PRs in the K-9 repo for a new UI (based on Material), so if you are with me in not liking that about the current app, there's hope :)