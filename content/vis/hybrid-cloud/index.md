---
title: Hybrid Clouds
date: 2020-08-12
libs:
- mermaid
related:
- "/vis/api-in-mermaid"
---
Since I haven't posted about servers in a while, I thought I'd take a look at how I'm utilizing a hybrid cloud for my infrastructure.

<!--more-->

Visuals are fun, so lets starts there.
I tried to make the most complete view as I could:

{{< div class="mermaid" >}}
graph LR
  inet(Internet)
  prem[On-Prem Servers]
  gh(GitHub)
  gl(GitLab)
  ms(Microsoft 365)
  vali(Valimail)

  inet-->gh
  inet-->gl
  gh-->gl
  inet-->ms

  subgraph cf [Cloudflare Edge Network]
    edge(Edge Proxy)
    faas[Serverless/FaaS Workers]
    dns[DNS]

    edge-->faas
  end


  inet-->edge
  dns-->inet
  edge-->gh
  edge-->gl
  edge-.->ms

  subgraph vps [Virtual Server/VPS]
    vpn[VPN]
    SSH
    Nginx

    subgraph Docker
      builder[/Builder/]
      app1[App 1]
      app2[App 2]
      db[(Database)]

      builder-.->app1
      builder-.->app2
      app2-->db
    end

    SSH-->builder
    Nginx-->app1
    Nginx-->app2
    Nginx-->Nginx
    misc[Apache/Misc]
    Nginx-->misc
  end

  edge-->vpn
  edge-->SSH
  edge-->Nginx
  vpn-->prem
  inet-.->vali
{{< /div >}}

Here's the buzzword bingo version of what I'm using:

{{< div class="mermaid" >}}
graph LR
  inet(Internet)
  vps[Virtual Server/Cloud Hosting]
  prem[On-Prem Servers]
  saas(SaaS/Managed Service)

  subgraph cf [Edge Network]
    edge(Edge Proxy)
    faas[Serverless/FaaS]

    edge-->faas
  end

  inet-->edge
  edge-->vps
  vps-->prem
  edge-->saas
{{< /div >}}

## From the top

{{< div class="mermaid" >}}
graph TD
  user[User]
  cf(Cloudflare)
  static[Static Hosting]
  cfworkers[Cloudflare Workers]
  vps[VPS]
  ms[Microsoft 365]
  prem[On-Prem Servers]

  user-->cf
  cf-->static
  cf-->cfworkers
  cf-->vps
  cf-->ms
  vps-->prem
{{< /div >}}

Cloudflare acts are the edge of my websites.
It handles DNS, security, proxying/caching, and general routing.

{{< div class="mermaid" >}}
sequenceDiagram
  participant User
  participant Cloudflare
  participant Origin

  User->>+Cloudflare : Requests Page
  opt security upgrade
    Cloudflare->>User : Redirect/Upgrade
  end
  alt in cache
    Cloudflare->>User : Serves from Cache
  else not in cache
    Cloudflare->>Origin : Requests Page
    Origin-->>Cloudflare : (Page)
    opt cacheable
      Cloudflare->>Cloudflare : Puts in Cache
    end
    Cloudflare->>-User : Serves Response
  end
{{< /div >}}

