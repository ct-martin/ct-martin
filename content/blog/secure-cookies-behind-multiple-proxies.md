---
title: 'Secure cookies behind multiple proxies'
date: Tue, 08 Jan 2019 21:07:55 +0000
draft: false
tags: ['Servers', 'Uncategorized', 'Web Dev']
---

Security is an important aspect of running a modern website, and part of that is ensuring the security of cookies and other data the attached to a given user. Here is what I learned while implementing `Secure` cookies on a project.

<!--more-->

The `Secure` attribute for browser cookies instructs the browser to only use a "secure" channel to send cookies to the server. This typically includes using HTTPS only (no unencrypted HTTP), but some servers (like [Express.js](https://expressjs.com/)) also invalidate cookies coming from proxies.

(Reverse) Proxies are used to web requests to the correct one of a number of apps from a single IP address. For example, this site, `ctmartin.me`, also hosts `blog.ctmartin.me`, and the proxy makes sure that my main site goes to a PHP container while the blog goes to my Wordpress instance. However, both applications are hosted from the same machine and use the same IP address.

However, many things, like my site, actually have multiple proxies. I use [Cloudflare](https://www.cloudflare.com/) to protect the machine running this site since I don't have the bandwidth, computation power, or desire to fight off all attackers myself. Cloudflare runs a reverse proxy on their servers that do things like protecting me from DDoS attacks and forcing users to use HTTPS (among other security measures).

However, as mentioned before, `Secure` cookies can be invalidated if they are behind a proxy. And these moving parts are across the internet from each other! What to do?

*   Since it's not generally not reasonable to set up a local environment to test this, I want it only in production
*   I need to allow access from trusted proxies
*   I need to restrict access to the domains on the outermost layer

In Express the first two parts are fairly easy. I can use an `if` statement and `app.set('trust proxy', 2);` to tell Express to trust the first two proxies ([Heroku](https://www.heroku.com/home)/[Dokku](http://dokku.viewdocs.io/dokku/) and Cloudflare).

The last part is a bit trickier however. It turns out that in the current version of Express (at the time of writing, 4.16.x) that Express [returns a comma-delimited list of hostnames](https://github.com/expressjs/express/issues/3494) (inc. internal names from the proxies) rather than the hostname of the request. So before I can validate the hostname I need to first polyfill a fix for that behavior.

Here is the final code for doing this:

```js
// app.js  
const mw = require('./middleware');

// ...

const sessObjConfig = {  
  // other express-session settings  
};

if(process.env.NODE_ENV === 'production') { // you will likely need to set this environment variable on your container host
  app.use(mw.requireAllowedDomain);
  sessObjConfig.cookie.secure = true;
  app.set('trust proxy', 2); // this number may vary based on your configuration
}

const sessionObj = session(sessObjConfig);
  
// ...
```

```js
// middleware/index.js  
const allowedDomainList = [  
  'example.com',
];

const requireAllowedDomain = (req, res, next) => {  
  let { hostname } = req;  
  
  // polyfill for Express <4.17  
  if(req.hostname.includes(',',1)) {  
    hostname = req.hostname.split(',')[0];  
  }  
  
  if(!allowedDomainList.includes(hostname)) {  
    return res.status(400);  
  }  
  
  return next();  
};

module.exports.requireAllowedDomain = requireAllowedDomain;
```

A better way of doing this would be to have a list of all IP addresses for remote proxies, however, that's more complicated since Cloudflare and Heroku (hosted on AWS) have large ranges of IPs. You can [find more documentation here](https://expressjs.com/en/guide/behind-proxies.html) if you're interested.

---

_This was learned while working on a research project with_ [_Professor Owen Gottlieb_](http://owengottlieb.org/)_._

---

_Updates:_  
_2019-07-31: Content reflow_