---
title: 'Server Setup pt. 6 - Mail'
date: Wed, 04 Apr 2018 05:04:46 +0000
draft: false
tags: ['Servers']
---

Mail servers are handy, even if you're just using them for internal logging like I am.

<!--more-->

This time I'm setting up a mail server on my internal network at `mail.i.ctmartin.me` (and as always, a reminder that you can't actually access this).
I'm using [Mail-in-a-Box](https://mailinabox.email/) after a couple attempts at other out-of-the-box solutions failed me, and because I'm not familiar enough yet to use the command line to configure everything.

Since this is going to be done on an internal, non-public network, you can just make an Ubuntu Server 14.04 VM and skip to the [near-bottom of the install guide](https://mailinabox.email/guide.html#setup).

I set up the email `ct@mail.i.ctmartin.me` and set the box's hostname to `mail.i.ctmartin.me`.
It's going to flip out about not being able to resolve/verify the hostname/DNS, just ignore it.
To fix this, there are a couple steps.

First, go into pfSense's DHCP Server and give the box a static lease.
Second, go into the DNS Resolver and add a few items.
You'll want a host override and domain override both pointing to that static IP.
Third, toss the line `local-data: "i.ctmartin.me. IN MX 10 mail.i.ctmartin.me."` into your Custom Options box (with `i.ctmartin.me` being your own domain of course; thanks to [this post](https://blog.paranoidpenguin.net/2017/07/pfsense-how-to-add-a-mx-record-to-a-local-zone/) for the hint on the MX record).

The last part to fix this requires being on the mail box via SSH or console.
While I don't know enough networking to confirm this, it _appears_ that Mail-in-a-Box has the nameservers to use hardcoded into it.
Since I'm running this (a) on a local network and (b) I trust my local pfSense's DNS, this doesn't make sense.
To fix this, go into the file `/etc/bind/named.conf.default-zones` and change the following block from:

```
zone "." {
    type hint;
    file "/etc/bind.db.root";
};
```

to:

```
zone "." {
    forwarders {
        192.168.127.254;
    };
};
```

Use whatever IP your router is instead of that one.

You should now be able to navigate to `https://[your.domain.here]/admin` and the system checks should mostly go away.
I still get a few DNS-related errors, but given that the DNS is resolving fine in practice, I'm not concerned.

Another caveat of this setup is that SSL/TLS doesn't work because Mail-in-a-Box uses a custom ACME client for Let's Encrypt that only supports webroot.
Thankfully [there's an issue](https://github.com/mail-in-a-box/mailinabox/issues/1314) to track working on this.

I was able to get FreeNAS set up with an account fine, but pfSense has stricter checking of certs so it didn't work out on that side.
Long story short, your mileage may vary.

Next up for this part of the project is a bunch of logging which I can then use this email for to tell me when things need to be poked... since you know, I actually check it like a responsible sysadmin even if it's basically just a home lab... right?

PS: if you read this article and happened to be dissatisfied that they're still using Ubuntu 14.04, don't worry, there's [an issue for that](https://github.com/mail-in-a-box/mailinabox/issues/1358) too.

---

_Updates:_  
_2019-07-29: Content reflow_