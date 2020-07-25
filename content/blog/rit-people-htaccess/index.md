---
title: Protecting content on people.rit.edu
date: Fri, 27 Mar 2020 10:41:00 +0000
draft: false
tags: ['RIT', 'Web Dev']
---

`people.rit.edu` is an RIT web server students, faculty, and staff can upload files and simple websites to.

<!--more-->

While there are pretty much only the normal RIT computer usage rules in place, RIT also gives the following statement:

> People sites are strongly recommended for personal use. This can extend to coursework and projects assigned by RIT faculty to students. However, if you are looking to create a website to fulfill strictly RIT-affliated purposes, including, but not limited to, official clubs and organizations, academic programs, colleges and their departments, and campus-wide events, please consider submitting a request for an official web account.

More info, including how to log in, can be found here: https://www.rit.edu/webdev/people

The server is accessible via SSH and SFTP, so note that some techincal ability is required; there are no web-based upload forms.
I personally like [FileZilla](https://filezilla-project.org/) for uploading files to `people`. If you've used FTP (but not SFTP), it works the same in FileZilla, except you set the protocol to SFTP and/or prepend the host name with `sftp://` (depending on which menu you use). [WinSCP](https://winscp.net/eng/index.php) is another popular option.

While normally I advocate keeping things as open access as possible, sometimes you have content that needs to be secured.
This could be a class assignment that you can't make public yet, a prototype that isn't ready to be seen by the world, or content that needs to be distributed but is sensitive enough that you can't (or don't want to) post it publically to the whole world.

Thankfully, RIT's `people` server has integration with Shibboleth (that thing that you have to log into for myCourses and almost everything else RIT online).
Using Shibboleth is really easy, you only need to create a file called `.htaccess` in the folder you want to protect.

A `.htaccess` file gives Apache (the web server software) instructions for how to handle a subsection of what's on the web server.

On `people`, all users have a folder in their home directory (`/home/abc1234/`) called `www/`, which is maps to the url `people.rit.edu/~abc1234/` (where `abc1234` is an RIT username in all examples).

## The Basics

Here's a basic `.htaccess` file that sets a folder so users need to log in with their RIT account to access:

```
AuthType shibboleth
ShibRequireSession On
SSLRequireSSL
Require valid-user
```

Windows computers don't like creating with file starting with a period, but you can get it to work from some save menus, or call it `htaccess` (no period) and rename it after you upload it.

## Slightly more complicated

That `Require` statement is the one that controls who is let in; the rest is just to tell the server to use Shibboleth.
The `Require` supports other options as well, including IP addresses and specific users.
`Require` statements are also a logical "or", meaning that chaining multiple statements only requires that at least one of them passes.

For example, the following `.htaccess` file will require login for users off-campus:

```
AuthType shibboleth
ShibRequireSession On
SSLRequireSSL
Require valid-user       # Allow authenticated users
Require ip 129.21.0.0/16 # Allow users on-campus
```

(Note: anything after a `#` is a comment and can be omitted safely)

To allow a specific user, use:

```
Require user abc1234
```

This can also take multiple arguments:

```
Require user abc1234 def5678
```

What about excluding a subfolder from these protections?
We can do that too! `.htaccess` files inherit the settings in all parent folders, but the all settings specified in a subfolder take precendence.

You can turn Shibboleth off in a subfolder by adding an `.htaccess` file in that subfolder with the following:

```
Require all granted
```

## Advanced Usage

Another useful IP range for some class assignments in web development is the W3C validator, which can be included with:

```
Require ip 128.30.52.0/24
```

(This IP range was found on: https://validator.w3.org/services#blocking )

While Apache removed support for getting groups from Shibboleth, you can write your own groups in a plain text file, for example, at `/home/abc1234/acl-groupfile`:

```
group1: abc1234
group2: abc1234 def5678
```

Then, you can specify this file and use it in `Require` statements:

```
AuthType shibboleth
ShibRequireSession On
SSLRequireSSL
AuthGroupFile /home/abc1234/acl-groupfile
Require group group1
```

`Require ip` and `Require group`, like `Require user`, can accept multiple parameters.
For example:

```
Require group group1 group2
```


Want to get even fancier?
You can bump unauthenticated users to a separate public folder with these:

```
# ~/www/.htaccess
# Redirect user folder to public/
Options +FollowSymlinks
RewriteEngine on
RewriteBase /~abc1234/
RewriteCond "%{REQUEST_URI}" "~abc1234/$"
RewriteRule "^(.*)$" public

# Require Shibboleth auth (disabled in /public via .htaccess there)
AuthType shibboleth
ShibRequireSession On
SSLRequireSSL
Require valid-user

# Disable Shib for just user folder
# (excluding things in user folder; allows redirect to happen)
SetEnvIf Request_Uri ~abc1234/$ NOAUTH
Require env NOAUTH
```

```
# ~/www/public/.htaccess
# Disable Shibboleth
Require all granted
```

If a user visits your folder at `people.rit.edu/~abc1234/`, they will get redirected to `people.rit.edu/~abc1234/public/`.
Other files and folders aren't affected by this, it only takes effect if the user folder itself is visited.

While we're on the topic of `.htaccess` files, the following are frequently helpful to set on `people`:

```
ModPagespeed off
ExpiresActive On
ExpiresDefault now
```

## Notes & More Reading

* https://www.rit.edu/webdev/people/file-permissions (if your files aren't accessible, start here)
* https://www.rit.edu/webdev/people/htaccess (parts are out of date, but still useful)
* https://httpd.apache.org/docs/2.4/mod/mod_authz_core.html#require
* https://wiki.shibboleth.net/confluence/display/SP3/htaccess
* Technically, your user URL is also aliased to `people.rit.edu/abc1234/` (no `~`), but this causes some PHP scripts to misbehave; using `people.rit.edu/~abc1234/` (with the `~`) is preferrable
* These instructions should largely work on other Apache web servers with the Shibboleth module installed
* Some statement names appear to have been changed in other versions of Apache and Shibboleth; these are what seem to work on `people`
  * It appears that `ShibRequireSession On` and `SSLRequireSSL` might no longer be needed, but both the Shibboleth and RIT docs recommend it and I can't find/access the config on the server
  * Eventually, `Require valid-user` and `Require user` will be replaced by `Require shib-session` and `Require shib-user`, respectively