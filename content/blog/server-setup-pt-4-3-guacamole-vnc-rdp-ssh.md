---
title: 'Server Setup pt. 4-3 - Guacamole (VNC/RDP/SSH)'
date: Sat, 17 Feb 2018 22:29:26 +0000
draft: false
tags: ['Humanitarian Free &amp; Open Source Software', 'Servers']
slug: 'server-setup-pt-4-3-guacamole-vnc-rdp-ssh'
---

Since I've been playing with a bunch of distros in VMs lately, let's set up some (more) convenient remote access...
After all, remembering semi-arbitrary strings isn't fun, and I'm currently running 6 VMs that are just to see what various distros are doing, in addition to the other 9 I have for other things.

<!--more-->

Guacamole is going to be running on the Docker host I set up in [part 3](https://blog.ctmartin.me/2018/01/server-setup-pt-3-more-systems/) that runs Portainer.
The [Guacamole docs for Docker](https://guacamole.apache.org/doc/gug/guacamole-docker.html) are relatively straightforward, but they aren't perfect, and I'm modifying them slightly.
I want Guacamole to be always running, and this works perfectly since I have my one-node Docker swarm.

I created two services for the two Guacamole Docker services, with replicas set to 1 (this makes sure there is always 1 instance of Guacamole running), and ports forwarded.
Additionally, I opted to use the MySQL (MariaDB) instance on my data VM (mentioned offhand in [pt. 4-1](https://blog.ctmartin.me/2018/02/server-setup-pt-4-1-nextcloud-collabora-lets-encrypt/); it's just a normal install).

Thus, for environment variables in the `guacamole` container (not `guacd`) I added `GUACD_HOSTNAME` set to the Docker host's hostname, and `MYSQL_HOSTNAME`, `MYSQL_DATABASE`, `MYSQL_USER`, & `MYSQL_PASSWORD` to the relevant details.

I also had to change the `bind-address` for MariaDB and open the port 3306 in UWF to allow the remote access (although my other database users are set to only allow access from localhost, preventing remote access on there).
Additionally, Guacamole's docs make it confusing that you need to download the `guacamole-auth-jdbc-x.y.z.tar.gz` file from the release downloads, and the schemas are in there in `/mysql/schema`.
You can install those easily by uploading them into the PHPMyAdmin interface by going to the database and then going to the "Import" tab (for example).
They just create the tables and add the "guacadmin" user to the Guacamole users table.

If you followed the docs closely and get a permissioning error, the docs don't have you give access for the "CREATE" permission, so you might need to temporarily add it, or run it under a different user.

Proxmox has [docs for remote VNC access](https://pve.proxmox.com/wiki/VNC_Client_Access), I'm using those for the test VMs I don't care about.
For my important VMs I'm going to set up a real VNC/similar server at a later date and time since the Proxmox method doesn't allow setting a password.

As a random aside, initial impressions of Guacamole was very good, it felt snappier/more responsive than Proxmox's built-in VNC client (although this has not been thoroughly tested). (Also, quick tip: if you get "stuck" in the settings section, click the username at the top right and then "Home")

---

_Updates:_  
_2019/07/28: Content reflow_