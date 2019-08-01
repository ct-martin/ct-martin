---
title: 'Server Setup pt. 4-4-1 - GitLab Basic Install'
date: Thu, 12 Apr 2018 06:36:35 +0000
draft: false
tags: ['Humanitarian Free &amp; Open Source Software', 'Servers']
---

Running GitLab behind a proxy requires a bit of setup.

<!--more-->

Start from a [basic install of parts 1 & 2 on this page](https://about.gitlab.com/installation/#ubuntu?version=ce).
Before you're going to be able to load the webpage to continue setup, you're going to need to [set up GitLab for running a "non-bundled web server"](https://docs.gitlab.com/omnibus/settings/nginx.html#using-a-non-bundled-web-server) and use `gitlab-omnibus-ssl-apache24.conf` for the web server config.

In the admin panel you're going to want to go to the Settings section and at the very bottom form on "Allow requests to the local network from hooks and services" if you have any plans to use CI/CD with this (since I'm assuming that you're setting it up on an internal network).

It's also possible to hook up SMTP to a mail server (as done in [part 5 of this series](https://blog.ctmartin.me/2018/04/server-setup-pt-5-mail/)). With the internal Mail-in-a-Box, TLS didn't quite work. I had success with the following settings though:

{{< figure
    src="/wp-content/uploads/2018/04/Capture.png"
>}}

combined with the appropriate settings for:
```
gitlab_rails['gitlab_email_from'] = 'gitlab@example.com'
gitlab_rails['gitlab_email_reply_to'] = 'noreply@example.com'
```

That's all for now! Future improvements will include GitLab Pages and using my network storage... in a future post.

---

_Updates:_

_2019-07-29: Content reflow_