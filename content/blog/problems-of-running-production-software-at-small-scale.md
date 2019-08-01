---
title: 'Problems of running production software at small scale'
date: Thu, 17 Jan 2019 16:46:17 +0000
draft: false
tags: ['Late Night Rants', 'Servers', 'Software']
---

As a student (and generally as someone learning tech), it's really nice to be able to run the same technology that is used for production systems. However, this is not always a viable option, particularly as a college student, and I want to talk a bit about why this is a challenge.

<!--more-->
---

Generally, but particularly for tech, learning by doing is extremely important. Every developer, sysadmin, or even users will at some point have encountered a thing which prompted the question, "That's odd, why didn't that work?"

From experience (and some cases are documented on this blog), servers and software work much better in theory than in practice. Add some security, a less-typical topology, or an odd bug into the mix and suddenly everything stops working. I've encountered issues setting up GitLab on FreeNAS because Postgres 9.6 doesn't work in a FreeBSD jail (the just-released GitLab plugin for FreeNAS [even uses Postgres 9.5](https://github.com/freenas/iocage-ix-plugins/blob/master/gitlab.json)), Mail-in-a-Box [not working on an intranet](https://blog.ctmartin.me/2018/04/server-setup-pt-6-mail/) because it had the root DNS servers hard-coded, Collabora Office CODE [not working when the TLS certificate is symlinked](https://blog.ctmartin.me/2018/01/server-setup-pt-4-2-collabora-package/), and other really random issues like these.

However, while some of these issues can make learning experiences, there's a point at which they stop, and that's what I want to focus on today. My biggest gripes with inadvertent gatekeeping in learning tech are (1) software which requires knowledge either not in or not clearly stated in the documentation, (2) software that does not support common features (sometimes seemingly by design), and (3) software with high base resource consumption.

Let's tackle these issues in order. Software with bad documentation seems fairly obvious in terms of problems, but bad docs are still way too common unfortunately. Trying to get GitLab to run using an NFS share from FreeNAS, or trying to run Grimoire are examples. The former doesn't work due to GitLab requiring an extremely strict system configuration while FreeNAS doesn't have a toggle for a GitLab-required NFS flag. I was unable to figure out how to set it manually despite pulling out binary search operator tricks.

Grimoire's old docs required someone to know everything in the docs, including all the code snippets and one-word links in the middle of paragraphs, before being able to follow them to configure it. [I tried at one point](https://blog.ctmartin.me/2018/04/the-importance-of-good-docs/) to do both of the official installation methods and still failed. The necessary knowledge was presumably there (and I also could have dug around for a forum, mailing list, or chat room), but it wasn't accessible. Since then they've completely rewritten their docs, for that exact reason, because it was an issue.

Running Jekyll on Fedora (despite Jekyll having docs on it) is [another example](https://github.com/RITlug/ritlug.github.io/issues/170); I still haven't gotten it working on my laptop. Someone found a Docker container that I'll probably be using instead. It's a problem when successfully installing software is too high a bar of entry for someone not deeply involved in the project.

Second: lack of support for common features - some software lacks basic abilities, like first versions of the new FreeNAS UI were unable to unlock an encrypted volume, but others, particularly open core and tiered-licensing software, outright deny access to common features. RedHat seems to sideline Ceph in favor of GlusterFS despite Ceph's adoption in the datacenter and research (Cern uses Ceph, for example). Nextcloud forked ownCloud, because the [developers felt restricted by ownCloud's enterprise licensing](https://www.zdnet.com/article/nextcloud-releases-owncloud-fork-ahead-of-schedule/) (and [to put focus back on users](https://www.zdnet.com/article/owncloud-founder-resigns-from-cloud-company/)). At time of writing there are still features that Nextcloud has available to everyone that are enterprise-only features for ownCloud (or are marketed in a way that implies they are). [MariaDB forking MySQL when MySQL was acquired by Oracle](https://www.computerworld.com.au/article/457551/dead_database_walking_mysql_creator_why_future_belongs_mariadb/) is another example, and so is [XCP-ng forking XenServer due to Citrix removing already-available features](https://www.kickstarter.com/projects/78495858/xcp-ng). It's harder to learn software when it (intentionally) doesn't work at all than if there were little to no docs, as functionality that should be there is not.

Finally, software with high base-resource requirements. For some applications, for example, AI & machine learning, it's reasonable to expect a larger resource consumption. However, there are many applications which have resource requirements that are seemingly disproportionate with the underlying software that is used.

For example, Git, KVM, Docker, & Kubernetes are lightweight enough that they can be run relatively easily on a laptop that is mid-low range. At least Git & Docker can be run on a Raspberry Pi. However, software that manages these can be extremely heavy, such as GitLab, oVirt, & OpenShift/OKD. These have a RAM requirements of 8GB, 4GB, and 16GB, respectively (RAM is the biggest resource issue in my experience). Yet, there are alternatives available, such as Gitea, Proxmox, & Dokku, which have extremely low RAM requirements of around 1GB. I'm not sure what makes programs have such high or low RAM requirements - neither Postgres nor Java nor interpreted languages (which are used by the more-intensive programs mentioned) have such high requirements for the base of a program.

I have a reasonably powerful server - 32 threads & 64GB of RAM w/ plenty of disk space for my usage. I don't expect to be able to run a complete datacenter (this is a "home lab" not an enterprise datacenter for a reason), however, I do expect a certain level of ability to run things. But let's run some quick numbers to make some quantitative data.

_RAM of heavier setup:_  
oVirt (4GB) + GitLab (8GB) + OpenShift/OKD (16GB) = **28GB**  
_RAM of lighter setup:_  
Proxmox (1GB) + Gitea (<1GB) + Dokku (<1GB) = **~1.5-2GB**

The heavier setup here has _over an order of magnitude higher requirements_ to run. While the lighter setup is not necessarily meant to run at an enterprise level of scale, it still works reasonably well at scale and the difference in resource requirements is just too huge to ignore.

To add to this, I typically run pfSense (at 2GB RAM, but 1GB is enough for most people), FreeNAS (8GB RAM), a workstation VM (8GB), and a couple smaller VMs/containers. My total RAM usage at the moment is 22GB. However, with the heavier setup I'd be at around 48GB. That's 75% of the RAM I have, which leaves me very little flexibility. And to upgrade to 128GB of RAM it'd cost me several hundred dollars, which I'm not looking to spend right now. For enterprise, that might not be too much, but for a college student, it is plenty to prevent me from using applications which are used in real-world productions servers. I have a more powerful server in our club infrastructure I'll be using to learn some of these, but that's not an option to many people.

To recap, poor docs, (intentional) lack of common features (or support for them), and too high of computational resource requirements create a gatekeeping effect for people learning technologies at a smaller scale. While I don't expect that this will change overnight, I think it's something that projects need to be more aware of. There is a lot of really cool software out there, but much of it is not viable (having issues beyond just speed) when scaled down, and that's a loss for both developers learning software and platforms as well as the software and platforms that those developers could be building cool things on.