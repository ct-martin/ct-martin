---
title: 'Server Setup pt. 5 - DMZ'
date: Tue, 06 Feb 2018 20:24:32 +0000
draft: false
tags: ['Humanitarian Free &amp; Open Source Software', 'Servers']
---

A DMZ ("Demilitarized Zone") is an isolated network segment, usually used for public-facing servers to keep anything that may go awry on them from being able to damage the rest of the network.

<!--more-->

_The rest of part 4 is coming, but 4-2 and this were moved forward due to complications and over-scoping._

However, you don't need a server to be public-facing to have reason to isolate it.
The logic is the same as when developers use a technology that isolates the software, like chroots or Docker.
A DMZ is nice in that it allows you to have that segmented network, meaning that if you are developing software that will be deployed to a different location with a different network, you have the ability to emulate that.

1.  Create a new virtual network bridge on my Proxmox host (labelled "DMZ") with no IP address given.
If you want to attach it to a physical NIC to allow connectivity to another server, you can, but I don't have a third NIC nor another server, so I left it without one.
2.  Create a new pfSense VM (which will be referred to as the DMZ pfSense henceforth) and gave it NICs for the WAN and DMZ.
This pfSense (DMZ) will be on the DMZ bridge, but the VM is blind to that, so for it, the DMZ is its LAN.
That includes configuring it to provide DHCP on the 192.168.32.x/24 subnet.
3.  In my original pfSense VM (which will be referred to as the LAN pfSense), I added a third NIC and rebooted it.
I then went into _Interfaces->Assignments_, selected the new NIC, hit "Add," and gave it a Static IP address of 192.168.32.250.
To prevent any possible hiccups, I also went into the DMZ pfSense and added a static mapping there.
4.  In _Firewall->Rules_ I added a rule to allow access to the DMZ from the LAN.
The contents of this were: Action: Pass, Interface: LAN, Address Family: IPv4+IPv6, Protocol: Any, Source: LAN net, Destination: DMZ net

For convenience, I also added some DNS records.
I added a Host Override for the DMZ's pfSense, which I have on a different domain, and a Domain Override for that domain for that other domain so that anything registered in the DMZ pfSense can be accessed on the LAN side from its FQDN.
I also chose to give it DDNS.
I did this from the LAN pfSense, and in order to do so, I had to set the DDNS's Interface to the DMZ and also give it a non-default Gateway (so that it would resolve the IP from the DMZ instead of the LAN pfSense directly).

Since the assumption when working with a DMZ is that it might be compromised, the same protections are needed as with the WAN, so I cloned the WAN settings in Suricata and set the interface to the DMZ instead (it defaulted to the LAN for me).
This basic set of instructions is also easily customizable.
For example, if your DMZ segment is going to be deployed to another site, you could swap out the instructions below for adding a NIC on pfSense to the DMZ with an [OpenVPN site-to-site connection](https://docs.netgate.com/pfsense/en/latest/vpn/openvpn/routing-internet-traffic-through-a-site-to-site-openvpn-connection-in-pfsense-2-1.html) on the WAN bridge.
Or, if you're going to be deploying to somewhere that has unreliable IP addresses and requires using DNS for everything, you can set up the DMZ pfSense to provide DNS for all devices on the network (DNS Settings -> "Register DHCP leases in the DNS Resolver").

It's even possible to ignore the exact instructions but use the same basic methodology to have the DMZ be a Docker host with a proxy at the front (or something for shared hosting, like VestaCP).
One of the other nice things about this is that it's scalable so you could easily create another for a home lab, a second home lab with different infrastructure, a second DMZ for a friend's server, or something entirely different.
If you're really scaling this up, however, you might want to consider things like VLANs and/or having one pfSense instance control multiple isolated segments to reduce the overhead (while 10 network bridges are still manageable, 10 instances of pfSense isn't practical for most use cases ;) ).

---

_Updates:_  
_2019/07/28: Content reflow_