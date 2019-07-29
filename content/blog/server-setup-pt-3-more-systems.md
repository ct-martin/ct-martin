---
title: 'Server Setup pt. 3 - More Systems (FreeNAS, Docker/Portainer, Web/LAMP)'
date: Sat, 06 Jan 2018 04:09:35 +0000
draft: false
tags: ['Servers']
---

Just having a router is a rather boring use for a home lab server.
Time to add a NAS, Docker, and a LAMP setup.
[FreeNAS can be virtualized](https://www.freenas.org/blog/yes-you-can-virtualize-freenas/), although there are some points you'll want to follow:

<!--more-->

1.  Use PCIe passthrough of a HBA for your disks.
PCIe passthrough allows FreeNAS _direct_ access to the disks (very important), and a HBA (Host Bus Adapter) is a PCIe hardware device to let you do that, without hardware-level RAID that could interfere with the software RAID (via ZFS) happening within FreeNAS.
For Proxmox, [docs for PCIe passthrough are here](https://pve.proxmox.com/wiki/Pci_passthrough), just be careful to differentiate the PCI and PCIe parts.
2.  You still want to follow the system requirements guidelines for resources (CPU, etc.).
Additionally, when allocating memory, make sure ballooning is _NOT_ checked.
The minor caveat of this, however, is that to Proxmox the VM will seem to using all of its memory all the time, so use FreeNAS's reporting for better stats.
3.  Mounting the storage of the VM on the host (Proxmox) is generally a bad idea.
4.  The forum probably isn't going to help you.

Another note from personal experience is that you may have strange things happen when you update FreeNAS.
I recommend using snapshots, and you may have to manually restart the VM a couple times.
I've had it hang on shutdown after an OS update and also on the subsequent boot, but usually that's it.
Just be careful to make sure it's on the shutdown/boot process, wait a bit to make sure it's hung and not just being slow.
I also usually run the "Verify Install" tool after this for safety, but I've never had it say anything is wrong.

I have 3x2TB disks set up in an encrypted RAIDZ volume for both redundancy and security (RAIDZ with 3 disks allows ZFS to do data recovery if bitrot or similar corruption occurs. You can also use two virtual disks for boot by selecting both in the installer and thus have them mirrored).
Since I have Windows machines that are accessing this volume, I configured it with Windows permissions and created an SMB share.
I also have a sub-dataset with permissions for a "guest" user (so I can transfer data out of a VM, and whose group I added to my user as an auxilliary group so I can access it (Windows doesn't let you use 2 users on the same SMB server)).

Next (not documented here) will be the long journey of ingesting all my data from a number of places done with years of extremely poor practices and definitely duplicates...

The other two platforms I'm going to document setting up here are Docker and LAMP.
For both I'm using Debian as the base OS, and a GUI on top.
For Docker I'm using [Portainer](https://portainer.io/) (with Portainer itself set up as a Docker service).
I have previously tried Rancher, however, I had an issue where using any DNS other than Google's caused everything to break (and I have local DNS), so that was not repeated.
I tried to set some stuff in Docker, but had mixed results, so that will be documented in another blog post.
The Portainer install was easy, however, you need to [set up the data to be persistent](https://portainer.readthedocs.io/en/stable/deployment.html#persist-portainer-data), otherwise, you'll have a lot of fun re-making the admin user every time it gets restarted.

Additionally, I created a one-node Docker swarm so that I can run services (aka, have auto-reboot of containers).
For a LAMP server I'm using [VestaCP](https://vestacp.com/), which was also easy to install.
I chose to have no firewall, mail, nor Softaculous since this is an internal server.
I set up a number of domains under beta.ctmartin.me (internal DNS, don't bother trying to access :P ) for my development & testing.
Additionally, in the pfSense DNS Resolver I set a domain override for beta.ctmartin.me to point to this VM.

A couple caveats though: First, it uses your public IP when installing.
This can be fixed by changing the DNS settings to use the internal IP.
However, this will also break the default domain for the host that gets created.
I had to delete that domain in both the "Web" and "DNS" sections before re-creating it in order to attach the base beta.ctmartin.me to it (I set up a shortcuts page there).
Second, VestaCP currently only supports webroot for it's Let's Encrypt certs, but with the deprecation of that in ACMEv2 hopefully we'll see additional methods added that'll work off the public web.
Setting up all this infrastructure can be a hassle, but it'll pay off.

---

_Updates:_

_2019/07/28: Content reflow_

_2018/04/04: Add note on Let's Encrypt verification methods_

_2018/02/17: Forgot to mention the one-node Docker swarm_

_2018/01/25: Added note on update quirks_