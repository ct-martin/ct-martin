---
title: 'The apartment life of securing data'
date: Thu, 17 Jan 2019 17:25:11 +0000
draft: false
tags: ['Servers']
---

As a college student, I have enough data that I want secure, but no permanent, secure location for my server to go. This makes for some interesting challenges in managing my data.

<!--more-->
---

Wanting encryption is not uncommon, nor is doing it at a lower-scale (see also: home NAS servers). However, this gets a lot more complicated by the fact that I don't have a permanent home for my server. It hosts my workstation, and it follows me when I move between home & school. However, my apartment is frequently opened by management for maintenance and inspections, and our doors broadcast themselves on Bluetooth, and Bluetooth + door locks is not a combination I trust. So, how am I dealing with this?

The first half of the answer is that almost all of my data is in an encrypted FreeNAS volume. Unlike normal encryption at rest, I have it configured to require me to provide a key to unlock it every time. This solves both encryption at rest and potential access to the physical space by others, as if they pull the power to take the server then it won't unlock when it's plugged back in.

The second half involves laughing. A lot. It's split between a mad scientist laugh and watching other's reactions. I've had _really_ bad luck trying to set up NFS on FreeNAS and eventually given up in favor of SMB. I've also had mixed results setting up things in FreeBSD jails. Before I continue, this would also be an opportune moment to encourage readers to be sitting and not be holding a hot drink while reading the rest of this; I don't take responsibility for injuries caused by reading this article. With that out of the way, I have an SMB share for Proxmox virtual disks on FreeNAS, which I use to host virtual disks for small containers when I need. You might have just done a double-take and felt the need to re-read that sentence. And that's sort of expected. If you've read my earlier posts on my server you'll also know that [my FreeNAS is a VM w/ an HBA using PCIe passthrough](https://blog.ctmartin.me/2018/01/server-setup-pt-3-more-systems/). So yes, here is the path of data for more sensitive applications:

```
My laptop <-> pfSense HAProxy proxy w/ TLS termination <-> Application running in container <-> SMB share from Proxmox to FreeNAS <-> Virtual disk on FreeNAS <-> ZFS <-> PCIe passthrough of HBA <-> Disk
```

Let's look at this in a real example. I connect to my Nextcloud at `cloud.i.ctmartin.me`. This gets proxied to Nextcloud's LXC container, where the instance runs. The Nextcloud storage is a combination of a virtual disk on the encryption-backed SMB share for Proxmox and another SMB share to my home folder on FreeNAS (where most of my data lives), which are both on RAIDZ1 on the disks accessed via PCIe passthrough for the FreeNAS VM.

Yes, I do insane things sometimes. But I like privacy and security, and sometimes I have to jump through hoops to get them.