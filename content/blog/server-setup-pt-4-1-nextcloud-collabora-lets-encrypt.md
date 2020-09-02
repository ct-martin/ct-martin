---
title: 'Server Setup pt. 4-1 - Nextcloud, Collabora, Let''s Encrypt'
date: Sat, 17 Feb 2018 21:25:47 +0000
draft: false
tags: ['Humanitarian Free & Open Source Software', 'Servers']
---

After more work than I'd like, I have Nextcloud & Collabora Office set up. I had a lot of issues running Collabora as a package during this.

<!--more-->

To prevent constantly linking that article (pt. 4-2 of server setup), I'm going to just link it just once, [here]({{< ref "/blog/server-setup-pt-4-2-collabora-package.md" >}}).
Also, as a reminder, my internal `i.ctmartin.me` subdomain is not publically accessible.
I opted for a dedicated VM for my data services.

First, I created an Ubuntu LTS-based VM and installed Apache, PHP, MariaDB (MySQL), & PHPMyAdmin (via package).
This was a pretty generic LAMP install, the only special part was that I added some extra PHP extensions that are optional for Nextcloud... "just because" (this will be a recurring theme...).
I added host overrides in pfSense I used a basic install of Nextcloud to the /var/www/nextcloud.
I had to do quite a bit of work on the VHost configs, so the final ones are [located here](https://github.com/ct-martin/servers/tree/master/jeeves/etc/apache2/sites-available). The main points are:

*   Based on the Nextcloud/Collabora Office recommended configs
*   SSL/TLS via Let's Encrypt
*   Use Apache instead of Collabora for SSL/TLS
*   Use `RewriteRule .* https://%{SERVER_NAME}%{REQUEST_URI} [NE,R,L]` for HTTP->HTTPS redirection since it preserves the path
*   Add `Header set Content-Security-Policy "frame-src 'self' collabora.i.ctmartin.me cloud.i.ctmartin.me;"` so the `<iframe>`ing of Collabora in Nextcloud works

Next, I installed Collabora Office as a package (since I wanted a dedicated install).
This proved to be a major hassle, so you can use Docker and/or see the other blog post above, but I'm just going to continue moving along.
On the Nextcloud side I had to install the accompanying Collabora Office package and provide it the location of my Collabora Office install (after setting up Let's Encrypt).
After installing those prerequisites, I had to install Let's Encrypt.
This part was really nerve-wracking b/c I also have a few other things I'm working on, and I had to do all of this in the blind.
I used [Certbot](https://certbot.eff.org/) ([docs here](https://letsencrypt.readthedocs.io/en/latest/intro.html)) with a little mix-and-match from the [example for Cloudflare usage](https://letsencrypt.readthedocs.io/en/latest/using.html#pre-and-post-validation-hooks) (since that's my public DNS, and this server isn't public, so I can't use the normal methods).

The full command I used was `./certbot-auto run -a manual -i apache --preferred-challenges=dns --manual-auth-hook /etc/letsencrypt/authenticator.sh --manual-cleanup-hook /etc/letsencrypt/cleanup.sh -d cloud.i.ctmartin.me,collabora.i.ctmartin.me`.

Your command will probably be a little different, particularly if you are using the package.
You can also add/remove domains later using these steps in [this section of the docs](https://letsencrypt.readthedocs.io/en/latest/using.html#changing-a-certificate-s-domains).
Don't forget to add a `crontab` entry to run the Certbot `renew` command, such as `0 0 * * 0 /etc/letsencrypt/certbot-auto renew`.

Since I have a NAS for my storage, I needed to SMB storage, which proved to be annoying and I ended up just installing both the system package and the PHP library for SMB.
Just for fun I set the SMB storage under the admin panel's global shares and used the `$user` parameter in the folder path.
I added Google Drive and Dropbox external storage since I had them laying around and I might as well.
For Dropbox I had to add a [custom plugin](https://github.com/icewind1991/files_external_dropbox) from GitHub as Nextcloud decided not to update to the new API.

I also installed most of the officially supported packages "just because" (even though I don't have a support contract) and disabled most of the sharing features since this install is behind a VPN and not accessible anyway.
This setup doesn't sync local data storage yet, and Collabora Office from external storage can have mixed results.
Additionally, encryption isn't supported by Collabora Office.

In the future I'd like to set up a `fstab` entry for mounting the `data/` folder to my NAS, or just really good backups.
This will also have the advantage of allowing for clean syncing of Notes, Tasks, etc.

---

_Updates:_  
_2019/07/08: Content reflow_  
_2018-04-12: More sensical cron timings as evidenced by my cert expiring..._