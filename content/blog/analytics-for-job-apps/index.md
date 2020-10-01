---
title: Site Analytics for Job Applications
date: 2020-09-30
---

As a recent grad trying to find a job, any information I can get to help my job search is valuable.
By tracking site traffic, I can try to measure whether recruiters are getting past my resume.

<!--more-->

## Why?

Unfortunately, there are a lot of other people trying to get jobs right now and LinkedIn's job insights tells me that I'm fighting for entry-level jobs asking 0-1 years of experience with people who have Master's Degrees and senior-level titles.
While LinkedIn will tell me who is visiting my profile, or at least how many people, I know that who visits my website is important as well.
Also, knowing what pages are being visited is helpful information because it can tell me what people find useful and feed back into prioritizing the content I want to make.

## Approach

The approach I took on this was fairly simple - I didn't want to use any JavaScript.
Being a user of tracker-blocking features/extensions in my browser, I know I don't want unneccesary scripts being loaded into pages and others don't either.
If I wanted accurate page and visitor counts, I need to use server logs.

## Considerations

Before I get into how I set this up, let's talk privacy for a moment.
While neither the California Consumer Privacy Act (CCPA) nor the General Data Protection Regulation (GDPR) apply to me as a non-commercial entity, it's still best practice to respect the privacy of people visiting the site.
By using server logs instead of browser cookies or JavaScript, most of the issues are immediately eliminated.
I can't see what's happening on a user's page once they load it, and for what I care that's perfectly ok.
Additionally, I have IP Anonymization turned on.

However, there is a caveat to this.
I do have geolocation on, and sessions can still be tracked via the combination of anonymous IP & user agent.
Regardless, geolocation isn't particularly accurate and it would be impossible for me to determine who a user is unless they gave me a record of where they were from _and_ everything they did.
For example, "a Chrome user from the New York City read a blog post" is still very unspecific.
Even if I have a specific town, IPs are allocated in blocks and ISPs use them as a general pool within a region.
In the analytics, I appear on the opposite side of the SF Bay from where I actually am.

What this can let me do though, is track traffic by metro area.
For example, if I apply to a bunch of jobs in Austin, Texas and I don't see any new traffic, it means that companies aren't making it past my resume.
But if I apply to a dozen jobs and get even a little traffic from an area, it tells me that someone was interested and was willing to keep reading.

## Using the Data

Analytics data can tell me about issues on the site.

For better or worse, bots are really dumb but also check for pages they remember.
Thus, when they attempt to index pages, they visit any known links and that can be used to validate whether the links are working.

One of the other changes I made recently was merging three of my personal sites together.
While I set up redirection, some parts didn't merge cleanly.
For example, I no longer serve AMP content, and I didn't account for tags.
Having bots visit URLs and getting error codes in logs let me identify these redirects as needing a fix.

Another example of using this data is to see what pages are of value to actual users (measuring by views).
While Matomo does a nice job of separating bots and non-bots, it's not perfect and I have some cross-domain traffic from real users.
However, a simple check is to see whether a visitor requested a static asset (such as CSS or JS).
This overcompensates because Cloudflare caches CSS & JS files, but it's an easy way to get a good signal-noise ratio when analyzing data (in part because of low traffic and cache misses as a result).

Another future way I plan to use data is to see how many people view my resume on my portfolio site.
This is another easy way to track job-related traffic on my site.
Since a recruiter likely has my resume already, they shouldn't be viewing the page, but it's worth seeing what happens.

## How

Since I'm a recent grad without a job and I have two domains, so I don't want to pay for analytics.
Cloudflare's free plan didn't give me the level of detail I wanted, and Cloudflare Pro would cost me $20/mon so I was going to need to set something up.

I first moved my personal websites from GitLab Pages to being served by Nginx on my VPS.
This let me get access logs while also giving me a bit more control over how my site was served.

I then set up an instance of [Matomo](https://matomo.org/), a Google Analytics alternative, using a different port so that scripts could access it independent of other traffic.
For extra security, the Matomo instance requires auth at the Nginx-level in addition to the instance itself.

To read the logs, I set up the [Log Analytics script](https://github.com/matomo-org/matomo-log-analytics).
Since I wanted data to be logged real-time instead of sitting around, I used the `rsyslog` method of having Nginx log to a socket (`rsyslog` was used instead of `syslog-ng` because Dokku, which I also use, already has it as a dependency).
A couple tweaks I made were a [fix for an API bug](https://github.com/matomo-org/matomo-log-analytics/issues/270) and using the Cloudflare header for getting the IP (`$http_cf_connecting_ip`  Nginx variable).
Another choice that I made was to log bot and static resource traffic; see the previous section.

To test the site, I used `curl` with the `--resolve` option to override DNS and send requests to my VPS before I moved real traffic over.

## Wrapping Up

I'm now moving more of my sites to my VPS and thus where I can track analytics.
As a user, you won't notice; Cloudflare proxies the traffic anyway.
If you are a recruiter, thanks for spending time reading more than just my resume.
