---
title: "Hugo"
#date: Fri, 08 Aug 2019 18:44:00 +0000
date: Thu, 24 Oct 2019 22:22:00 +0000
draft: false
tags: ['Software', 'Servers', 'Web Dev']
---

This summer I converted my blog to use [Hugo](https://gohugo.io/), a static site generator, and [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/) for a simple, lightning-fast, and secure writing experience.

<!--more-->

First off, why did I leave [WordPress](https://wordpress.org/)?
WordPress is an amazing piece of software and I'd still recommend it.
WordPress' Gutenburg editor, Jetpack plugin, and new auto-updates are all amazing and easy to work with.
However, keeping it & my VPS up to date has overhead, primarily in time.
Not a ton, but enough to not motivate me.
Additionally, I've done enough with security to know my setup needs work, yet that work would take more time then I'm willing to put in.

The final straw for me was that when rebuilding my VPS (previously Debian 9), I found Fedora 30's `wordpress` package did not set up some permissioning out of the box & WordPress couldn't write to disk.
I ended up rebuilding it to Debian 10, but I wasn't motivated to get a working web server up at the time.
Finally, I've used [Jekyll](https://jekyllrb.com/) in the past and I'd heard amazing things about Hugo (some of which addressing my major pain points with Jekyll, most notably the build time).

So, I went about learning how to use Hugo.
The quick-start guide is great if you're planning to use a pre-built theme, however, unfortunately the theme/template guides do not have a quick-start.
Once I figured out how to make the theme & templates it was really easy, but getting started took longer than I'd have liked.

I used [this amazing script](https://github.com/palaniraja/blog2md) to convert my WordPress export to Markdown.
It wasn't perfect, but a large part of that was also that the content from WordPress' classic editor not exporting correctly (since re-importing to a test WordPress instance didn't display correctly either).
I had to make a [couple](https://github.com/palaniraja/blog2md/pull/7) [tweaks](https://github.com/palaniraja/blog2md/pull/10) to it (and the PRs got accepted :) ) so it wouldwork for my configuration, but it was simple code which made it easy to work with.

Cleaning up the posts took a decent amount of time, but now that they're in Markdown they're portable and that makes me happy.
Because I made a simple (custom) theme, the code is also small which makes my life easier.

I was also very happy to find out that Hugo's "Extended" edition supports [SASS](https://sass-lang.com/).
I've been using SASS at my co-op this summer and I really like it.
I'm not so fond of the full SASS syntax, but I _really_ like the SCSS syntax.

The icing on the cake is GitLab CI & Hugo's build times.
While the code is [hosted on GitHub](https://github.com/ct-martin/blog.ctmartin.me), I'm using GitLab.com's ["CI/CD for External Repositories"](https://docs.gitlab.com/ee/ci/ci_cd_for_external_repos/) which adds a webhook to GitHub so when I push to GitHub it pulls to GitLab automatically.
Then, GitLab runs [a pipeline](https://gitlab.com/pages/hugo/blob/master/.gitlab-ci.yml) (modified to use the [Hugo extended container](https://gitlab.com/pages/hugo/container_registry)) that builds the site as an artifact for GitLab Pages.
Hugo compiles the site in about 0.2s, and the _entire_ CI Pipeline [reports](https://gitlab.com/ctmartin/blog-ctmartin-me/-/jobs/263595470) as a 30s run.

These times are _really_ nice and admittedly I've already tested in production because of how fast it it...

Finally, Cloudflare points to GitLab pages and adding the route was easy apart from needing to find the [documentation on adding the CABUNDLE](https://about.gitlab.com/2017/02/07/setting-up-gitlab-pages-with-cloudflare-certificates/) for the origin cert.
I've also since added line to my GitLab CI file to purge the Cloudflare cache on deploy.

So, I've got a new blog site now.
If you see "Content Reflow" in the changelog of any pages, it means I lost (or intentionally modified) the paragraph breaks of a page.
I'm super happy with this site and Hugo, Markdown, GitLab, & Cloudflare have made this site both fast, secure, and convenient for me to do.

And no server maintenance :)