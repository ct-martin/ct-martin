---
title: Email Security
date: 2020-07-02
---
To combat spam there are three methods that email uses nowadays for verification.
These measures prevent spammers from impersonating you and getting you in trouble (such as ending up on a blocklist).
Let's look at what they are and how to safely implement them.

<!--more-->

## The What

* Sender Policy Framework (SPF) - defines which servers, by IP Address, are allowed to send messages on your behalf
* DomainKeys Identified Mail (DKIM) - a cryptographic signature which can be used to verify the sender
* Domain-based Message Authentication, Reporting, and Conformance (DMARC) - defines the policy for how to handle messages using SPF and DKIM

Here are a couple other terms that are relevant:
* Domain Name System (DNS) - converts text names (like ctmartin.me) into IP Addresses so a computer knows where to send data. Entries are called "records" and here are a few types that are relevant:
  * Mail eXchange (MX) - Defines which server(s) incoming mail should be sent to. We aren't going to be looking at this today.
  * Canonical Name (CNAME) - Defines a different location to look for this data (like an alias or pointer).
  * Text (TXT) - Literally text, certain syntaxes define functions. For example, starting with `v=spf1` will define an SPF policy. SPF, DKIM, and DMARC are all based on TXT records.

Also, as a note, this is trying to cover the baseline of these practices; I'm not getting into policies for subdomains and subdomain alignment.

Another important note is that DNS records can take up to 72 hours to propogate (although really good services can do it in ~30 seconds).
If your records seem to be set up correctly but aren't being detected or applied correctly, they might still be propogating to other DNS servers.

## First: Auditing

SPF, DKIM, and DMARC allow you to ease-in so that you don't start blocking anything you forgot about.
However, the end goal is enforcement, where any services you didn't specify are actively blocked.

The first thing to do is determine what programs you're already using to send messages.
This includes whatever you use to send email, any mailing lists, and other servers that might send emails.

Here is documentation for a few providers that may be useful throughout this process:
* G Suite: [SPF](https://support.google.com/a/answer/33786?hl=en), [DKIM](https://support.google.com/a/answer/174124), [DMARC](https://support.google.com/a/answer/2466580)
* Microsoft 365: [SPF](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/set-up-spf-in-office-365-to-help-prevent-spoofing?view=o365-worldwide), [DKIM](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide), [DMARC](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dmarc-to-validate-email?view=o365-worldwide)
* [ProtonMail](https://protonmail.com/support/knowledge-base/anti-spoofing/)
* Mailgun: [SPF & DKIM](https://documentation.mailgun.com/en/latest/quickstart-sending.html#add-sending-tracking-dns-records), [DMARC](https://www.mailgun.com/blog/domain-reputation-and-dmarc/)
* SendGrid: [SPF](https://sendgrid.com/blog/sender-policy-framework/), [DKIM](https://sendgrid.com/blog/how-to-use-dkim-to-prevent-domain-spoofing/), [DMARC](https://sendgrid.com/blog/what-is-dmarc/)
* [Mailchimp](https://mailchimp.com/help/set-up-custom-domain-authentication-dkim-and-spf/)

## Easing In

After identifying your initial services you want to create a policy that defines them as valid.
However, at this point you likely don't want to turn on enforcement yet because that would block anything you might have forgotten.
Let's start by creating records that are neutral or soft-fail (fail but do not block), which is close to the default.

Most services have instructions and also check that at least their part is set up correctly before allowing you to start using them (however, that's not always the case and many also only check SPF).

### SPF

SPF policies are created as TXT records at the root of the domain you want them to apply to (sometimes referred to as `@`).

Here is a soft-fail SPF record:

```
v=spf1 ~all
```

This tells any receiving servers that messages will fail but not to block them.
You can allow services, for example with an `include` statement. Here's an example including G Suite:

```
v=spf1 include:_spf.google.com ~all
```

You can only have one policy per domain, but you can include multiple services. For example, here's G Suite and Microsoft 365:

```
v=spf1 include:_spf.google.com include:spf.protection.outlook.com ~all
```

### DKIM

DKIM gives a list of valid keys; it doesn't define policy.
So all we need to do is add keys for any allowed services.
Each key has an identifier, formally called a selector.
Selectors are part of the DNS record's name.
For example, `selector1` becomes `selector1._domainkey` (in long form, using `ctmartin.me`, `selector1._domainkey.ctmartin.me`).

Some services (like G Suite) give you a TXT record to copy.
Others (like Microsoft 365) give you a CNAME that points at their own servers.
Both are valid methods.
Follow the instructions for the service you use to add your keys.

If the service uses a CNAME, they'll tell you where to point it.
If they give you a TXT record, you'll add something like this:

```
k=rsa; p=...
```

#### Microsoft 365

Microsoft 365 is a little complicated, so I'm going to write out the instructions here.
This is a combination of the documentation on [how to connect to the Exchange server](https://docs.microsoft.com/en-us/powershell/exchange/connect-to-exchange-online-powershell?view=exchange-ps) and [how to create a DKIM key](https://docs.microsoft.com/en-us/microsoft-365/security/office-365-security/use-dkim-to-validate-outbound-email?view=o365-worldwide).
At time of writing, these commands can be copy-pasted, but this may change in the future.
This also works with PowerShell on Linux.
Run `New-DkimSigningConfig` for each domain you want DKIM enabled on, replacing `<domain>` with the domain name (e.g. `ctmartin.me`).

```ps
$UserCredential = Get-Credential

$Session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri https://outlook.office365.com/powershell-liveid/ -Credential $UserCredential -Authentication Basic -AllowRedirection

Import-PSSession $Session -DisableNameChecking

New-DkimSigningConfig -DomainName <domain> -KeySize 2048 -Enabled $True

Remove-PSSession $Session
```

Then create a CNAME record for `selector1._domainkey` pointing to
`selector1-<domainGUID>._domainkey.<initialDomain>.onmicrosoft.com`

`domainGUID` is your domain, replacing periods with dashes; `initialDomain` is the subdomain you got from Microsoft (visible in the Domains section of the Admin panel).

For example, `selector1-ctmartin-me._domainkey.ctmartinme.onmicrosoft.com`

Repeat, replacing `selector1` with `selector2`

### DMARC

To create a basic DMARC policy that does nothing, add the following as a TXT record with the name `_dmarc`:

```
v=DMARC1; p=none;
```

For DMARC to pass, it needs either SPF to pass or a valid DKIM signature.
However, you really should have both.

### Testing

If you send an email to an email on a different domain (such as a personal email), you can look at the headers to see if it passed.

In Gmail/G Suite (on the web), click the `...` icon (next to reply and print) and click "View original message".
In Outlook online, click the `...` (also next to reply), and click "View > View message details".

Gmail/G Suite will show you at the top summary if SPF and DKIM passed.
For Exchange (but also works in Gmail/G Suite and others), look for the text `Authentication-Results`, which will be followed by the results of SPF, DKIM, and DMARC.
Here is an example with some details removed and formatted for readability:

```
Authentication-Results: 
 spf=pass (sender IP is ...) smtp.mailfrom=...;
 dkim=pass (signature was verified) header.d=v...;
 dmarc=pass action=none header.from=...
```

As you can see, this email passed SPF, DKIM, and DMARC.

Sometimes though, mailing list software that forwards your email to a group can break DKIM signatures if it modifies the body.
A good, modern mailing list might use (technically "experimental") [ARC signing](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) to combat this, but not all do.
If you have this issue, it should only affect the mailing list recipients and there's not much you can do about it.

If this happens, or if you don't have SPF or DKIM set up correctly for a service, you might see something like the following:

```
Authentication-Results:
  ...
  dkim=neutral (body hash did not verify)
  header.i=... header.s=... header.b=...;
  arc=fail (body hash mismatch);
  spf=pass (google.com: domain of ... designates ... as
  permitted sender) smtp.mailfrom=...
```

Since DKIM doesn't specify policy (only specifies allowed keys), the result is "neutral" instead of "pass."
However, this is effectively the same as a "fail" and Gmail/G Suite will say that in its summary.
While the DMARC result wasn't listed, it passed DMARC because SPF passed, but ended up throwing a warning still.

TL;DR, you might not always have control over DKIM if you're using a mailing list, but you want all of SPF, DKIM, and DMARC to pass.
They don't guarantee getting past a spam filter, but not passing might get you caught in the spam filter.

## Monitoring

Once you've set up a soft-fail system, the next step is watching to see what happens.
DMARC has a mechanism for aggregate reports on the pass/fail results using the `rua` property.
However, these reports are annoying to read, so let's use a free (as in cost) service to parse them and show us the results in an easy-to-read manner.

I'm currently trying out [Valimail](https://www.valimail.com/dmarc-monitor/), which was the only free offering I found linked from the Microsoft Information Security Alliance website.

You'll change your DMARC record to look like the following:

```
v=DMARC1; p=none; rua=mailto:dmarc_agg@vali.email;
```

Any mail servers that participate in DMARC aggregate reporting will send their reports to Valimail daily, which you can then see in the app (it's also supposed to send a monthly summary, but I haven't been using it long enough to test that yet).
If you find anything that should be valid but is not passing DMARC, add the relevant SPF and DKIM records.
Once the SPF and DKIM records exist, they should be passing.

## Enforcement

Once all the services you want to have passing are passing, it's time to move to the enforcement phase.
This is where spam is actually blocked.
To do this, we modify the SPF and DMARC policies to start failing (and thus start blocking) services which do not pass.

For SPF, change `~all` (soft-fail; fail but do not block) to `-all` (fail and block).

For DMARC, change `p=none` to `p=reject`

## Example

These are all public anyway, so here are the records for `ctmartin.me` (formatted as `NAME TYPE VALUE` with quotes added around TXT values and `@` representing the root):

```
selector1._domainkey CNAME selector1-ctmartin-me._domainkey.ctmartinme.onmicrosoft.com
selector2._domainkey CNAME selector2-ctmartin-me._domainkey.ctmartinme.onmicrosoft.com

@ TXT "v=spf1 include:spf.protection.outlook.com -all"

_dmarc TXT "v=DMARC1; p=reject; rua=mailto:dmarc_agg@vali.email;"
```

In ISC BIND (RFC 1035) format these look like the following:

```
selector1._domainkey.ctmartin.me.	1	IN	CNAME	selector1-ctmartin-me._domainkey.ctmartinme.onmicrosoft.com.
selector2._domainkey.ctmartin.me.	1	IN	CNAME	selector2-ctmartin-me._domainkey.ctmartinme.onmicrosoft.com.
ctmartin.me.	1	IN	TXT	"v=spf1 include:spf.protection.outlook.com -all"
_dmarc.ctmartin.me.	1	IN	TXT	"v=DMARC1; p=reject; rua=mailto:dmarc_agg@vali.email;"
```

### If you don't send email

Even if you aren't sending emails it's important to provide policies to disallow using your domain for email.
Just because you aren't using for email doesn't mean spammers can't impersonate it and get you on a blocklist.

To do this, don't add any DKIM keys and add the following policies:

* SPF: `v=spf1 -all`
* DMARC: `v=DMARC1; p=reject;`

This says no IP Addresses are allowed to send emails for your domain, and any email that don't pass (which will be all of them) should be rejected.