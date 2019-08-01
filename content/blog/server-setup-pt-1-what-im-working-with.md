---
title: 'Server Setup pt. 1 - What I''m working with'
date: Fri, 05 Jan 2018 18:48:39 +0000
draft: false
tags: ['Servers']
---

This is the start of the documentation for servers.
As such, I figured it'd be best to give the background info for what I'm working with.

<!--more-->

Over the summer I built two computers, a "workstation" and a server.
Here I'm going to be focusing on the latter.
I got really fortunate to find a matched pair of Xeons for $250 on eBay from a reputable seller (although they're Sandy Bridge, and in light of Meltdown & Spectre they lack some security introduced in Ivy Bridge... oh, well, I'm on a college-student budget and hindsight is 20/20 XD).
In total, these are the most important specs:

*   32 Threads (8 cores \* 2 (hyperthreading) \* 2 cpus)
*   64GB of RAM
*   A 128GB SSD for booting and the most important VMs
*   A 250GB 7200RPM scratch diskfor less important VMs
*   6TB of WD Red drive space, on a PCIe LSI HBA (Host Bus Adapter, similar to a RAID card)
*   Dual NICs

In the future I'd like to look at exactly how the RAM, CPUs, and PCIe lanes connect to each other to optimize the setup (have the NAS pinned to the secondary CPU and using a PCIe slot on that CPU).
My previous setup was on ESXi (free version).
While great for learning, it can feel a bit limited once you get far enough in, if only for liking full control over my system.
Additionally, patching it is a real hassle.
I decided (also in part b/c I hang out with a lot of FOSS people) that I wanted to use KVM as my new hypervisor, and the easiest way for me to do that was Proxmox.
I used the time I was on ESXi to do a lot of screwing around research, however, it left a lot of unwanted bloat at times, so this will be a clean refresh.
The main features I had that I want to carry over were:

*   pfSense as router/gateway/firewall on WAN
*   DMZ network (with one-way LAN->DMZ connection)
*   DNS Blacklist for undesirable sites
*   VPN to my LAN
*   Suricata running with Snort rules (aka, NIDS)
*   Host only manageable from LAN
*   Static IPs & Internal DNS
*   FreeNAS with SMB shares for myself (I have Windows machines)
*   Docker host

In addition to that, these are the features that I didn't get to implementing (in part because I knew I was going to do a clean refresh):

*   Nextcloud (w/ pretty much "the works" inc. OCR, Collabora Office)
*   GitLab
*   Plex & Subsonic/Madsonic
*   Better (internal) web hosting w/ DNS
*   Mail
*   AD-like functionality

These will come in a few parts.
The next part is going to be on the host setup, including the pfSense VM for networking b/c accessing the internet is kind of important ;)