---
title: 'Server Setup pt. 2 - Host Setup & Networking'
date: Sat, 06 Jan 2018 01:26:47 +0000
draft: false
tags: ['Servers']
---

It's time to install everything and do some tweaks to make life nicer.
Also, a list of issues I encountered and how to go about resolving them.
I'm going to use a lot of links to skip over most of the installation process, it's fairly well documented (and the configuration is the more interesting part).

<!--more-->

For the hypervisor I'm going to use [Proxmox](https://www.proxmox.com/en/proxmox-ve).
From what I've seen (correct me if I'm wrong), it's not used much in "the industry," but it's popular for home labs (which this counts as) and the underlying software/technologies are used in "the industry" to a very large extent.

The [installation guide can be found on their wiki](https://pve.proxmox.com/wiki/Installation), and if you've ever installed another Linux distro with a GUI it'll be familiar.
If you're using another disk like I am for extra VM disk storage, Google (or DuckDuckGo) is your friend.
I had to reformat my disk and add it to `/etc/fstab` before I could use it in Proxmox with the "Directory" option pointing to the location I gave it in `/mnt`.
From the first attempt I made at doing this I'm going to add a special note about networking as found in [this Reddit thread](https://www.reddit.com/r/homelab/comments/634dst/help_with_pfsense_on_proxmox_with_how_it_all_fits/dfre47m/):

*   Keep Proxmox on the default `vmbr0` bridge with a static IP for the LAN
*   Make another bridge for the WAN, attach that NIC, and _don't_ give it an IP

I chose to re-create the bridges [using Open vSwitch](https://pve.proxmox.com/wiki/Open_vSwitch) because I could, and I'm interested in messing around with VLANs in the future.
I also _HIGHLY_ recommend _NOT_ configuring the networking via the shell (excepting the `apt` command to install the package), I spent about 2 weeks worth of free time on the version 0 of my setup trying to get this to work and ultimately failing (for context, ESXi was used for version 1, this is version 2, read between the lines ;) ).

For all the VMs I'm running, I have UEFI enabled.
To do this (if your host supports it), BEFORE running the VM for the first time, in Options change the BIOS from SeaBios to OVMF, then add an EFI disk in Hardware. 
dditionally, make sure to install the UEFI version of your VM's operating system.

[Installing pfSense on Proxmox is well-documented on the pfSense wiki](https://doc.pfsense.org/index.php/Virtualizing_pfSense_on_Proxmox).
I set the internal hostname to pfsense with the domain infra.ctmartin.me (for those of you who are thinking about trying to ping it, good luck, it's internal DNS :P ).
For DNS servers I'm using [Quad9](https://www.quad9.net/), although I also recomment [Cloudflare's 1.1.1.1](https://1.1.1.1/).
Additionally, I turned off the option to get DNS servers from DHCP.

To ensure that Proxmox could be accessed with its hostname even though its static IP is set on itself, I added a host override in the DNS Resolver.
Additionally, I set up OpenVPN (using the wizard) so that I could access my LAN remotely, and used the OpenVPN Client Export package for personal convenience, and used Dynamic DNS in case my IP address changes.

For security, I blocked both private and bogon addresses on the WAN network.
The DNS Resolver was set to use all except the WAN interfaces to answer DNS requests.
The ACME package was used to get a certificate from Let'sEncrypt since it can use DNS to validate.
In the Suricata package the WAN interface was added, and both the Emerging Threats and Snort rules were enabled.

In pfBlockerNG I enabled DNSBL (DNS Blacklist) with a bunch of feeds.
I recommend looking at [the PiHole project's list](https://github.com/pi-hole/pi-hole/#pi-hole-projects), although you can find more if you want.
It's important to note in the DNSBL that headers/labels can only use numbers, letters, and the underscore.
If you use Google Analytics, you'll want to whitelist `analytics.google.com` (you'll still be safe from tracking though, since that's served from `google-analytics.com`).
In pfBlockerNG you'll need to enable it in a bunch of places, so pay attention for those checkboxes.

The recommended defaults for updates are fine in both Suricata and pfBlockerNG (although they are turned off by default, they are given on ther page).
After configuring the packages you'll want to go into the respective one's update page and run an update.
You can check if they are running by going to _Status->Services_.

---

_Updates:_

_2019-07-28: Content reflow & link updates_

_2019-01-17: I'll be making a lot of changes to this, particularly for the blacklists. Another thing I've needed to set up on some networks is Gateway Monitoring, you can find details in the pfSense docs or keep an eye out for the re-write of this post._