I use static hosting for most of my sites.
Specifically, I tend to use [GitLab Pages](https://about.gitlab.com/stages-devops-lifecycle/pages/) because of convenience, custom TLS certs, and support for a variety of frameworks.
My static sites mainly get generated with [GitLab CI](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/), [Hugo](https://gohugo.io/), and [Nuxt](https://nuxtjs.org/), although I also have some other things too.
These static sites can still callback to other sites for dynamic behavior.
A good example of this is [Find](https://ctmartin.dev/projects/find), a search engine for my sites:

{{< div class="mermaid" >}}
sequenceDiagram
  participant User
  participant Search
  participant Cloudflare
  participant APIs

  User->>+Search : Loads Page
  Search->>Cloudflare : Requests Content
  alt in cache
    Cloudflare->>Search : Serves from Cache
  else not in cache
    Cloudflare->>APIs : Requests Page
    APIs-->>Cloudflare : (Page)
    opt cacheable
      Cloudflare->>Cloudflare : Puts in Cache
    end
    Cloudflare->>Search : Serves Response
  end
  Search->>Search : Parses Data
  Search->>-User : Presents Experience
{{< /div >}}

Cloudflare Workers handle small serverless functions.
Currently, the main use is to [be an oEmbed Provider](https://ctmartin.dev/projects/oembed) by scraping my site for metadata.
The logic flow for this is very similar to my static sites, but happens behind Cloudflare instead of in front of it.

{{< div class="mermaid" >}}
sequenceDiagram
  participant User
  participant Cloudflare
  participant worker as oEmbed Worker
  participant Origin

  User->>Cloudflare : Requests oEmbed
  Cloudflare->>+worker : Runs Worker
  worker->>Cloudflare : Requests Page
  alt in cache
    Cloudflare->>worker : Serves from Cache
  else not in cache
    Cloudflare->>Origin : Requests Page
    Origin-->>Cloudflare : (Page)
    opt cacheable
      Cloudflare->>Cloudflare : Puts in Cache
    end
    Cloudflare->>worker : Serves Response
  end
  worker->>worker : Scrapes Data
  worker->>-User : Presents Experience
{{< /div >}}

I have a VPS hosted on DigitalOcean, which has a VPN "roundabout" (as I've taken to calling it) and can host backend apps.

{{< div class="mermaid" >}}
graph LR
  Me
  inet([Internet])
 
  Me-->inet

  subgraph VPS
    ssh[SSH]
    vpn[Roundabout]
    nginx[Nginx]
  end

  inet-->ssh
  inet-->vpn
  inet-->nginx
{{< /div >}}

The roundabout is called as such because it simply forwards the VPN clients to each other over the bridge; it doesn't provide full client-to-site (another tunnel does that), but it does allow me to do firewall punching when I can't port foward.

{{< div class="mermaid" >}}
graph BT
  inet([Internet])
  vps[VPS]
  me[Me]
  prem[On-Prem]

  me-->inet
  inet-->vps
  prem-->inet
  subgraph Roundabout
    subgraph tun2 [Client-to-Site]
      me-. via Roundabout .->prem
    end
    me-.->vps
    prem-.->vps
  end
{{< /div >}}

The VPN, however, does allow me to host apps from my server.
I've used this for a variety of things, including private DNS, internal (dev/testing) websites, data storage, Jupyter Lab, and hosting apps like Nextcloud or Gitea.

{{< div class="mermaid" >}}
graph LR
  inet([Internet])

  subgraph VPS
    nginx[Nginx]

    nginx-- TLS Termination -->nginx

    subgraph dokku [Dokku/Docker]
      app1[App 1]
      app2[App 2]
      db[(Database)]

      app2-->db
    end

    nginx-->app1
    nginx-->app2

    misc[Apache/Misc]
    nginx-->misc
  end

  inet-->nginx
{{< /div >}}

There's a second part to this though, which is that [Dokku](http://dokku.viewdocs.io/dokku/) provides me git hooks to run Heroku buildpacks on push.

{{< div class="mermaid" >}}
graph LR
  CI

  subgraph VPS
    SSH

    subgraph dokku [Dokku/Docker]
      Builder[/Builder/]
      app1[App 1]
      app2[App 2]
      db[(Database)]

      Builder-.->app1
      Builder-.->app2
      app2-->db
    end

    SSH-->Builder
  end

  CI-->SSH
{{< /div >}}

Finally, Microsoft 365 is used for email, although it also has Teams (and related) functionality enabled.
Valimail is also used for [DMARC monitoring](https://blog.ctmartin.me/2020/07/email-security/).

{{< div class="mermaid" >}}
graph TD
  Sender
  Recipient

  subgraph srv [Managed Services]
    subgraph ms [Microsoft 365]
      Inbox[My Inbox]
    end
    subgraph DNS
      cf[Cloudflare]
    end
  end

  Sender-- Email -->Inbox
  Inbox-- Email -->Recipient
  cf-. MX  .->Sender
  cf-. SPF,DKIM,DMARC .->Recipient
  Recipient-- DMARC Report -->Valimail
{{< /div >}}

## Deploying

Some things, like my VPS and on-prem servers, are managed somewhat manually.
Others, like Cloudflare and Microsoft 365, are unmanaged.
However, I have a variety of CI/CD pipelines set up to manage most of my sites.
All pipelines are designed to have minimal intervention; a push to GitHub should be all that's needed.

Cloudflare Workers are [deployed via GitHub Actions](https://github.com/cloudflare/wrangler-action):

{{< div class="mermaid" >}}
sequenceDiagram
  participant Me
  participant GitHub
  participant actions as GitHub Actions
  participant Cloudflare

  Me->>GitHub : Push Commit
  GitHub->>actions : Runs Workflow
  actions->>Cloudflare : Deploys
{{< /div >}}

Static Pages are usually generated using GitLab CI and then hosted by GitLab Pages:

{{< div class="mermaid" >}}
sequenceDiagram
  participant Me
  participant GitHub
  participant GitLab
  participant pages as GitLab Pages
  participant Cloudflare

  Me->>GitHub : Push Commit
  GitHub->>+GitLab : Webhook
  GitLab->>GitHub : Fetch Repo
  GitHub-->>GitLab : (Repo)
  GitLab->>GitLab : CI Build
  GitLab->>pages : Deploy
  GitLab->>Cloudflare : Purge Cache
  GitLab->>-GitHub : Reports Pass/Fail
{{< /div >}}

Dynamic apps, like [rimg](https://github.com/ct-martin/rimg), may have GitHub Actions testing for commits and PRs, as well as GitLab CI deploying to my VPS:

{{< div class="mermaid" >}}
sequenceDiagram
  participant Me
  participant Contributor
  participant GitHub
  participant actions as GitHub Actions
  participant GitLab
  participant VPS

  loop PR or Push
    Contributor->>GitHub : Push Commit
    GitHub->>+actions : Runs Tests
    actions->>-GitHub : Reports Pass/Fail
  end

  loop Merge to Main Branch
    Me->>GitHub : Push Merge
    GitHub-->>+actions : Runs Tests
    actions-->>-GitHub : Reports Pass/Fail
    GitHub->>+GitLab : Webhook
    GitLab->>GitHub : Fetch Repo
    GitHub-->>GitLab : (Repo)
    GitLab->>GitLab : Run Tests
    GitLab->>+VPS : Deploy
    VPS->>VPS : Compiles
    VPS->>VPS : Runs via Docker
    VPS->>VPS : Health Check
    VPS-->>-GitLab : (Pass/Fail)
    GitLab->>-GitHub : Reports Pass/Fail
  end
{{< /div >}}

## Optimizing for Cost

As a college student, you don't have much of time or budget to work with.
However, there are a _ton_ of free and cheap options available if you look around enough.
Everything I have in the cloud currently costs about $12.75/month.
This includes domain names, edge computing, VPS, email, and dynamic apps (LAMP, PaaS, SaaS).

{{< div class="mermaid" >}}
pie
  title Cost Breakdown/Month
  "Domains ($33/yr)" : 2.75
  "VPS ($5/mon)" : 5
  "Email ($5/mon)" : 5
{{< /div >}}

Over time, this has lead to some design choices that are intentionally lightweight, particularly a focus on static sites and managed services.
Here's a short list of some of the cost-saving measures I've done:

* VPS also taking on the roles of Shared (LAMP) Hosting + Heroku/PaaS/Kubernetes
  * If you use lightweight tools for management, you don't need much
* Public GitHub & GitLab instead of self-hosted
  * Both are free for Open Source, which pretty much everything I do is
  * GitHub Pages & GitLab Pages instead of Shared Hosting
    * Static sites instead of WordPress/PHP-based sites
* Cloudflare to protect VPS & unify experience
  * Cloudflare Workers to move load off VPS

Well, that was fun but that's all I have for now.
Ciao :wave:
