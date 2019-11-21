---
title: 'Styling for Print & Accessible Code'
date: Thu, 21 Nov 2019 15:30:00 +0000
draft: false
related:
  - "/blog/hugo.md"
  - "/blog/secure-cookies-behind-multiple-proxies.md"
tags: ['FOSS', 'Programming', 'Web Dev']
---

[When I moved to Hugo]({{< ref "/blog/hugo.md" >}}), one of the main goals was the generated site would be compatible with most media. This includes blog posts being printable and accessible.

<!--more-->

Print styling is because I occasionally use Print to PDF functionality when I need to send or archive my posts.

I didn't have many non-contrast accessibility issues since I've kept the HTML structure very basic.
I also managed to get away with only a little link styling for non-code contrast issues.
I discovered though that the contrast checker does not account for rgba/alpha/opacity on text so I converted several colors for testing (lazily calculated with SASS's `lighten`).

Here are the main points of what I learned while doing this.

## Browsers don't like printing flex

The biggest surprise for me with print was how badly `display: flex;` mangles pages.
Firefox in particular _really_ does not like to render `flex` content.
Therefore, I had to add `@media print` cases to undo where I use `display: flex;` in my code.

## Styling Code for Print

The main issue I had with printing was code.
To solve this, I've done two things.
First, I changed my syntax highlighting to the `bw` theme (a black & white theme) when using print.
Second, I added line wrapping for print using:

```css
@media print {
    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}
```

## Styling Code for Accessibility

While checking contrasts I found a glaring issue for my blog since I deal with code - the default syntax highlighting theme has some major contrast issues, with a dark pink-red on black to name the worst offender.
This lead me to run the contrast checker in WAVE extension ([Firefox](https://addons.mozilla.org/en-US/firefox/addon/wave-accessibility-tool/); [Chrome](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh?h1=en)) on [all of the Chroma styling samples at once](https://xyproto.github.io/splash/docs/longer/all.html), which is an excellent way to make your browser really slow.

Shockingly, only 5/37 themes passed the contrast checker with no issues: `borland`, `bw`, `pygments`, `rrt`, and `xcode`.
I excluded `bw` because I like color (although as mentioned above I use it for print styling) and `rrt` because I found it painful to read.
I ended up choosing `borland` because I aesthetically liked it the most.

I used [Hugo's syntax theme exporting](https://gohugo.io/content-management/syntax-highlighting/#generate-syntax-highlighter-css) via the following:

```sh
hugo gen chromastyles --style=monokai > syntax.css
```

After changing themes, I found that differentiating code and non-code wasn't visually obvious.
So I played with the contrast checker and found that `#f3f3f3` worked nicely as a background color (which I ended up adding for inline code separately).
However, I later realized that this created a contrast issue in the comment styling due to `borland`'s green color.
This ended up being fixed by replacing it with `pygments`' green (`#008000` instead of `#008800`).

I'm not totally in love with `borland` so I may play around with the styling later, but it still looks reasonably good while being accessible. A dark theme is also something to look at later on.

## Conclusion

The resulting theme is also very small, which means that it works on AMP without inline styles.
You can see the theme [demo-ed in this post]({{< ref "/blog/secure-cookies-behind-multiple-proxies.md" >}}) and [the code on GitHub](https://github.com/ct-martin/blog.ctmartin.me/blob/master/themes/ctmartin/assets/css/syntax-highlighting.scss).

I can now happily say that as far as I am aware, my blog has no contrast issues and is print-compatible.
You're welcome to [file a bug here](https://github.com/ct-martin/blog.ctmartin.me/issues) if you find it's not.